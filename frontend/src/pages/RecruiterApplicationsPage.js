import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RecruiterApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const [newStatus, setNewStatus] = useState('SHORTLISTED');
  const [statusNotes, setStatusNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await api.getRecruiterApplications();
      if (res.data?.content) {
        setApplications(res.data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setStatusNotes('');
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setMsg('');

    try {
      await api.updateApplicationStatus(selectedApp.id, {
        status: newStatus,
        notes: statusNotes,
      });
      setMsg(`Candidate status successfully updated to ${newStatus}.`);
      setIsStatusModalOpen(false);
      loadApplications();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update applicant status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading candidate applications..." />;
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Applications Pipeline</h1>
        <p className="text-gray-500 text-sm mt-1">
          Review candidate profiles, view resumes, and update hiring stages.
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
        {applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-y border-gray-100">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">Applied</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Resume</th>
                  <th className="py-3 px-4 text-right">Review / Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-gray-900">
                      {app.candidateName}
                      <span className="block text-xs font-normal text-gray-400">{app.candidateEmail}</span>
                    </td>
                    <td className="py-4 px-4 text-gray-800 font-medium">{app.jobTitle}</td>
                    <td className="py-4 px-4 text-gray-500 text-xs">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(app.status)}`}>
                        {app.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <a
                        href={api.getCandidateResumeDownloadUrl(app.candidateId)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-1 rounded-lg"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Resume
                      </a>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => openStatusModal(app)}
                        className="text-xs font-bold text-white bg-gray-900 hover:bg-gray-800 px-3.5 py-1.5 rounded-lg transition-colors"
                      >
                        Update Stage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 text-sm">
            <p>No candidates have applied to your active postings yet.</p>
          </div>
        )}
      </div>

      {/* Stage Transition Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Candidate Stage Management"
      >
        {selectedApp && (
          <form onSubmit={handleStatusUpdateSubmit} className="space-y-4">
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1">
              <p><span className="font-semibold text-gray-700">Candidate:</span> {selectedApp.candidateName}</p>
              <p><span className="font-semibold text-gray-700">Target Role:</span> {selectedApp.jobTitle}</p>
              {selectedApp.coverLetter && (
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <span className="font-semibold text-gray-700 block mb-1">Applicant Cover Letter:</span>
                  <p className="text-gray-600 italic whitespace-pre-line">{selectedApp.coverLetter}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                New Recruitment Stage *
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
              >
                <option value="APPLIED">APPLIED (Received)</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                <option value="SHORTLISTED">SHORTLISTED</option>
                <option value="INTERVIEW">INTERVIEW (Invitation)</option>
                <option value="SELECTED">SELECTED (Offer Extended)</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Evaluation Notes / Feedback
              </label>
              <textarea
                rows="3"
                placeholder="e.g. Cleared technical screening; schedule round 2 architecture discussion..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-sm"
              >
                {updating ? 'Saving...' : 'Update Status & Notify'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
