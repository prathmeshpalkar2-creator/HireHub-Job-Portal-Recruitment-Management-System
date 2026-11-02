package com.hirehub.controller;

import com.hirehub.dto.request.CandidateProfileUpdateRequest;
import com.hirehub.dto.response.ApiResponse;
import com.hirehub.dto.response.CandidateProfileResponse;
import com.hirehub.dto.response.DashboardStatsResponse;
import com.hirehub.service.CandidateService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/candidates")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<CandidateProfileResponse>> getMyProfile() {
        CandidateProfileResponse profile = candidateService.getMyProfile();
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<CandidateProfileResponse>> updateMyProfile(@RequestBody CandidateProfileUpdateRequest request) {
        CandidateProfileResponse updated = candidateService.updateMyProfile(request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    @PostMapping(value = "/me/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<CandidateProfileResponse>> uploadResume(@RequestParam("file") MultipartFile file) {
        CandidateProfileResponse response = candidateService.uploadResume(file);
        return ResponseEntity.ok(ApiResponse.ok("Resume uploaded successfully", response));
    }

    @GetMapping("/me/resume")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<Resource> downloadResume() {
        Resource file = candidateService.downloadResume();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(file);
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = candidateService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
