package com.hirehub.dto.request;

import java.util.List;

public class CandidateProfileUpdateRequest {
    private String fullName;
    private String phone;
    private String headline;
    private String summary;
    private String currentLocation;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String skillsText;
    private List<EducationDto> educations;
    private List<WorkExperienceDto> workExperiences;

    public CandidateProfileUpdateRequest() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(String currentLocation) { this.currentLocation = currentLocation; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }
    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }
    public String getSkillsText() { return skillsText; }
    public void setSkillsText(String skillsText) { this.skillsText = skillsText; }
    public List<EducationDto> getEducations() { return educations; }
    public void setEducations(List<EducationDto> educations) { this.educations = educations; }
    public List<WorkExperienceDto> getWorkExperiences() { return workExperiences; }
    public void setWorkExperiences(List<WorkExperienceDto> workExperiences) { this.workExperiences = workExperiences; }
}
