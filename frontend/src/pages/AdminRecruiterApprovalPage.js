import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminRecruiterApprovalPage() {
  const [recruiters, setRecruiters] = useState([]);
  const [filter, setFilter] = useState('pending'); // 'all', 'pending', 'approved'
  const [loading, setLoading] = useState(true);

  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [decision, setDecision] = useState(true); // true = approve, false = reject
  const [notes, setNotes] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadRecruiters();
  }, [filter]);

  const loadRecruiters = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter === 'pending') params.approved = false;
      if (filter === 'approved') params.approved = true;

      const res = await api.getAdminRecruiters(params);
      if (res.data?.content) {
        setRecruiters(res.data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openDecisionModal = (recruiter, isApproval) => {
    setSelectedRecruiter(recruiter);
    setDecision(isApproval);
    setNotes(isApproval ? 'Verified enterprise domain and corporate credentials.' : 'Incomplete employer information provided.');
    setIsModalOpen(true);
  };

  const handleDecisionSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    try {
      await api.updateRecruiterApproval(selectedRecruiter.id, {
        approved: decision,
        notes,
      });
      setMsg(`Recruiter ${selectedRecruiter.fullName} (${selectedRecruiter.company?.name}) has been ${decision ? 'APPROVED' : 'REJECTED'}.`);
      setIsModalOpen(false);
      loadRecruiters();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update recruiter status');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Recruiter Approval & Verification</h1>
        <p className="text-gray-500 text-sm mt-1">
          Review corporate identities before employers are granted permission to publish job openings.
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

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            filter === 'pending'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Pending Review
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            filter === 'approved'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Approved Recruiters
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            filter === 'all'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          All Recruiters
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        {loading ? (
          <LoadingSpinner text="Loading recruiters..." />
        ) : recruiters.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-y border-gray-100">
                <tr>
                  <th className="py-3 px-4">Recruiter / User</th>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Website</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {recruiters.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-gray-900">
                      {r.fullName}
                      <span className="block text-xs font-normal text-gray-400">{r.email}</span>
                      {r.phone && <span className="block text-xs font-normal text-gray-400">{r.phone}</span>}
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-800">
                      {r.company?.name || 'Unspecified'}
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-500">
                      {r.company?.website ? (
                        <a href={r.company.website} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                          {r.company.website}
                        </a>
                      ) : (
                        'None'
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        r.approved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {r.approved ? 'Approved' : 'Pending Review'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      {!r.approved ? (
                        <>
                          <button
                            onClick={() => openDecisionModal(r, true)}
                            className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-1.5 rounded-xl transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openDecisionModal(r, false)}
                            className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-1.5 rounded-xl transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => openDecisionModal(r, false)}
                          className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-1.5 rounded-xl transition-colors"
                        >
                          Revoke Approval
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 text-sm">
            <p>No recruiters found for the selected filter.</p>
          </div>
        )}
      </div>

      {/* Decision Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={decision ? "Approve Recruiter Account" : "Reject / Revoke Recruiter Account"}
      >
        {selectedRecruiter && (
          <form onSubmit={handleDecisionSubmit} className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
              <p><span className="font-semibold text-gray-700">Recruiter:</span> {selectedRecruiter.fullName}</p>
              <p><span className="font-semibold text-gray-700">Company:</span> {selectedRecruiter.company?.name}</p>
              <p><span className="font-semibold text-gray-700">Email:</span> {selectedRecruiter.email}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Verification / Audit Notes
              </label>
              <textarea
                rows="3"
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2 text-white rounded-xl text-sm font-bold shadow-sm ${
                  decision ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {decision ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
