package com.hirehub.controller;

import com.hirehub.dto.request.CandidateRegisterRequest;
import com.hirehub.dto.request.LoginRequest;
import com.hirehub.dto.request.RecruiterRegisterRequest;
import com.hirehub.dto.response.ApiResponse;
import com.hirehub.dto.response.JwtAuthResponse;
import com.hirehub.dto.response.UserResponse;
import com.hirehub.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/candidate")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> registerCandidate(@Valid @RequestBody CandidateRegisterRequest request) {
        JwtAuthResponse response = authService.registerCandidate(request);
        return new ResponseEntity<>(ApiResponse.ok("Candidate registered successfully", response), HttpStatus.CREATED);
    }

    @PostMapping("/register/recruiter")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> registerRecruiter(@Valid @RequestBody RecruiterRegisterRequest request) {
        JwtAuthResponse response = authService.registerRecruiter(request);
        return new ResponseEntity<>(ApiResponse.ok("Recruiter registered successfully (Pending admin approval)", response), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        JwtAuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        UserResponse response = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
