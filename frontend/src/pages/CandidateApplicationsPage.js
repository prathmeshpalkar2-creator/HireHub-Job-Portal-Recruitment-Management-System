import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await api.getCandidateApplications();
      if (res.data?.content) {
        setApplications(res.data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (appId) => {
    if (!window.confirm("Are you sure you want to withdraw this application? This action cannot be reversed.")) {
      return;
    }
    setErrorMsg('');
    setActionMsg('');
    try {
      await api.withdrawApplication(appId);
      setActionMsg("Application withdrawn successfully.");
      loadApplications();
      setTimeout(() => setActionMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to withdraw application.");
    }
  };

  const openAppDetails = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  if (loading) {
    return <LoadingSpinner text="Loading submitted applications..." />;
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">My Applications</h1>
        <p className="text-gray-500 text-sm mt-1">
          Track the live review status and history of your job applications.
        </p>
      </div>

      {actionMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-2xl font-medium">
          {actionMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl font-medium">
          {errorMsg}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        {applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-y border-gray-100">
                <tr>
                  <th className="py-3 px-4">Role Title</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-gray-900">
                      <Link to={`/jobs/${app.jobId}`} className="hover:text-brand-600">
                        {app.jobTitle}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{app.companyName || 'Verified Org'}</td>
                    <td className="py-4 px-4 text-gray-500 text-xs">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(app.status)}`}>
                        {app.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => openAppDetails(app)}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 px-2.5 py-1.5 rounded-lg border border-brand-200"
                      >
                        History
                      </button>

                      {app.status !== 'SELECTED' && app.status !== 'REJECTED' && app.status !== 'WITHDRAWN' && (
                        <button
                          onClick={() => handleWithdraw(app.id)}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200"
                        >
                          Withdraw
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="font-semibold text-gray-700">No applications submitted yet.</p>
            <p className="text-xs text-gray-400 mt-1">Browse our verified open jobs and apply with your profile.</p>
            <Link
              to="/jobs"
              className="mt-4 inline-block bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-xl text-xs"
            >
              Explore Open Roles
            </Link>
          </div>
        )}
      </div>

      {/* History & Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Application Status History & Details"
      >
        {selectedApp && (
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
              <p><span className="font-semibold text-gray-700">Role:</span> {selectedApp.jobTitle}</p>
              <p><span className="font-semibold text-gray-700">Company:</span> {selectedApp.companyName}</p>
              <p><span className="font-semibold text-gray-700">Submitted:</span> {new Date(selectedApp.appliedAt).toLocaleString()}</p>
              {selectedApp.notes && (
                <p><span className="font-semibold text-gray-700">Hiring Notes:</span> {selectedApp.notes}</p>
              )}
            </div>

            {selectedApp.coverLetter && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Your Cover Letter</h4>
                <div className="p-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 whitespace-pre-line max-h-32 overflow-y-auto">
                  {selectedApp.coverLetter}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Workflow Audit Log</h4>
              <div className="space-y-2">
                {selectedApp.statusHistories && selectedApp.statusHistories.length > 0 ? (
                  selectedApp.statusHistories.map((hist) => (
                    <div key={hist.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs flex justify-between items-start">
                      <div>
                        <span className={`inline-block px-2 py-0.5 rounded-md font-bold uppercase text-[10px] border mb-1 ${getStatusBadge(hist.status)}`}>
                          {hist.status}
                        </span>
                        <p className="text-gray-700 font-medium">{hist.notes || 'Status updated'}</p>
                        <p className="text-gray-400 text-[10px] mt-0.5">Updated by {hist.changedBy || 'System'}</p>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {new Date(hist.changedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">No status audit events recorded.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
