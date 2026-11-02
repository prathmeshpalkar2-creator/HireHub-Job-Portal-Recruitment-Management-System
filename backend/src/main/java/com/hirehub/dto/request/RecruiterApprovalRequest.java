package com.hirehub.dto.request;

import jakarta.validation.constraints.NotNull;

public class RecruiterApprovalRequest {

    @NotNull(message = "Approval status must be provided")
    private Boolean approved;

    private String notes;

    public RecruiterApprovalRequest() {}

    public Boolean getApproved() { return approved; }
    public void setApproved(Boolean approved) { this.approved = approved; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
