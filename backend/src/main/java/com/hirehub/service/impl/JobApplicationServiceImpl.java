package com.hirehub.service.impl;

import com.hirehub.dto.request.ApplicationStatusUpdateRequest;
import com.hirehub.dto.request.ApplyJobRequest;
import com.hirehub.dto.response.JobApplicationResponse;
import com.hirehub.entity.*;
import com.hirehub.enums.ApplicationStatus;
import com.hirehub.enums.JobStatus;
import com.hirehub.enums.NotificationType;
import com.hirehub.enums.Role;
import com.hirehub.exception.BadRequestException;
import com.hirehub.exception.DuplicateResourceException;
import com.hirehub.exception.ResourceNotFoundException;
import com.hirehub.exception.UnauthorizedException;
import com.hirehub.mapper.EntityDtoMapper;
import com.hirehub.repository.*;
import com.hirehub.security.UserPrincipal;
import com.hirehub.service.JobApplicationService;
import com.hirehub.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;
    private final NotificationService notificationService;
    private final EntityDtoMapper mapper;

    public JobApplicationServiceImpl(
            JobApplicationRepository applicationRepository,
            JobRepository jobRepository,
            UserRepository userRepository,
            CandidateProfileRepository candidateProfileRepository,
            ApplicationStatusHistoryRepository statusHistoryRepository,
            NotificationService notificationService,
            EntityDtoMapper mapper) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.notificationService = notificationService;
        this.mapper = mapper;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new UnauthorizedException("User is not authenticated");
        }
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    @Override
    @Transactional
    public JobApplicationResponse apply(ApplyJobRequest request) {
        User user = getAuthenticatedUser();
        if (user.getRole() != Role.CANDIDATE) {
            throw new BadRequestException("Only candidates can apply for jobs");
        }

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + request.getJobId()));

        if (job.getStatus() != JobStatus.OPEN) {
            throw new BadRequestException("This job is currently not open for applications");
        }

        if (job.getApplicationDeadline() != null && job.getApplicationDeadline().isBefore(LocalDate.now())) {
            throw new BadRequestException("The application deadline for this job has expired");
        }

        if (applicationRepository.existsByCandidateIdAndJobId(user.getId(), job.getId())) {
            throw new DuplicateResourceException("You have already applied for this job");
        }

        CandidateProfile profile = candidateProfileRepository.findByUser(user).orElse(null);
        String resumeRef = request.getResumeReference();
        if ((resumeRef == null || resumeRef.isBlank()) && profile != null && profile.getResumeFileName() != null) {
            resumeRef = profile.getResumeOriginalName();
        }

        JobApplication application = new JobApplication();
        application.setCandidate(user);
        application.setJob(job);
        application.setCoverLetter(request.getCoverLetter());
        application.setResumeReference(resumeRef);
        application.setStatus(ApplicationStatus.APPLIED);

        JobApplication saved = applicationRepository.save(application);

        ApplicationStatusHistory history = new ApplicationStatusHistory(
                saved,
                ApplicationStatus.APPLIED,
                "Application submitted by candidate",
                user.getFullName()
        );
        statusHistoryRepository.save(history);
        saved.getStatusHistories().add(history);

        // Notify Recruiter
        notificationService.createNotification(
                job.getRecruiter(),
                "New application received from " + user.getFullName() + " for: " + job.getTitle(),
                NotificationType.APPLICATION_RECEIVED,
                "/recruiter/applications"
        );

        // Notify Candidate
        notificationService.createNotification(
                user,
                "Your application for '" + job.getTitle() + "' at " + (job.getCompany() != null ? job.getCompany().getName() : "employer") + " was submitted successfully.",
                NotificationType.APPLICATION_SUBMITTED,
                "/candidate/applications"
        );

        return mapper.toJobApplicationResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobApplicationResponse> getMyApplications(Pageable pageable) {
        User user = getAuthenticatedUser();
        return applicationRepository.findByCandidateId(user.getId(), pageable)
                .map(mapper::toJobApplicationResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public JobApplicationResponse getApplicationById(Long id) {
        User user = getAuthenticatedUser();
        JobApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        boolean isCandidateOwner = application.getCandidate().getId().equals(user.getId());
        boolean isRecruiterOwner = application.getJob().getRecruiter().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isCandidateOwner && !isRecruiterOwner && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to view this application");
        }

        return mapper.toJobApplicationResponse(application);
    }

    @Override
    @Transactional
    public JobApplicationResponse updateStatus(Long id, ApplicationStatusUpdateRequest request) {
        User user = getAuthenticatedUser();
        JobApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        boolean isRecruiterOwner = application.getJob().getRecruiter().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isRecruiterOwner && !isAdmin) {
            throw new UnauthorizedException("Only the job recruiter or admin can update the application status");
        }

        application.setStatus(request.getStatus());
        if (request.getNotes() != null) {
            application.setNotes(request.getNotes());
        }

        JobApplication saved = applicationRepository.save(application);

        ApplicationStatusHistory history = new ApplicationStatusHistory(
                saved,
                request.getStatus(),
                request.getNotes() != null ? request.getNotes() : "Status updated to " + request.getStatus().name(),
                user.getFullName()
        );
        statusHistoryRepository.save(history);
        saved.getStatusHistories().add(history);

        // Notify Candidate of status change
        notificationService.createNotification(
                application.getCandidate(),
                "Your application status for '" + application.getJob().getTitle() + "' has been updated to: " + request.getStatus().name(),
                NotificationType.STATUS_CHANGED,
                "/candidate/applications"
        );

        return mapper.toJobApplicationResponse(saved);
    }

    @Override
    @Transactional
    public JobApplicationResponse withdraw(Long id) {
        User user = getAuthenticatedUser();
        JobApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        if (!application.getCandidate().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only withdraw your own applications");
        }

        if (application.getStatus() == ApplicationStatus.SELECTED || application.getStatus() == ApplicationStatus.REJECTED || application.getStatus() == ApplicationStatus.WITHDRAWN) {
            throw new BadRequestException("Application cannot be withdrawn in its current state (" + application.getStatus() + ")");
        }

        application.setStatus(ApplicationStatus.WITHDRAWN);
        JobApplication saved = applicationRepository.save(application);

        ApplicationStatusHistory history = new ApplicationStatusHistory(
                saved,
                ApplicationStatus.WITHDRAWN,
                "Application withdrawn by candidate",
                user.getFullName()
        );
        statusHistoryRepository.save(history);
        saved.getStatusHistories().add(history);

        notificationService.createNotification(
                application.getJob().getRecruiter(),
                user.getFullName() + " has withdrawn their application for " + application.getJob().getTitle(),
                NotificationType.STATUS_CHANGED,
                "/recruiter/applications"
        );

        return mapper.toJobApplicationResponse(saved);
    }
}
