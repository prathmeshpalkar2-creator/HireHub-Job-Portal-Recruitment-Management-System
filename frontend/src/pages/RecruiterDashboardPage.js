import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardStatCard from '../components/DashboardStatCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RecruiterDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getRecruiterDashboard();
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
    return <LoadingSpinner text="Loading recruiter workspace metrics..." />;
  }

  const metrics = stats?.metrics || {};
  const recent = stats?.recentActivity || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Recruiter Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your job listings, track applicant pipelines, and advance candidates.
        </p>
      </div>

      {/* Approval Status Banner if not approved */}
      {!user?.isApproved && (
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-3xl flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 font-bold">
            !
          </div>
          <div>
            <h3 className="font-bold text-amber-900 text-sm">Account Verification In Progress</h3>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              Your employer profile has been submitted and is currently being verified by an administrator. You will be able to publish active job postings as soon as approval is granted.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardStatCard
          title="Total Job Postings"
          value={metrics.totalJobPostings || 0}
          color="brand"
        />
        <DashboardStatCard
          title="Active Open Positions"
          value={metrics.activeJobs || 0}
          color="emerald"
        />
        <DashboardStatCard
          title="Total Applications Received"
          value={metrics.totalApplications || 0}
          color="purple"
        />
        <DashboardStatCard
          title="Shortlisted / Hired"
          value={(metrics.shortlistedCandidates || 0) + (metrics.selectedCandidates || 0)}
          color="amber"
        />
      </div>

      {/* Quick Action Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/recruiter/jobs/new"
          className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-colors flex items-center gap-2"
        >
          <span>+</span> Post a New Job
        </Link>
        <Link
          to="/recruiter/jobs"
          className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-xs transition-colors"
        >
          View All Posted Jobs
        </Link>
        <Link
          to="/recruiter/applications"
          className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-xs transition-colors"
        >
          Manage Applicants
        </Link>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Recent Applications Received</h2>
          <Link
            to="/recruiter/applications"
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 hover:underline"
          >
            Review all &rarr;
          </Link>
        </div>

        {recent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-y border-gray-100">
                <tr>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Target Job</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {recent.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {app.candidateName}
                      <span className="block text-xs font-normal text-gray-400">{app.candidateEmail}</span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">{app.jobTitle}</td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-brand-700 border border-blue-200">
                        {app.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/recruiter/applications"
                        className="text-xs font-semibold text-brand-600 hover:text-brand-800"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm">
            <p>No job applications received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
