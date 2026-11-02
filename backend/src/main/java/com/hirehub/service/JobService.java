package com.hirehub.service;

import com.hirehub.dto.request.JobRequest;
import com.hirehub.dto.response.JobResponse;
import com.hirehub.enums.EmploymentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface JobService {
    JobResponse createJob(JobRequest request);
    JobResponse updateJob(Long id, JobRequest request);
    void deleteJob(Long id);
    JobResponse getJobById(Long id);
    Page<JobResponse> searchJobs(String search, String location, EmploymentType employmentType, BigDecimal minSalary, Pageable pageable);
}
