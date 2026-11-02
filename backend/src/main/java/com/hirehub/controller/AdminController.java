package com.hirehub.controller;

import com.hirehub.dto.request.RecruiterApprovalRequest;
import com.hirehub.dto.response.*;
import com.hirehub.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/candidates")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getCandidates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<UserResponse> candidates = adminService.getCandidates(pageable);
        return ResponseEntity.ok(ApiResponse.ok(candidates));
    }

    @GetMapping("/recruiters")
    public ResponseEntity<ApiResponse<Page<RecruiterProfileResponse>>> getRecruiters(
            @RequestParam(required = false) Boolean approved,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<RecruiterProfileResponse> recruiters = adminService.getRecruiters(approved, pageable);
        return ResponseEntity.ok(ApiResponse.ok(recruiters));
    }

    @PatchMapping("/recruiters/{id}/approval")
    public ResponseEntity<ApiResponse<RecruiterProfileResponse>> updateRecruiterApproval(
            @PathVariable Long id,
            @Valid @RequestBody RecruiterApprovalRequest request) {
        RecruiterProfileResponse updated = adminService.updateRecruiterApproval(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Recruiter approval status updated successfully", updated));
    }

    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<Page<JobResponse>>> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<JobResponse> jobs = adminService.getAllJobs(pageable);
        return ResponseEntity.ok(ApiResponse.ok(jobs));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        adminService.deleteJob(id);
        return ResponseEntity.ok(ApiResponse.ok("Job deleted by admin successfully", null));
    }

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<Page<JobApplicationResponse>>> getAllApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<JobApplicationResponse> apps = adminService.getAllApplications(pageable);
        return ResponseEntity.ok(ApiResponse.ok(apps));
    }
}
