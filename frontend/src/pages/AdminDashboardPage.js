import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import DashboardStatCard from '../components/DashboardStatCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getAdminDashboard();
        if (res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading enterprise system metrics..." />;
  }

  const metrics = stats?.metrics || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">System Administration</h1>
        <p className="text-gray-500 text-sm mt-1">
          Complete platform metrics, recruiter approvals, content moderation, and system audits.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardStatCard
          title="Total Registered Users"
          value={metrics.totalUsers || 0}
          color="brand"
        />
        <DashboardStatCard
          title="Pending Recruiter Approvals"
          value={metrics.pendingRecruiterApprovals || 0}
          color="amber"
        />
        <DashboardStatCard
          title="Active Job Postings"
          value={metrics.activeJobPostings || 0}
          color="emerald"
        />
        <DashboardStatCard
          title="Total Applications Filed"
          value={metrics.totalApplications || 0}
          color="purple"
        />
      </div>

      {/* Secondary User Demographics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate Community</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">{metrics.totalCandidates || 0}</p>
          </div>
          <Link
            to="/admin/candidates"
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 border border-brand-200 px-3 py-1.5 rounded-xl"
          >
            Manage Candidates &rarr;
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered Employers</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">{metrics.totalRecruiters || 0}</p>
          </div>
          <Link
            to="/admin/recruiters"
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl"
          >
            Review Approvals &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/recruiters"
          className="bg-white rounded-3xl border border-gray-200 p-6 hover:shadow-md hover:border-brand-300 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
            ✓
          </div>
          <h3 className="font-bold text-gray-900 group-hover:text-brand-600">Recruiter Verification</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Approve or suspend corporate accounts before employers can publish open positions.
          </p>
        </Link>

        <Link
          to="/admin/jobs"
          className="bg-white rounded-3xl border border-gray-200 p-6 hover:shadow-md hover:border-brand-300 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-600 flex items-center justify-center font-bold mb-4">
            💼
          </div>
          <h3 className="font-bold text-gray-900 group-hover:text-brand-600">Job Catalog Moderation</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Audit public job listings across organizations and immediately remove non-compliant content.
          </p>
        </Link>

        <Link
          to="/admin/applications"
          className="bg-white rounded-3xl border border-gray-200 p-6 hover:shadow-md hover:border-brand-300 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-4">
            📋
          </div>
          <h3 className="font-bold text-gray-900 group-hover:text-brand-600">Global Applications</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Analyze hiring conversion rates and inspect application status transitions across all jobs.
          </p>
        </Link>
      </div>
    </div>
  );
}
