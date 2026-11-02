package com.hirehub.service.impl;

import com.hirehub.dto.request.CandidateProfileUpdateRequest;
import com.hirehub.dto.request.EducationDto;
import com.hirehub.dto.request.WorkExperienceDto;
import com.hirehub.dto.response.CandidateProfileResponse;
import com.hirehub.dto.response.DashboardStatsResponse;
import com.hirehub.entity.CandidateProfile;
import com.hirehub.entity.Education;
import com.hirehub.entity.User;
import com.hirehub.entity.WorkExperience;
import com.hirehub.enums.ApplicationStatus;
import com.hirehub.exception.BadRequestException;
import com.hirehub.exception.ResourceNotFoundException;
import com.hirehub.exception.UnauthorizedException;
import com.hirehub.mapper.EntityDtoMapper;
import com.hirehub.repository.CandidateProfileRepository;
import com.hirehub.repository.JobApplicationRepository;
import com.hirehub.repository.JobRepository;
import com.hirehub.repository.UserRepository;
import com.hirehub.security.UserPrincipal;
import com.hirehub.service.CandidateService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
public class CandidateServiceImpl implements CandidateService {

    private final CandidateProfileRepository candidateProfileRepository;
    private final UserRepository userRepository;
    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final EntityDtoMapper mapper;
    private final Path fileStorageLocation;

    public CandidateServiceImpl(
            CandidateProfileRepository candidateProfileRepository,
            UserRepository userRepository,
            JobApplicationRepository applicationRepository,
            JobRepository jobRepository,
            EntityDtoMapper mapper,
            @Value("${hirehub.upload.dir:uploads/resumes}") String uploadDir) {
        this.candidateProfileRepository = candidateProfileRepository;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.mapper = mapper;
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create resume upload directory.", ex);
        }
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new UnauthorizedException("User is not authenticated");
        }
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    private CandidateProfile getOrCreateCandidateProfile(User user) {
        return candidateProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    CandidateProfile newProfile = new CandidateProfile(user);
                    return candidateProfileRepository.save(newProfile);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateProfileResponse getMyProfile() {
        User user = getAuthenticatedUser();
        CandidateProfile profile = getOrCreateCandidateProfile(user);
        return mapper.toCandidateProfileResponse(profile);
    }

    @Override
    @Transactional
    public CandidateProfileResponse updateMyProfile(CandidateProfileUpdateRequest request) {
        User user = getAuthenticatedUser();
        if (StringUtils.hasText(request.getFullName())) {
            user.setFullName(request.getFullName().trim());
            userRepository.save(user);
        }

        CandidateProfile profile = getOrCreateCandidateProfile(user);
        profile.setPhone(request.getPhone());
        profile.setHeadline(request.getHeadline());
        profile.setSummary(request.getSummary());
        profile.setCurrentLocation(request.getCurrentLocation());
        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setGithubUrl(request.getGithubUrl());
        profile.setPortfolioUrl(request.getPortfolioUrl());
        profile.setSkillsText(request.getSkillsText());

        if (request.getEducations() != null) {
            profile.getEducations().clear();
            for (EducationDto eduDto : request.getEducations()) {
                Education edu = new Education();
                edu.setCandidateProfile(profile);
                edu.setInstitution(eduDto.getInstitution());
                edu.setDegree(eduDto.getDegree());
                edu.setFieldOfStudy(eduDto.getFieldOfStudy());
                edu.setStartYear(eduDto.getStartYear());
                edu.setGraduationYear(eduDto.getGraduationYear());
                edu.setGrade(eduDto.getGrade());
                profile.getEducations().add(edu);
            }
        }

        if (request.getWorkExperiences() != null) {
            profile.getWorkExperiences().clear();
            for (WorkExperienceDto expDto : request.getWorkExperiences()) {
                WorkExperience exp = new WorkExperience();
                exp.setCandidateProfile(profile);
                exp.setCompanyName(expDto.getCompanyName());
                exp.setJobTitle(expDto.getJobTitle());
                exp.setLocation(expDto.getLocation());
                exp.setStartDate(expDto.getStartDate());
                exp.setEndDate(expDto.getEndDate());
                exp.setCurrentlyWorking(expDto.getCurrentlyWorking());
                exp.setDescription(expDto.getDescription());
                profile.getWorkExperiences().add(exp);
            }
        }

        CandidateProfile saved = candidateProfileRepository.save(profile);
        return mapper.toCandidateProfileResponse(saved);
    }

    @Override
    @Transactional
    public CandidateProfileResponse uploadResume(MultipartFile file) {
        User user = getAuthenticatedUser();
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded resume file cannot be empty");
        }

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String fileExtension = "";
        int extIndex = originalFilename.lastIndexOf('.');
        if (extIndex > 0) {
            fileExtension = originalFilename.substring(extIndex).toLowerCase();
        }

        if (!fileExtension.equals(".pdf") && !fileExtension.equals(".docx")) {
            throw new BadRequestException("Only PDF and DOCX files are allowed for resumes");
        }

        if (file.getSize() > 10 * 1024 * 1024) { // 10MB
            throw new BadRequestException("Resume file size exceeds maximum limit of 10MB");
        }

        String storedFileName = "resume_user_" + user.getId() + "_" + System.currentTimeMillis() + fileExtension;
        try {
            Path targetLocation = this.fileStorageLocation.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + storedFileName + ". Please try again!", ex);
        }

        CandidateProfile profile = getOrCreateCandidateProfile(user);
        profile.setResumeFileName(storedFileName);
        profile.setResumeOriginalName(originalFilename);
        profile.setResumeContentType(file.getContentType());
        profile.setResumeFileSize(file.getSize());

        CandidateProfile saved = candidateProfileRepository.save(profile);
        return mapper.toCandidateProfileResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Resource downloadResume() {
        User user = getAuthenticatedUser();
        CandidateProfile profile = getOrCreateCandidateProfile(user);
        if (!StringUtils.hasText(profile.getResumeFileName())) {
            throw new ResourceNotFoundException("No resume has been uploaded yet");
        }

        try {
            Path filePath = this.fileStorageLocation.resolve(profile.getResumeFileName()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Resume file not found on disk");
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("Resume file could not be read: " + ex.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        User user = getAuthenticatedUser();
        long totalApps = applicationRepository.countByCandidateId(user.getId());
        long pendingApps = applicationRepository.countByCandidateIdAndStatus(user.getId(), ApplicationStatus.APPLIED)
                + applicationRepository.countByCandidateIdAndStatus(user.getId(), ApplicationStatus.UNDER_REVIEW);
        long shortlistedApps = applicationRepository.countByCandidateIdAndStatus(user.getId(), ApplicationStatus.SHORTLISTED);
        long interviewApps = applicationRepository.countByCandidateIdAndStatus(user.getId(), ApplicationStatus.INTERVIEW);
        long selectedApps = applicationRepository.countByCandidateIdAndStatus(user.getId(), ApplicationStatus.SELECTED);

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalApplications", totalApps);
        metrics.put("pendingApplications", pendingApps);
        metrics.put("shortlistedApplications", shortlistedApps);
        metrics.put("interviewInvitations", interviewApps);
        metrics.put("selectedApplications", selectedApps);

        var recentApplications = applicationRepository.findTop5ByCandidateIdOrderByAppliedAtDesc(user.getId())
                .stream().map(mapper::toJobApplicationResponse).toList();

        return new DashboardStatsResponse(metrics, recentApplications);
    }
}
