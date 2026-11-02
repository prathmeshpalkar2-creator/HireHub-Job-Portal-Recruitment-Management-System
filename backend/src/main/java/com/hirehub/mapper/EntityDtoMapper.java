package com.hirehub.mapper;

import com.hirehub.dto.request.EducationDto;
import com.hirehub.dto.request.WorkExperienceDto;
import com.hirehub.dto.response.*;
import com.hirehub.entity.*;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class EntityDtoMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) return null;
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt()
        );
    }

    public CompanyResponse toCompanyResponse(Company company) {
        if (company == null) return null;
        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getDescription(),
                company.getWebsite(),
                company.getIndustry(),
                company.getCompanySize(),
                company.getLocation(),
                company.getLogoUrl()
        );
    }

    public EducationDto toEducationDto(Education edu) {
        if (edu == null) return null;
        EducationDto dto = new EducationDto();
        dto.setId(edu.getId());
        dto.setInstitution(edu.getInstitution());
        dto.setDegree(edu.getDegree());
        dto.setFieldOfStudy(edu.getFieldOfStudy());
        dto.setStartYear(edu.getStartYear());
        dto.setGraduationYear(edu.getGraduationYear());
        dto.setGrade(edu.getGrade());
        return dto;
    }

    public WorkExperienceDto toWorkExperienceDto(WorkExperience exp) {
        if (exp == null) return null;
        WorkExperienceDto dto = new WorkExperienceDto();
        dto.setId(exp.getId());
        dto.setCompanyName(exp.getCompanyName());
        dto.setJobTitle(exp.getJobTitle());
        dto.setLocation(exp.getLocation());
        dto.setStartDate(exp.getStartDate());
        dto.setEndDate(exp.getEndDate());
        dto.setCurrentlyWorking(exp.getCurrentlyWorking());
        dto.setDescription(exp.getDescription());
        return dto;
    }

    public CandidateProfileResponse toCandidateProfileResponse(CandidateProfile profile) {
        if (profile == null) return null;
        CandidateProfileResponse response = new CandidateProfileResponse();
        response.setId(profile.getId());
        if (profile.getUser() != null) {
            response.setUserId(profile.getUser().getId());
            response.setFullName(profile.getUser().getFullName());
            response.setEmail(profile.getUser().getEmail());
        }
        response.setPhone(profile.getPhone());
        response.setHeadline(profile.getHeadline());
        response.setSummary(profile.getSummary());
        response.setCurrentLocation(profile.getCurrentLocation());
        response.setLinkedinUrl(profile.getLinkedinUrl());
        response.setGithubUrl(profile.getGithubUrl());
        response.setPortfolioUrl(profile.getPortfolioUrl());
        response.setResumeFileName(profile.getResumeFileName());
        response.setResumeOriginalName(profile.getResumeOriginalName());
        response.setResumeFileSize(profile.getResumeFileSize());
        response.setSkillsText(profile.getSkillsText());
        response.setUpdatedAt(profile.getUpdatedAt());

        if (profile.getEducations() != null) {
            response.setEducations(profile.getEducations().stream().map(this::toEducationDto).collect(Collectors.toList()));
        } else {
            response.setEducations(Collections.emptyList());
        }

        if (profile.getWorkExperiences() != null) {
            response.setWorkExperiences(profile.getWorkExperiences().stream().map(this::toWorkExperienceDto).collect(Collectors.toList()));
        } else {
            response.setWorkExperiences(Collections.emptyList());
        }

        return response;
    }

    public RecruiterProfileResponse toRecruiterProfileResponse(RecruiterProfile profile) {
        if (profile == null) return null;
        RecruiterProfileResponse response = new RecruiterProfileResponse();
        response.setId(profile.getId());
        if (profile.getUser() != null) {
            response.setUserId(profile.getUser().getId());
            response.setFullName(profile.getUser().getFullName());
            response.setEmail(profile.getUser().getEmail());
        }
        response.setPhone(profile.getPhone());
        response.setDesignation(profile.getDesignation());
        response.setApproved(profile.isApproved());
        response.setApprovalNotes(profile.getApprovalNotes());
        response.setCompany(toCompanyResponse(profile.getCompany()));
        response.setCreatedAt(profile.getCreatedAt());
        return response;
    }

    public JobResponse toJobResponse(Job job, long applicationsCount) {
        if (job == null) return null;
        JobResponse response = new JobResponse();
        response.setId(job.getId());
        if (job.getRecruiter() != null) {
            response.setRecruiterId(job.getRecruiter().getId());
            response.setRecruiterName(job.getRecruiter().getFullName());
        }
        response.setCompany(toCompanyResponse(job.getCompany()));
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        response.setRequiredSkills(job.getRequiredSkills());
        response.setLocation(job.getLocation());
        response.setEmploymentType(job.getEmploymentType());
        response.setExperienceRequirements(job.getExperienceRequirements());
        response.setMinSalary(job.getMinSalary());
        response.setMaxSalary(job.getMaxSalary());
        response.setOpenings(job.getOpenings());
        response.setQualificationRequirements(job.getQualificationRequirements());
        response.setApplicationDeadline(job.getApplicationDeadline());
        response.setStatus(job.getStatus());
        response.setCreatedAt(job.getCreatedAt());
        response.setUpdatedAt(job.getUpdatedAt());
        response.setApplicationsCount(applicationsCount);
        return response;
    }

    public ApplicationStatusHistoryResponse toStatusHistoryResponse(ApplicationStatusHistory history) {
        if (history == null) return null;
        return new ApplicationStatusHistoryResponse(
                history.getId(),
                history.getStatus(),
                history.getNotes(),
                history.getChangedBy(),
                history.getChangedAt()
        );
    }

    public JobApplicationResponse toJobApplicationResponse(JobApplication app) {
        if (app == null) return null;
        JobApplicationResponse response = new JobApplicationResponse();
        response.setId(app.getId());
        if (app.getCandidate() != null) {
            response.setCandidateId(app.getCandidate().getId());
            response.setCandidateName(app.getCandidate().getFullName());
            response.setCandidateEmail(app.getCandidate().getEmail());
        }
        if (app.getJob() != null) {
            response.setJobId(app.getJob().getId());
            response.setJobTitle(app.getJob().getTitle());
            response.setJobLocation(app.getJob().getLocation());
            if (app.getJob().getCompany() != null) {
                response.setCompanyName(app.getJob().getCompany().getName());
            }
        }
        response.setResumeReference(app.getResumeReference());
        response.setCoverLetter(app.getCoverLetter());
        response.setStatus(app.getStatus());
        response.setNotes(app.getNotes());
        response.setAppliedAt(app.getAppliedAt());
        response.setUpdatedAt(app.getUpdatedAt());

        if (app.getStatusHistories() != null) {
            response.setStatusHistories(app.getStatusHistories().stream()
                    .map(this::toStatusHistoryResponse)
                    .collect(Collectors.toList()));
        } else {
            response.setStatusHistories(Collections.emptyList());
        }

        return response;
    }

    public NotificationResponse toNotificationResponse(Notification notif) {
        if (notif == null) return null;
        return new NotificationResponse(
                notif.getId(),
                notif.getMessage(),
                notif.getType(),
                notif.isRead(),
                notif.getLinkUrl(),
                notif.getCreatedAt()
        );
    }
}
