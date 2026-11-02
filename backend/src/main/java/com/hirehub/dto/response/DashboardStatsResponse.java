package com.hirehub.dto.response;

import java.util.Map;

public class DashboardStatsResponse {
    private Map<String, Object> metrics;
    private Object recentActivity;

    public DashboardStatsResponse() {}

    public DashboardStatsResponse(Map<String, Object> metrics, Object recentActivity) {
        this.metrics = metrics;
        this.recentActivity = recentActivity;
    }

    public Map<String, Object> getMetrics() { return metrics; }
    public void setMetrics(Map<String, Object> metrics) { this.metrics = metrics; }
    public Object getRecentActivity() { return recentActivity; }
    public void setRecentActivity(Object recentActivity) { this.recentActivity = recentActivity; }
}
