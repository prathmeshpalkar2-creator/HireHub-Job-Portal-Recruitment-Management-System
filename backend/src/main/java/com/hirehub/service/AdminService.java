package com.hirehub.service;

import com.hirehub.dto.request.RecruiterApprovalRequest;
import com.hirehub.dto.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {
    DashboardStatsResponse getDashboardStats();
    Page<UserResponse> getCandidates(Pageable pageable);
    Page<RecruiterProfileResponse> getRecruiters(Boolean approved, Pageable pageable);
    RecruiterProfileResponse updateRecruiterApproval(Long recruiterProfileId, RecruiterApprovalRequest request);
    Page<JobResponse> getAllJobs(Pageable pageable);
    void deleteJob(Long jobId);
    Page<JobApplicationResponse> getAllApplications(Pageable pageable);
}
