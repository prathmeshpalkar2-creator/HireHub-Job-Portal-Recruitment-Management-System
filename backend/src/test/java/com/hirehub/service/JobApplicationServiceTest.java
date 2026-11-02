package com.hirehub.service;

import com.hirehub.dto.request.ApplyJobRequest;
import com.hirehub.dto.response.JobApplicationResponse;
import com.hirehub.entity.Company;
import com.hirehub.entity.Job;
import com.hirehub.entity.JobApplication;
import com.hirehub.entity.User;
import com.hirehub.enums.ApplicationStatus;
import com.hirehub.enums.JobStatus;
import com.hirehub.enums.Role;
import com.hirehub.exception.BadRequestException;
import com.hirehub.exception.DuplicateResourceException;
import com.hirehub.mapper.EntityDtoMapper;
import com.hirehub.repository.*;
import com.hirehub.security.UserPrincipal;
import com.hirehub.service.impl.JobApplicationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobApplicationServiceTest {

    @Mock
    private JobApplicationRepository applicationRepository;
    @Mock
    private JobRepository jobRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CandidateProfileRepository candidateProfileRepository;
    @Mock
    private ApplicationStatusHistoryRepository statusHistoryRepository;
    @Mock
    private NotificationService notificationService;
    @Mock
    private EntityDtoMapper mapper;

    @InjectMocks
    private JobApplicationServiceImpl applicationService;

    private User candidateUser;
    private User recruiterUser;
    private Job openJob;

    @BeforeEach
    void setUp() {
        candidateUser = new User("candidate@test.com", "pass", "Jane Candidate", Role.CANDIDATE);
        candidateUser.setId(10L);

        recruiterUser = new User("recruiter@test.com", "pass", "Bob Recruiter", Role.RECRUITER);
        recruiterUser.setId(20L);

        Company company = new Company("Acme Corp", "Tech Co", "acme.com", "Remote");
        company.setId(1L);

        openJob = new Job();
        openJob.setId(100L);
        openJob.setTitle("Backend Engineer");
        openJob.setDescription("Java job description");
        openJob.setLocation("Remote");
        openJob.setStatus(JobStatus.OPEN);
        openJob.setApplicationDeadline(LocalDate.now().plusMonths(1));
        openJob.setRecruiter(recruiterUser);
        openJob.setCompany(company);

        // Setup mock authentication
        Authentication auth = mock(Authentication.class);
        UserPrincipal principal = new UserPrincipal(10L, "candidate@test.com", "pass", "Jane Candidate", Role.CANDIDATE, true, Collections.emptyList());
        when(auth.isAuthenticated()).thenReturn(true);
        when(auth.getPrincipal()).thenReturn(principal);

        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    @DisplayName("Should apply for job successfully")
    void shouldApplySuccessfully() {
        ApplyJobRequest request = new ApplyJobRequest();
        request.setJobId(100L);
        request.setCoverLetter("I am an excellent fit.");

        when(userRepository.findById(10L)).thenReturn(Optional.of(candidateUser));
        when(jobRepository.findById(100L)).thenReturn(Optional.of(openJob));
        when(applicationRepository.existsByCandidateIdAndJobId(10L, 100L)).thenReturn(false);

        JobApplication savedApp = new JobApplication(candidateUser, openJob, "resume.pdf", "I am an excellent fit.");
        savedApp.setId(1L);
        when(applicationRepository.save(any(JobApplication.class))).thenReturn(savedApp);

        JobApplicationResponse responseDto = new JobApplicationResponse();
        responseDto.setId(1L);
        responseDto.setStatus(ApplicationStatus.APPLIED);
        when(mapper.toJobApplicationResponse(any(JobApplication.class))).thenReturn(responseDto);

        JobApplicationResponse response = applicationService.apply(request);

        assertNotNull(response);
        assertEquals(ApplicationStatus.APPLIED, response.getStatus());
        verify(applicationRepository, times(1)).save(any(JobApplication.class));
        verify(notificationService, times(2)).createNotification(any(), any(), any(), any());
    }

    @Test
    @DisplayName("Should prevent candidate from applying twice for the same job")
    void shouldPreventDuplicateApplication() {
        ApplyJobRequest request = new ApplyJobRequest();
        request.setJobId(100L);

        when(userRepository.findById(10L)).thenReturn(Optional.of(candidateUser));
        when(jobRepository.findById(100L)).thenReturn(Optional.of(openJob));
        when(applicationRepository.existsByCandidateIdAndJobId(10L, 100L)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> applicationService.apply(request));
        verify(applicationRepository, never()).save(any(JobApplication.class));
    }

    @Test
    @DisplayName("Should reject application to a closed job")
    void shouldRejectApplicationToClosedJob() {
        openJob.setStatus(JobStatus.CLOSED);
        ApplyJobRequest request = new ApplyJobRequest();
        request.setJobId(100L);

        when(userRepository.findById(10L)).thenReturn(Optional.of(candidateUser));
        when(jobRepository.findById(100L)).thenReturn(Optional.of(openJob));

        assertThrows(BadRequestException.class, () -> applicationService.apply(request));
        verify(applicationRepository, never()).save(any(JobApplication.class));
    }
}
