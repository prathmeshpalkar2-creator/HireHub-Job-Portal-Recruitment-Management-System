package com.hirehub.service;

import com.hirehub.dto.request.CandidateRegisterRequest;
import com.hirehub.dto.request.LoginRequest;
import com.hirehub.dto.request.RecruiterRegisterRequest;
import com.hirehub.dto.response.JwtAuthResponse;
import com.hirehub.dto.response.UserResponse;

public interface AuthService {
    JwtAuthResponse registerCandidate(CandidateRegisterRequest request);
    JwtAuthResponse registerRecruiter(RecruiterRegisterRequest request);
    JwtAuthResponse login(LoginRequest request);
    UserResponse getCurrentUser();
}
