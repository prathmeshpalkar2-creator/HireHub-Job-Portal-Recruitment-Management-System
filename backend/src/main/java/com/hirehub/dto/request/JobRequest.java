package com.hirehub.dto.request;

import com.hirehub.enums.EmploymentType;
import com.hirehub.enums.JobStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class JobRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    private String requiredSkills;

    @NotBlank(message = "Job location is required")
    private String location;

    @NotNull(message = "Employment type is required")
    private EmploymentType employmentType;

    private String experienceRequirements;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
    private Integer openings;
    private String qualificationRequirements;
    private LocalDate applicationDeadline;
    private JobStatus status = JobStatus.OPEN;

    public JobRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public EmploymentType getEmploymentType() { return employmentType; }
    public void setEmploymentType(EmploymentType employmentType) { this.employmentType = employmentType; }
    public String getExperienceRequirements() { return experienceRequirements; }
    public void setExperienceRequirements(String experienceRequirements) { this.experienceRequirements = experienceRequirements; }
    public BigDecimal getMinSalary() { return minSalary; }
    public void setMinSalary(BigDecimal minSalary) { this.minSalary = minSalary; }
    public BigDecimal getMaxSalary() { return maxSalary; }
    public void setMaxSalary(BigDecimal maxSalary) { this.maxSalary = maxSalary; }
    public Integer getOpenings() { return openings; }
    public void setOpenings(Integer openings) { this.openings = openings; }
    public String getQualificationRequirements() { return qualificationRequirements; }
    public void setQualificationRequirements(String qualificationRequirements) { this.qualificationRequirements = qualificationRequirements; }
    public LocalDate getApplicationDeadline() { return applicationDeadline; }
    public void setApplicationDeadline(LocalDate applicationDeadline) { this.applicationDeadline = applicationDeadline; }
    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }
}
