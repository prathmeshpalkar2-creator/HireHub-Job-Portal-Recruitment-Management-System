import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await api.getAdminApplications({ size: 50 });
      if (res.data?.content) {
        setApplications(res.data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Aggregating global applications..." />;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED':
        return 'bg-blue-50 text-brand-700 border-blue-200';
      case 'UNDER_REVIEW':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'SHORTLISTED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'INTERVIEW':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'SELECTED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'WITHDRAWN':
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">All Platform Applications</h1>
        <p className="text-gray-500 text-sm mt-1">
          Complete cross-organizational audit of all job seeker submissions.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        {applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-y border-gray-100">
                <tr>
                  <th className="py-3 px-4">App ID</th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Target Job</th>
                  <th className="py-3 px-4">Employer</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-gray-500">#{app.id}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {app.candidateName}
                      <span className="block text-xs font-normal text-gray-400">{app.candidateEmail}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">{app.jobTitle}</td>
                    <td className="py-3.5 px-4 text-gray-600 text-xs">{app.companyName || 'Verified Employer'}</td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(app.status)}`}>
                        {app.status?.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 text-sm">
            <p>No applications recorded in the system yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
