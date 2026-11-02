package com.hirehub.dto.request;

public class WorkExperienceDto {
    private Long id;
    private String companyName;
    private String jobTitle;
    private String location;
    private String startDate;
    private String endDate;
    private Boolean currentlyWorking;
    private String description;

    public WorkExperienceDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    public Boolean getCurrentlyWorking() { return currentlyWorking; }
    public void setCurrentlyWorking(Boolean currentlyWorking) { this.currentlyWorking = currentlyWorking; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
