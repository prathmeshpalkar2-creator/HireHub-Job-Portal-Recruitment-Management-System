package com.hirehub.service;

import com.hirehub.dto.request.CandidateProfileUpdateRequest;
import com.hirehub.dto.response.CandidateProfileResponse;
import com.hirehub.dto.response.DashboardStatsResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface CandidateService {
    CandidateProfileResponse getMyProfile();
    CandidateProfileResponse updateMyProfile(CandidateProfileUpdateRequest request);
    CandidateProfileResponse uploadResume(MultipartFile file);
    Resource downloadResume();
    DashboardStatsResponse getDashboardStats();
}
