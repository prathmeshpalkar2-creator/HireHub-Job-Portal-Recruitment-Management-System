package com.hirehub.dto.request;

public class RecruiterProfileUpdateRequest {
    private String fullName;
    private String phone;
    private String designation;
    private CompanyDto company;

    public RecruiterProfileUpdateRequest() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public CompanyDto getCompany() { return company; }
    public void setCompany(CompanyDto company) { this.company = company; }
}
