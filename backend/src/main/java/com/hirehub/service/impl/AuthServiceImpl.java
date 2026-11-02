package com.hirehub.service.impl;

import com.hirehub.dto.request.CandidateRegisterRequest;
import com.hirehub.dto.request.LoginRequest;
import com.hirehub.dto.request.RecruiterRegisterRequest;
import com.hirehub.dto.response.JwtAuthResponse;
import com.hirehub.dto.response.UserResponse;
import com.hirehub.entity.CandidateProfile;
import com.hirehub.entity.Company;
import com.hirehub.entity.RecruiterProfile;
import com.hirehub.entity.User;
import com.hirehub.enums.NotificationType;
import com.hirehub.enums.Role;
import com.hirehub.exception.BadRequestException;
import com.hirehub.exception.DuplicateResourceException;
import com.hirehub.exception.ResourceNotFoundException;
import com.hirehub.exception.UnauthorizedException;
import com.hirehub.mapper.EntityDtoMapper;
import com.hirehub.repository.CandidateProfileRepository;
import com.hirehub.repository.CompanyRepository;
import com.hirehub.repository.RecruiterProfileRepository;
import com.hirehub.repository.UserRepository;
import com.hirehub.security.JwtTokenProvider;
import com.hirehub.security.UserPrincipal;
import com.hirehub.service.AuthService;
import com.hirehub.service.NotificationService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final NotificationService notificationService;
    private final EntityDtoMapper mapper;

    public AuthServiceImpl(
            UserRepository userRepository,
            CandidateProfileRepository candidateProfileRepository,
            RecruiterProfileRepository recruiterProfileRepository,
            CompanyRepository companyRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider,
            NotificationService notificationService,
            EntityDtoMapper mapper) {
        this.userRepository = userRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.notificationService = notificationService;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public JwtAuthResponse registerCandidate(CandidateRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new DuplicateResourceException("User with email '" + request.getEmail() + "' already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setFullName(request.getFullName().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.CANDIDATE);
        user.setActive(true);
        User savedUser = userRepository.save(user);

        CandidateProfile profile = new CandidateProfile(savedUser);
        profile.setPhone(request.getPhone());
        profile.setHeadline(request.getHeadline());
        profile.setSkillsText(request.getSkills());
        candidateProfileRepository.save(profile);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        notificationService.createNotification(
                savedUser,
                "Welcome to HireHub! Complete your profile and upload your resume to get discovered by recruiters.",
                NotificationType.SYSTEM,
                "/candidate/profile"
        );

        return new JwtAuthResponse(token, savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole(), true);
    }

    @Override
    @Transactional
    public JwtAuthResponse registerRecruiter(RecruiterRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new DuplicateResourceException("User with email '" + request.getEmail() + "' already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setFullName(request.getFullName().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.RECRUITER);
        user.setActive(true);
        User savedUser = userRepository.save(user);

        Company company = new Company();
        company.setName(request.getCompanyName().trim());
        company.setWebsite(request.getCompanyWebsite());
        company.setLocation(request.getCompanyLocation());
        company.setDescription(request.getCompanyDescription());
        Company savedCompany = companyRepository.save(company);

        RecruiterProfile recruiterProfile = new RecruiterProfile(savedUser);
        recruiterProfile.setPhone(request.getPhone());
        recruiterProfile.setDesignation(request.getDesignation());
        recruiterProfile.setCompany(savedCompany);
        recruiterProfile.setApproved(false); // Initially pending admin approval
        recruiterProfileRepository.save(recruiterProfile);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        notificationService.createNotification(
                savedUser,
                "Your recruiter account has been registered and is pending administrator approval. You will receive an alert once approved.",
                NotificationType.SYSTEM,
                "/recruiter/dashboard"
        );

        return new JwtAuthResponse(token, savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole(), false);
    }

    @Override
    public JwtAuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Boolean isApproved = null;
        if (user.getRole() == Role.RECRUITER) {
            isApproved = recruiterProfileRepository.findByUserId(user.getId())
                    .map(RecruiterProfile::isApproved)
                    .orElse(false);
        } else if (user.getRole() == Role.ADMIN || user.getRole() == Role.CANDIDATE) {
            isApproved = true;
        }

        return new JwtAuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole(), isApproved);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new UnauthorizedException("No authenticated user session found");
        }
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapper.toUserResponse(user);
    }
}
