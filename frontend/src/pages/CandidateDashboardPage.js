import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import DashboardStatCard from '../components/DashboardStatCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CandidateDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getCandidateDashboard();
        if (res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading candidate metrics..." />;
  }

  const metrics = stats?.metrics || {};
  const recent = stats?.recentActivity || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Candidate Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Monitor your job submissions, pipeline statuses, and career recommendations.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardStatCard
          title="Total Applications"
          value={metrics.totalApplications || 0}
          color="brand"
        />
        <DashboardStatCard
          title="Pending Review"
          value={metrics.pendingApplications || 0}
          color="amber"
        />
        <DashboardStatCard
          title="Shortlisted"
          value={metrics.shortlistedApplications || 0}
          color="purple"
        />
        <DashboardStatCard
          title="Interviews / Offers"
          value={(metrics.interviewInvitations || 0) + (metrics.selectedApplications || 0)}
          color="emerald"
        />
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
          <Link
            to="/candidate/applications"
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 hover:underline"
          >
            View all &rarr;
          </Link>
        </div>

        {recent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-y border-gray-100">
                <tr>
                  <th className="py-3 px-4">Role Title</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Submitted On</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {recent.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">{app.jobTitle}</td>
                    <td className="py-3.5 px-4 text-gray-600">{app.companyName || 'Verified Org'}</td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        app.status === 'APPLIED' ? 'bg-blue-50 text-brand-700 border border-blue-200' :
                        app.status === 'SHORTLISTED' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        app.status === 'INTERVIEW' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        app.status === 'SELECTED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        app.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {app.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/jobs/${app.jobId}`}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-800"
                      >
                        View Job
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm">
            <p>You haven't submitted any job applications yet.</p>
            <Link
              to="/jobs"
              className="mt-3 inline-block bg-brand-600 text-white font-semibold px-4 py-2 rounded-xl text-xs"
            >
              Browse Open Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
