import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await api.getRecruiterJobs();
      if (res.data?.content) {
        setJobs(res.data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting? All received applications will be removed.")) {
      return;
    }
    setError('');
    setMsg('');
    try {
      await api.deleteJob(jobId);
      setMsg("Job posting deleted successfully.");
      loadJobs();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setError(err.message || "Failed to delete job.");
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading published job postings..." />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Manage Job Postings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Review, edit, or archive your organizational openings.
          </p>
        </div>
        <Link
          to="/recruiter/jobs/new"
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
        >
          <span>+</span> Create New Job
        </Link>
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
                  <th className="py-3 px-4">Job Title</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Applicants</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-gray-900">
                      <Link to={`/jobs/${job.id}`} className="hover:text-brand-600">
                        {job.title}
                      </Link>
                      <span className="block text-xs font-normal text-gray-400 mt-0.5">
                        Deadline: {job.applicationDeadline || 'Open'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-xs">{job.location}</td>
                    <td className="py-4 px-4 text-gray-600 text-xs">
                      {job.employmentType?.replace('_', ' ')}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        job.status === 'OPEN' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        job.status === 'DRAFT' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 bg-brand-50 text-brand-700 font-extrabold rounded-lg text-xs">
                        {job.applicationsCount || 0}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <Link
                        to={`/recruiter/jobs/${job.id}/edit`}
                        className="text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 text-sm">
            <p>You haven't posted any jobs yet.</p>
            <Link
              to="/recruiter/jobs/new"
              className="mt-4 inline-block bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-xl text-xs"
            >
              Post First Job Opening
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
