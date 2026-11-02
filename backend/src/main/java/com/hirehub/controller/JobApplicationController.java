package com.hirehub.controller;

import com.hirehub.dto.request.ApplicationStatusUpdateRequest;
import com.hirehub.dto.request.ApplyJobRequest;
import com.hirehub.dto.response.ApiResponse;
import com.hirehub.dto.response.JobApplicationResponse;
import com.hirehub.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/applications")
public class JobApplicationController {

    private final JobApplicationService applicationService;

    public JobApplicationController(JobApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> apply(@Valid @RequestBody ApplyJobRequest request) {
        JobApplicationResponse response = applicationService.apply(request);
        return new ResponseEntity<>(ApiResponse.ok("Job application submitted successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<Page<JobApplicationResponse>>> getMyApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<JobApplicationResponse> apps = applicationService.getMyApplications(pageable);
        return ResponseEntity.ok(ApiResponse.ok(apps));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> getApplicationById(@PathVariable Long id) {
        JobApplicationResponse response = applicationService.getApplicationById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        JobApplicationResponse response = applicationService.updateStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Application status updated to " + request.getStatus(), response));
    }

    @PatchMapping("/{id}/withdraw")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> withdraw(@PathVariable Long id) {
        JobApplicationResponse response = applicationService.withdraw(id);
        return ResponseEntity.ok(ApiResponse.ok("Application withdrawn successfully", response));
    }
}
