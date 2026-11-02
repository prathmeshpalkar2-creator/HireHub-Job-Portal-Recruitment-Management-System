import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import BrowseJobsPage from './pages/BrowseJobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import LoginPage from './pages/LoginPage';
import CandidateRegisterPage from './pages/CandidateRegisterPage';
import RecruiterRegisterPage from './pages/RecruiterRegisterPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';

// Candidate Pages
import CandidateDashboardPage from './pages/CandidateDashboardPage';
import CandidateProfilePage from './pages/CandidateProfilePage';
import CandidateApplicationsPage from './pages/CandidateApplicationsPage';
import CandidateNotificationsPage from './pages/CandidateNotificationsPage';

// Recruiter Pages
import RecruiterDashboardPage from './pages/RecruiterDashboardPage';
import RecruiterCompanyProfilePage from './pages/RecruiterCompanyProfilePage';
import RecruiterJobsPage from './pages/RecruiterJobsPage';
import RecruiterJobFormPage from './pages/RecruiterJobFormPage';
import RecruiterApplicationsPage from './pages/RecruiterApplicationsPage';
import RecruiterNotificationsPage from './pages/RecruiterNotificationsPage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRecruiterApprovalPage from './pages/AdminRecruiterApprovalPage';
import AdminCandidatesPage from './pages/AdminCandidatesPage';
import AdminJobsPage from './pages/AdminJobsPage';
import AdminApplicationsPage from './pages/AdminApplicationsPage';

// Layout with Navbar and Footer for public pages
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Layout with Navbar, Sidebar, and Content for portal dashboards
function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-grow max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-grow p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Pages */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/jobs" element={<BrowseJobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register/candidate" element={<CandidateRegisterPage />} />
              <Route path="/register/recruiter" element={<RecruiterRegisterPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
            </Route>

            {/* Candidate Portal */}
            <Route
              path="/candidate"
              element={
                <ProtectedRoute allowedRoles={['CANDIDATE']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<CandidateDashboardPage />} />
              <Route path="profile" element={<CandidateProfilePage />} />
              <Route path="applications" element={<CandidateApplicationsPage />} />
              <Route path="notifications" element={<CandidateNotificationsPage />} />
            </Route>

            {/* Recruiter Portal */}
            <Route
              path="/recruiter"
              element={
                <ProtectedRoute allowedRoles={['RECRUITER']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<RecruiterDashboardPage />} />
              <Route path="company" element={<RecruiterCompanyProfilePage />} />
              <Route path="jobs" element={<RecruiterJobsPage />} />
              <Route path="jobs/new" element={<RecruiterJobFormPage />} />
              <Route path="jobs/:id/edit" element={<RecruiterJobFormPage />} />
              <Route path="applications" element={<RecruiterApplicationsPage />} />
              <Route path="notifications" element={<RecruiterNotificationsPage />} />
            </Route>

            {/* Admin Portal */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="recruiters" element={<AdminRecruiterApprovalPage />} />
              <Route path="candidates" element={<AdminCandidatesPage />} />
              <Route path="jobs" element={<AdminJobsPage />} />
              <Route path="applications" element={<AdminApplicationsPage />} />
            </Route>
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}
