package com.hirehub.service;

import com.hirehub.dto.request.CandidateRegisterRequest;
import com.hirehub.dto.request.LoginRequest;
import com.hirehub.dto.response.JwtAuthResponse;
import com.hirehub.entity.CandidateProfile;
import com.hirehub.entity.User;
import com.hirehub.enums.Role;
import com.hirehub.exception.DuplicateResourceException;
import com.hirehub.mapper.EntityDtoMapper;
import com.hirehub.repository.CandidateProfileRepository;
import com.hirehub.repository.CompanyRepository;
import com.hirehub.repository.RecruiterProfileRepository;
import com.hirehub.repository.UserRepository;
import com.hirehub.security.JwtTokenProvider;
import com.hirehub.security.UserPrincipal;
import com.hirehub.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private CandidateProfileRepository candidateProfileRepository;
    @Mock
    private RecruiterProfileRepository recruiterProfileRepository;
    @Mock
    private CompanyRepository companyRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtTokenProvider tokenProvider;
    @Mock
    private NotificationService notificationService;
    @Mock
    private EntityDtoMapper mapper;

    @InjectMocks
    private AuthServiceImpl authService;

    private User candidateUser;

    @BeforeEach
    void setUp() {
        candidateUser = new User("candidate@example.com", "encodedPass", "John Doe", Role.CANDIDATE);
        candidateUser.setId(1L);
    }

    @Test
    @DisplayName("Should successfully register a new candidate")
    void shouldRegisterCandidateSuccessfully() {
        CandidateRegisterRequest request = new CandidateRegisterRequest();
        request.setFullName("John Doe");
        request.setEmail("candidate@example.com");
        request.setPassword("Password123");
        request.setHeadline("Software Engineer");

        when(userRepository.existsByEmail("candidate@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123")).thenReturn("encodedPass");
        when(userRepository.save(any(User.class))).thenReturn(candidateUser);
        when(candidateProfileRepository.save(any(CandidateProfile.class))).thenReturn(new CandidateProfile(candidateUser));

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mock.jwt.token");

        JwtAuthResponse response = authService.registerCandidate(request);

        assertNotNull(response);
        assertEquals("candidate@example.com", response.getEmail());
        assertEquals("mock.jwt.token", response.getToken());
        assertEquals(Role.CANDIDATE, response.getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException if candidate email already exists")
    void shouldThrowExceptionWhenRegisteringDuplicateEmail() {
        CandidateRegisterRequest request = new CandidateRegisterRequest();
        request.setEmail("candidate@example.com");
        request.setPassword("Password123");
        request.setFullName("John Doe");

        when(userRepository.existsByEmail("candidate@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.registerCandidate(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should authenticate and login user successfully")
    void shouldLoginSuccessfully() {
        LoginRequest request = new LoginRequest("candidate@example.com", "Password123");
        Authentication auth = mock(Authentication.class);
        UserPrincipal principal = new UserPrincipal(1L, "candidate@example.com", "encodedPass", "John Doe", Role.CANDIDATE, true, Collections.emptyList());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("jwt.token.here");
        when(auth.getPrincipal()).thenReturn(principal);
        when(userRepository.findById(1L)).thenReturn(Optional.of(candidateUser));

        JwtAuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt.token.here", response.getToken());
        assertEquals("candidate@example.com", response.getEmail());
    }

    @Test
    @DisplayName("Should fail login with invalid credentials")
    void shouldFailLoginWithBadCredentials() {
        LoginRequest request = new LoginRequest("candidate@example.com", "WrongPassword");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
    }
}
