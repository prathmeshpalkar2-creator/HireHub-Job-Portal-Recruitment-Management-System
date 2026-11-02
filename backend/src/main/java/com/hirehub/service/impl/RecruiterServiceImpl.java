package com.hirehub.service.impl;

import com.hirehub.dto.request.CompanyDto;
import com.hirehub.dto.request.RecruiterProfileUpdateRequest;
import com.hirehub.dto.response.DashboardStatsResponse;
import com.hirehub.dto.response.JobApplicationResponse;
import com.hirehub.dto.response.JobResponse;
import com.hirehub.dto.response.RecruiterProfileResponse;
import com.hirehub.entity.CandidateProfile;
import com.hirehub.entity.Company;
import com.hirehub.entity.RecruiterProfile;
import com.hirehub.entity.User;
import com.hirehub.enums.ApplicationStatus;
import com.hirehub.enums.JobStatus;
import com.hirehub.exception.ResourceNotFoundException;
import com.hirehub.exception.UnauthorizedException;
import com.hirehub.mapper.EntityDtoMapper;
import com.hirehub.repository.*;
import com.hirehub.security.UserPrincipal;
import com.hirehub.service.RecruiterService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@Service
public class RecruiterServiceImpl implements RecruiterService {

    private final RecruiterProfileRepository recruiterProfileRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final EntityDtoMapper mapper;
    private final Path fileStorageLocation;

    public RecruiterServiceImpl(
            RecruiterProfileRepository recruiterProfileRepository,
            CandidateProfileRepository candidateProfileRepository,
            UserRepository userRepository,
            CompanyRepository companyRepository,
            JobRepository jobRepository,
            JobApplicationRepository applicationRepository,
            EntityDtoMapper mapper,
            @Value("${hirehub.upload.dir:uploads/resumes}") String uploadDir) {
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.mapper = mapper;
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
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
    @Transactional(readOnly = true)
    public RecruiterProfileResponse getMyProfile() {
        User user = getAuthenticatedUser();
        RecruiterProfile profile = recruiterProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));
        return mapper.toRecruiterProfileResponse(profile);
    }

    @Override
    @Transactional
    public RecruiterProfileResponse updateMyProfile(RecruiterProfileUpdateRequest request) {
        User user = getAuthenticatedUser();
        if (StringUtils.hasText(request.getFullName())) {
            user.setFullName(request.getFullName().trim());
            userRepository.save(user);
        }

        RecruiterProfile profile = recruiterProfileRepository.findByUser(user)
                .orElseGet(() -> new RecruiterProfile(user));

        profile.setPhone(request.getPhone());
        profile.setDesignation(request.getDesignation());

        if (request.getCompany() != null) {
            CompanyDto cDto = request.getCompany();
            Company company = profile.getCompany();
            if (company == null) {
                company = new Company();
            }
            company.setName(cDto.getName());
            company.setDescription(cDto.getDescription());
            company.setWebsite(cDto.getWebsite());
            company.setIndustry(cDto.getIndustry());
            company.setCompanySize(cDto.getCompanySize());
            company.setLocation(cDto.getLocation());
            company.setLogoUrl(cDto.getLogoUrl());
            companyRepository.save(company);
            profile.setCompany(company);
        }

        RecruiterProfile saved = recruiterProfileRepository.save(profile);
        return mapper.toRecruiterProfileResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponse> getMyJobs(Pageable pageable) {
        User user = getAuthenticatedUser();
        return jobRepository.findByRecruiterId(user.getId(), pageable)
                .map(job -> {
                    long appCount = applicationRepository.countByRecruiterIdAndJobId(user.getId(), job.getId(), Pageable.unpaged()).getTotalElements();
                    return mapper.toJobResponse(job, appCount);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobApplicationResponse> getMyApplications(Long jobId, Pageable pageable) {
        User user = getAuthenticatedUser();
        if (jobId != null) {
            return applicationRepository.findByRecruiterIdAndJobId(user.getId(), jobId, pageable)
                    .map(mapper::toJobApplicationResponse);
        } else {
            return applicationRepository.findByRecruiterId(user.getId(), pageable)
                    .map(mapper::toJobApplicationResponse);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        User user = getAuthenticatedUser();
        long totalJobs = jobRepository.countByRecruiterId(user.getId());
        long activeJobs = jobRepository.countByRecruiterIdAndStatus(user.getId(), JobStatus.OPEN);
        long closedJobs = jobRepository.countByRecruiterIdAndStatus(user.getId(), JobStatus.CLOSED);
        long totalApps = applicationRepository.countByRecruiterId(user.getId());
        long shortlistedApps = applicationRepository.countByRecruiterIdAndStatus(user.getId(), ApplicationStatus.SHORTLISTED);
        long selectedCandidates = applicationRepository.countByRecruiterIdAndStatus(user.getId(), ApplicationStatus.SELECTED);

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalJobPostings", totalJobs);
        metrics.put("activeJobs", activeJobs);
        metrics.put("closedJobs", closedJobs);
        metrics.put("totalApplications", totalApps);
        metrics.put("shortlistedCandidates", shortlistedApps);
        metrics.put("selectedCandidates", selectedCandidates);

        var recentApplications = applicationRepository.findTop5ByRecruiterIdOrderByAppliedAtDesc(user.getId())
                .stream().map(mapper::toJobApplicationResponse).toList();

        return new DashboardStatsResponse(metrics, recentApplications);
    }

    @Override
    @Transactional(readOnly = true)
    public Resource downloadCandidateResume(Long candidateUserId) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(candidateUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        if (!StringUtils.hasText(profile.getResumeFileName())) {
            throw new ResourceNotFoundException("Candidate has not uploaded a resume");
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
}
