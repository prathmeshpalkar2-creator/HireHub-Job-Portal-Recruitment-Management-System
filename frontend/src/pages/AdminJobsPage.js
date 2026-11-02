import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminJobs({ size: 50 });
      if (res.data?.content) {
        setJobs(res.data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminDelete = async (jobId) => {
    if (!window.confirm("As an Administrator, are you sure you want to permanently remove this job posting?")) {
      return;
    }
    setError('');
    setMsg('');
    try {
      await api.adminDeleteJob(jobId);
      setMsg("Job posting removed by administrative action.");
      loadJobs();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setError(err.message || "Failed to remove job.");
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading global job postings..." />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Job Catalog Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          Monitor all open, draft, and closed positions across all verified employers.
        </p>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-2xl font-medium">
          {msg}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl font-medium">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        {jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-y border-gray-100">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Employer / Company</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Applicants</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      <Link to={`/jobs/${job.id}`} className="hover:text-brand-600">
                        {job.title}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">
                      {job.company?.name || 'Verified Org'}
                      <span className="block text-xs font-normal text-gray-400">Recruiter ID: {job.recruiterId}</span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 text-xs">{job.location}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        job.status === 'OPEN' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        job.status === 'DRAFT' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-extrabold text-xs text-brand-600">
                        {job.applicationsCount || 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleAdminDelete(job.id)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200"
                      >
                        Delete Post
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 text-sm">
            <p>No jobs currently active on the platform.</p>
          </div>
        )}
      </div>
    </div>
  );
}
