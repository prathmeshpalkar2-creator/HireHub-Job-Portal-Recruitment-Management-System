package com.hirehub.service.impl;

import com.hirehub.dto.request.JobRequest;
import com.hirehub.dto.response.JobResponse;
import com.hirehub.entity.Company;
import com.hirehub.entity.Job;
import com.hirehub.entity.RecruiterProfile;
import com.hirehub.entity.User;
import com.hirehub.enums.EmploymentType;
import com.hirehub.enums.JobStatus;
import com.hirehub.enums.Role;
import com.hirehub.exception.BadRequestException;
import com.hirehub.exception.ResourceNotFoundException;
import com.hirehub.exception.UnauthorizedException;
import com.hirehub.mapper.EntityDtoMapper;
import com.hirehub.repository.JobApplicationRepository;
import com.hirehub.repository.JobRepository;
import com.hirehub.repository.RecruiterProfileRepository;
import com.hirehub.repository.UserRepository;
import com.hirehub.security.UserPrincipal;
import com.hirehub.service.JobService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final JobApplicationRepository applicationRepository;
    private final EntityDtoMapper mapper;

    public JobServiceImpl(
            JobRepository jobRepository,
            UserRepository userRepository,
            RecruiterProfileRepository recruiterProfileRepository,
            JobApplicationRepository applicationRepository,
            EntityDtoMapper mapper) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.applicationRepository = applicationRepository;
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
    public JobResponse createJob(JobRequest request) {
        User user = getAuthenticatedUser();
        RecruiterProfile profile = recruiterProfileRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("Recruiter profile not found"));

        if (!profile.isApproved()) {
            throw new BadRequestException("Recruiter account is pending administrator approval. You cannot post jobs until approved.");
        }

        Company company = profile.getCompany();
        if (company == null) {
            throw new BadRequestException("Please set up your company profile before posting a job.");
        }

        Job job = new Job();
        job.setRecruiter(user);
        job.setCompany(company);
        job.setTitle(request.getTitle().trim());
        job.setDescription(request.getDescription().trim());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setLocation(request.getLocation().trim());
        job.setEmploymentType(request.getEmploymentType());
        job.setExperienceRequirements(request.getExperienceRequirements());
        job.setMinSalary(request.getMinSalary());
        job.setMaxSalary(request.getMaxSalary());
        job.setOpenings(request.getOpenings() != null ? request.getOpenings() : 1);
        job.setQualificationRequirements(request.getQualificationRequirements());
        job.setApplicationDeadline(request.getApplicationDeadline());
        job.setStatus(request.getStatus() != null ? request.getStatus() : JobStatus.OPEN);

        Job saved = jobRepository.save(job);
        return mapper.toJobResponse(saved, 0);
    }

    @Override
    @Transactional
    public JobResponse updateJob(Long id, JobRequest request) {
        User user = getAuthenticatedUser();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        if (!job.getRecruiter().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You are not authorized to update this job");
        }

        job.setTitle(request.getTitle().trim());
        job.setDescription(request.getDescription().trim());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setLocation(request.getLocation().trim());
        job.setEmploymentType(request.getEmploymentType());
        job.setExperienceRequirements(request.getExperienceRequirements());
        job.setMinSalary(request.getMinSalary());
        job.setMaxSalary(request.getMaxSalary());
        if (request.getOpenings() != null) job.setOpenings(request.getOpenings());
        job.setQualificationRequirements(request.getQualificationRequirements());
        job.setApplicationDeadline(request.getApplicationDeadline());
        if (request.getStatus() != null) job.setStatus(request.getStatus());

        Job saved = jobRepository.save(job);
        long appCount = applicationRepository.findByJobId(id, Pageable.unpaged()).getTotalElements();
        return mapper.toJobResponse(saved, appCount);
    }

    @Override
    @Transactional
    public void deleteJob(Long id) {
        User user = getAuthenticatedUser();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        if (!job.getRecruiter().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You are not authorized to delete this job");
        }

        jobRepository.delete(job);
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        long appCount = applicationRepository.findByJobId(id, Pageable.unpaged()).getTotalElements();
        return mapper.toJobResponse(job, appCount);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponse> searchJobs(String search, String location, EmploymentType employmentType, BigDecimal minSalary, Pageable pageable) {
        String searchParam = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        String locationParam = (location != null && !location.trim().isEmpty()) ? location.trim() : null;
        LocalDate today = LocalDate.now();

        return jobRepository.searchJobs(JobStatus.OPEN, today, searchParam, locationParam, employmentType, minSalary, pageable)
                .map(job -> mapper.toJobResponse(job, 0));
    }
}
