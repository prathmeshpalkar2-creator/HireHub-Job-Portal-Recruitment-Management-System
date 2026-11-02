const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('hirehub_token');
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If not FormData, default to application/json
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized globally
  if (response.status === 401 && !endpoint.includes('/auth/login')) {
    localStorage.removeItem('hirehub_token');
    localStorage.removeItem('hirehub_user');
    window.dispatchEvent(new Event('auth:unauthorized'));
  }

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.errors || (typeof data === 'string' ? data : 'An unexpected error occurred');
    const err = new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  registerCandidate: (data) => request('/auth/register/candidate', { method: 'POST', body: JSON.stringify(data) }),
  registerRecruiter: (data) => request('/auth/register/recruiter', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),

  // Jobs
  searchJobs: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return request(`/jobs?${query.toString()}`);
  },
  getJobById: (id) => request(`/jobs/${id}`),
  createJob: (jobData) => request('/jobs', { method: 'POST', body: JSON.stringify(jobData) }),
  updateJob: (id, jobData) => request(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(jobData) }),
  deleteJob: (id) => request(`/jobs/${id}`, { method: 'DELETE' }),

  // Candidate
  getCandidateProfile: () => request('/candidates/me'),
  updateCandidateProfile: (profileData) => request('/candidates/me', { method: 'PUT', body: JSON.stringify(profileData) }),
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/candidates/me/resume', { method: 'POST', body: formData });
  },
  getCandidateDashboard: () => request('/candidates/dashboard'),
  getCandidateResumeUrl: () => `${API_BASE_URL}/candidates/me/resume`,

  // Recruiter
  getRecruiterProfile: () => request('/recruiters/me'),
  updateRecruiterProfile: (data) => request('/recruiters/me', { method: 'PUT', body: JSON.stringify(data) }),
  getRecruiterJobs: (params = {}) => {
    const query = new URLSearchParams(params);
    return request(`/recruiters/me/jobs?${query.toString()}`);
  },
  getRecruiterApplications: (params = {}) => {
    const query = new URLSearchParams(params);
    return request(`/recruiters/me/applications?${query.toString()}`);
  },
  getRecruiterDashboard: () => request('/recruiters/dashboard'),
  getCandidateResumeDownloadUrl: (candidateUserId) => `${API_BASE_URL}/recruiters/candidates/${candidateUserId}/resume`,

  // Applications
  applyJob: (data) => request('/applications', { method: 'POST', body: JSON.stringify(data) }),
  getCandidateApplications: (params = {}) => {
    const query = new URLSearchParams(params);
    return request(`/applications/me?${query.toString()}`);
  },
  getApplicationById: (id) => request(`/applications/${id}`),
  updateApplicationStatus: (id, statusData) => request(`/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify(statusData) }),
  withdrawApplication: (id) => request(`/applications/${id}/withdraw`, { method: 'PATCH' }),

  // Admin
  getAdminDashboard: () => request('/admin/dashboard'),
  getAdminCandidates: (params = {}) => {
    const query = new URLSearchParams(params);
    return request(`/admin/candidates?${query.toString()}`);
  },
  getAdminRecruiters: (params = {}) => {
    const query = new URLSearchParams(params);
    return request(`/admin/recruiters?${query.toString()}`);
  },
  updateRecruiterApproval: (id, data) => request(`/admin/recruiters/${id}/approval`, { method: 'PATCH', body: JSON.stringify(data) }),
  getAdminJobs: (params = {}) => {
    const query = new URLSearchParams(params);
    return request(`/admin/jobs?${query.toString()}`);
  },
  adminDeleteJob: (id) => request(`/admin/jobs/${id}`, { method: 'DELETE' }),
  getAdminApplications: (params = {}) => {
    const query = new URLSearchParams(params);
    return request(`/admin/applications?${query.toString()}`);
  },

  // Notifications
  getNotifications: (params = {}) => {
    const query = new URLSearchParams(params);
    return request(`/notifications?${query.toString()}`);
  },
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'POST' }),
  getUnreadNotificationsCount: () => request('/notifications/unread-count'),
};
