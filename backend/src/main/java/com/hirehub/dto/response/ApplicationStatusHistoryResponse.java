package com.hirehub.dto.response;

import com.hirehub.enums.ApplicationStatus;
import java.time.LocalDateTime;

public class ApplicationStatusHistoryResponse {
    private Long id;
    private ApplicationStatus status;
    private String notes;
    private String changedBy;
    private LocalDateTime changedAt;

    public ApplicationStatusHistoryResponse() {}

    public ApplicationStatusHistoryResponse(Long id, ApplicationStatus status, String notes, String changedBy, LocalDateTime changedAt) {
        this.id = id;
        this.status = status;
        this.notes = notes;
        this.changedBy = changedBy;
        this.changedAt = changedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getChangedBy() { return changedBy; }
    public void setChangedBy(String changedBy) { this.changedBy = changedBy; }
    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }
}
