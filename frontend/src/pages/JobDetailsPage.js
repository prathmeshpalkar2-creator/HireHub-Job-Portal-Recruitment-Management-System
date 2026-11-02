import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isCandidate } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Apply Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await api.getJobById(id);
        if (res.data) {
          setJob(res.data);
        }
      } catch (err) {
        setError(err.message || 'Job posting not found');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && isCandidate) {
      api.getCandidateProfile()
        .then(res => setCandidateProfile(res.data))
        .catch(console.error);
    }
  }, [isAuthenticated, isCandidate]);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setApplyError('');
    try {
      await api.applyJob({
        jobId: Number(id),
        coverLetter,
        resumeReference: candidateProfile?.resumeOriginalName || 'Candidate Profile Resume',
      });
      setApplySuccess(true);
      setTimeout(() => {
        setIsApplyModalOpen(false);
      }, 2000);
    } catch (err) {
      setApplyError(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4">
        <LoadingSpinner text="Loading job specifications..." />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="bg-white p-8 rounded-2xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Job Not Found</h2>
          <p className="text-gray-500 mt-2">{error || 'This job opening may have been removed or expired.'}</p>
          <Link to="/jobs" className="mt-6 inline-block bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm">
            Browse other positions
          </Link>
        </div>
      </div>
    );
  }

  const skills = job.requiredSkills
    ? job.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-blue-500 text-white flex items-center justify-center text-2xl font-extrabold shadow-md flex-shrink-0">
              {job.company?.name ? job.company.name.charAt(0) : 'H'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase bg-blue-50 text-brand-700 border border-blue-200">
                  {job.employmentType?.replace('_', ' ')}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {job.status}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                {job.title}
              </h1>
              <p className="text-base font-semibold text-gray-600 mt-1">
                {job.company?.name || 'Verified Employer'} &bull; {job.location}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {isCandidate ? (
              <button
                onClick={handleApplyClick}
                className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
              >
                Apply for this Position
              </button>
            ) : !isAuthenticated ? (
              <button
                onClick={handleApplyClick}
                className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all"
              >
                Log In to Apply
              </button>
            ) : (
              <div className="text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                You are signed in as an {user?.role}.
              </div>
            )}
          </div>
        </div>

        {/* Quick summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-100 text-xs sm:text-sm">
          <div>
            <span className="text-gray-400 block text-xs">Offered Compensation</span>
            <span className="font-bold text-gray-900 mt-0.5 block text-emerald-600">
              {job.minSalary && job.maxSalary
                ? `$${Number(job.minSalary).toLocaleString()} - $${Number(job.maxSalary).toLocaleString()}`
                : 'Competitive / DOE'}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-xs">Experience Required</span>
            <span className="font-semibold text-gray-900 mt-0.5 block">
              {job.experienceRequirements || 'Not Specified'}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-xs">Open Headcount</span>
            <span className="font-semibold text-gray-900 mt-0.5 block">
              {job.openings || 1} Openings
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-xs">Application Deadline</span>
            <span className="font-semibold text-gray-900 mt-0.5 block">
              {job.applicationDeadline || 'Rolling Admission'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content & Company Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Job Description */}
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Role Overview</h2>
            <div className="prose text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {job.description}
            </div>

            {/* Qualifications */}
            {job.qualificationRequirements && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Qualifications & Education</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {job.qualificationRequirements}
                </p>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Required Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 font-semibold text-gray-800 text-xs border border-gray-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Company Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">About the Organization</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-gray-900">{job.company?.name || 'HireHub Partner'}</p>
                {job.company?.description && (
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{job.company.description}</p>
                )}
              </div>
              {job.company?.industry && (
                <div className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-800">Industry:</span> {job.company.industry}
                </div>
              )}
              {job.company?.companySize && (
                <div className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-800">Company Size:</span> {job.company.companySize}
                </div>
              )}
              {job.company?.website && (
                <div className="pt-2">
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
                  >
                    Visit Organization Website &rarr;
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
      >
        {applySuccess ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Application Submitted!</h3>
            <p className="text-sm text-gray-600">
              The hiring team has received your application. You will be notified when your status updates.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitApplication} className="space-y-4">
            {applyError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {applyError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Candidate Information
              </label>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
                <p><span className="font-semibold text-gray-700">Name:</span> {user?.fullName}</p>
                <p><span className="font-semibold text-gray-700">Email:</span> {user?.email}</p>
                <p>
                  <span className="font-semibold text-gray-700">Attached Resume:</span>{' '}
                  {candidateProfile?.resumeOriginalName ? (
                    <span className="text-emerald-700 font-medium">{candidateProfile.resumeOriginalName}</span>
                  ) : (
                    <span className="text-amber-600 font-medium">No resume uploaded yet (Upload via Profile)</span>
                  )}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Cover Letter (Optional)
              </label>
              <textarea
                rows="4"
                placeholder="Highlight your relevant experience, technical achievements, and why you are interested in this position..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
