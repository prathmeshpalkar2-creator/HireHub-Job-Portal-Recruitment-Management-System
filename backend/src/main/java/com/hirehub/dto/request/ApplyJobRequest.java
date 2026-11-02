package com.hirehub.dto.request;

import jakarta.validation.constraints.NotNull;

public class ApplyJobRequest {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    private String coverLetter;
    private String resumeReference;

    public ApplyJobRequest() {}

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }
    public String getResumeReference() { return resumeReference; }
    public void setResumeReference(String resumeReference) { this.resumeReference = resumeReference; }
}
