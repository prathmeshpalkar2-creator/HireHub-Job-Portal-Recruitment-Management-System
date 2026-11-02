package com.hirehub.service;

import com.hirehub.dto.request.RecruiterProfileUpdateRequest;
import com.hirehub.dto.response.DashboardStatsResponse;
import com.hirehub.dto.response.JobApplicationResponse;
import com.hirehub.dto.response.JobResponse;
import com.hirehub.dto.response.RecruiterProfileResponse;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RecruiterService {
    RecruiterProfileResponse getMyProfile();
    RecruiterProfileResponse updateMyProfile(RecruiterProfileUpdateRequest request);
    Page<JobResponse> getMyJobs(Pageable pageable);
    Page<JobApplicationResponse> getMyApplications(Long jobId, Pageable pageable);
    DashboardStatsResponse getDashboardStats();
    Resource downloadCandidateResume(Long candidateUserId);
}
