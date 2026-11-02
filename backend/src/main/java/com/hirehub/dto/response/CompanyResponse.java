package com.hirehub.dto.response;

public class CompanyResponse {
    private Long id;
    private String name;
    private String description;
    private String website;
    private String industry;
    private String companySize;
    private String location;
    private String logoUrl;

    public CompanyResponse() {}

    public CompanyResponse(Long id, String name, String description, String website, String industry, String companySize, String location, String logoUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.website = website;
        this.industry = industry;
        this.companySize = companySize;
        this.location = location;
        this.logoUrl = logoUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    public String getCompanySize() { return companySize; }
    public void setCompanySize(String companySize) { this.companySize = companySize; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
}
