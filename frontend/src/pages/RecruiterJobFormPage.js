import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RecruiterJobFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('FULL_TIME');
  const [experienceRequirements, setExperienceRequirements] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [openings, setOpenings] = useState(1);
  const [qualificationRequirements, setQualificationRequirements] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [status, setStatus] = useState('OPEN');

  useEffect(() => {
    if (isEditing) {
      api.getJobById(id)
        .then(res => {
          if (res.data) {
            const j = res.data;
            setTitle(j.title || '');
            setDescription(j.description || '');
            setRequiredSkills(j.requiredSkills || '');
            setLocation(j.location || '');
            setEmploymentType(j.employmentType || 'FULL_TIME');
            setExperienceRequirements(j.experienceRequirements || '');
            setMinSalary(j.minSalary || '');
            setMaxSalary(j.maxSalary || '');
            setOpenings(j.openings || 1);
            setQualificationRequirements(j.qualificationRequirements || '');
            setApplicationDeadline(j.applicationDeadline || '');
            setStatus(j.status || 'OPEN');
          }
        })
        .catch(err => setError(err.message || 'Failed to fetch job data'))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      title,
      description,
      requiredSkills,
      location,
      employmentType,
      experienceRequirements,
      minSalary: minSalary ? Number(minSalary) : null,
      maxSalary: maxSalary ? Number(maxSalary) : null,
      openings: Number(openings),
      qualificationRequirements,
      applicationDeadline: applicationDeadline || null,
      status,
    };

    try {
      if (isEditing) {
        await api.updateJob(id, payload);
      } else {
        await api.createJob(payload);
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.message || 'Failed to save job posting');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading job posting details..." />;
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          {isEditing ? 'Edit Job Posting' : 'Create New Job Opening'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isEditing
            ? 'Update the criteria, qualifications, or status for this position.'
            : 'Fill in the role requirements to publish a new position.'}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Job Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Senior Software Engineer (Java / React)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Job Location *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Remote, New York, NY"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Employment Type *
            </label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Job Description *
          </label>
          <textarea
            rows="5"
            required
            placeholder="Detail the day-to-day responsibilities, tech stack, and team mission..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Required Technical Skills (Comma separated)
          </label>
          <input
            type="text"
            placeholder="Java, Spring Boot, React, Tailwind CSS, PostgreSQL"
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Min Annual Salary ($)
            </label>
            <input
              type="number"
              placeholder="e.g. 110000"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Max Annual Salary ($)
            </label>
            <input
              type="number"
              placeholder="e.g. 150000"
              value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Openings Headcount
            </label>
            <input
              type="number"
              min="1"
              value={openings}
              onChange={(e) => setOpenings(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Application Deadline
            </label>
            <input
              type="date"
              value={applicationDeadline}
              onChange={(e) => setApplicationDeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Posting Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
            >
              <option value="OPEN">OPEN (Published)</option>
              <option value="DRAFT">DRAFT (Hidden)</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Qualifications & Minimum Experience
          </label>
          <input
            type="text"
            placeholder="e.g. 4+ years developing microservices, B.S. in Computer Science"
            value={qualificationRequirements}
            onChange={(e) => setQualificationRequirements(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white"
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/recruiter/jobs')}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm shadow-md"
          >
            {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Job'}
          </button>
        </div>
      </form>
    </div>
  );
}
