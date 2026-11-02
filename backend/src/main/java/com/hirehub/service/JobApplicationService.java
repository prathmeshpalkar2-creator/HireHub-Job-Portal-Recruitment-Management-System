package com.hirehub.service;

import com.hirehub.dto.request.ApplicationStatusUpdateRequest;
import com.hirehub.dto.request.ApplyJobRequest;
import com.hirehub.dto.response.JobApplicationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface JobApplicationService {
    JobApplicationResponse apply(ApplyJobRequest request);
    Page<JobApplicationResponse> getMyApplications(Pageable pageable);
    JobApplicationResponse getApplicationById(Long id);
    JobApplicationResponse updateStatus(Long id, ApplicationStatusUpdateRequest request);
    JobApplicationResponse withdraw(Long id);
}
