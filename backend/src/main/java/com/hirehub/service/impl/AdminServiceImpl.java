package com.hirehub.service.impl;

import com.hirehub.dto.request.RecruiterApprovalRequest;
import com.hirehub.dto.response.*;
import com.hirehub.entity.RecruiterProfile;
import com.hirehub.enums.JobStatus;
import com.hirehub.enums.NotificationType;
import com.hirehub.enums.Role;
import com.hirehub.exception.ResourceNotFoundException;
import com.hirehub.mapper.EntityDtoMapper;
import com.hirehub.repository.JobApplicationRepository;
import com.hirehub.repository.JobRepository;
import com.hirehub.repository.RecruiterProfileRepository;
import com.hirehub.repository.UserRepository;
import com.hirehub.service.AdminService;
import com.hirehub.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final NotificationService notificationService;
    private final EntityDtoMapper mapper;

    public AdminServiceImpl(
            UserRepository userRepository,
            RecruiterProfileRepository recruiterProfileRepository,
            JobRepository jobRepository,
            JobApplicationRepository applicationRepository,
            NotificationService notificationService,
            EntityDtoMapper mapper) {
        this.userRepository = userRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.notificationService = notificationService;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalCandidates = userRepository.countByRole(Role.CANDIDATE);
        long totalRecruiters = userRepository.countByRole(Role.RECRUITER);
        long pendingRecruiterApprovals = recruiterProfileRepository.countByIsApproved(false);
        long totalJobs = jobRepository.count();
        long activeJobs = jobRepository.countByStatus(JobStatus.OPEN);
        long totalApplications = applicationRepository.count();

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalUsers", totalUsers);
        metrics.put("totalCandidates", totalCandidates);
        metrics.put("totalRecruiters", totalRecruiters);
        metrics.put("pendingRecruiterApprovals", pendingRecruiterApprovals);
        metrics.put("totalJobPostings", totalJobs);
        metrics.put("activeJobPostings", activeJobs);
        metrics.put("totalApplications", totalApplications);

        return new DashboardStatsResponse(metrics, null);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getCandidates(Pageable pageable) {
        return userRepository.findByRole(Role.CANDIDATE, pageable)
                .map(mapper::toUserResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RecruiterProfileResponse> getRecruiters(Boolean approved, Pageable pageable) {
        if (approved != null) {
            return recruiterProfileRepository.findByIsApproved(approved, pageable)
                    .map(mapper::toRecruiterProfileResponse);
        }
        return recruiterProfileRepository.findAll(pageable)
                .map(mapper::toRecruiterProfileResponse);
    }

    @Override
    @Transactional
    public RecruiterProfileResponse updateRecruiterApproval(Long recruiterProfileId, RecruiterApprovalRequest request) {
        RecruiterProfile profile = recruiterProfileRepository.findById(recruiterProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found with id: " + recruiterProfileId));

        profile.setApproved(request.getApproved());
        if (request.getNotes() != null) {
            profile.setApprovalNotes(request.getNotes());
        }

        RecruiterProfile saved = recruiterProfileRepository.save(profile);

        // Notify Recruiter
        if (request.getApproved()) {
            notificationService.createNotification(
                    profile.getUser(),
                    "Congratulations! Your recruiter account has been approved by the administrator. You can now post jobs.",
                    NotificationType.RECRUITER_APPROVED,
                    "/recruiter/jobs/new"
            );
        } else {
            notificationService.createNotification(
                    profile.getUser(),
                    "Your recruiter account approval has been rejected or revoked. Note: " + (request.getNotes() != null ? request.getNotes() : "Contact support."),
                    NotificationType.RECRUITER_REJECTED,
                    "/recruiter/dashboard"
            );
        }

        return mapper.toRecruiterProfileResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponse> getAllJobs(Pageable pageable) {
        return jobRepository.findAll(pageable)
                .map(job -> {
                    long appCount = applicationRepository.findByJobId(job.getId(), Pageable.unpaged()).getTotalElements();
                    return mapper.toJobResponse(job, appCount);
                });
    }

    @Override
    @Transactional
    public void deleteJob(Long jobId) {
        if (!jobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job not found with id: " + jobId);
        }
        jobRepository.deleteById(jobId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobApplicationResponse> getAllApplications(Pageable pageable) {
        return applicationRepository.findAll(pageable)
                .map(mapper::toJobApplicationResponse);
    }
}
