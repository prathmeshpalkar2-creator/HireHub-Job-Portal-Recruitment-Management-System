import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CandidateProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [headline, setHeadline] = useState('');
  const [summary, setSummary] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [educations, setEducations] = useState([]);
  const [workExperiences, setWorkExperiences] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.getCandidateProfile();
      if (res.data) {
        const d = res.data;
        setProfile(d);
        setFullName(d.fullName || '');
        setPhone(d.phone || '');
        setHeadline(d.headline || '');
        setSummary(d.summary || '');
        setCurrentLocation(d.currentLocation || '');
        setLinkedinUrl(d.linkedinUrl || '');
        setGithubUrl(d.githubUrl || '');
        setSkillsText(d.skillsText || '');
        setEducations(d.educations || []);
        setWorkExperiences(d.workExperiences || []);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch candidate profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        fullName,
        phone,
        headline,
        summary,
        currentLocation,
        linkedinUrl,
        githubUrl,
        skillsText,
        educations,
        workExperiences,
      };
      const res = await api.updateCandidateProfile(payload);
      setProfile(res.data);
      setSuccessMsg('Candidate profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingResume(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await api.uploadResume(file);
      setProfile(res.data);
      setSuccessMsg('Resume uploaded successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Resume upload failed. Please upload a PDF or DOCX file (max 10MB).');
    } finally {
      setUploadingResume(false);
      e.target.value = '';
    }
  };

  // Education helpers
  const addEducation = () => {
    setEducations([...educations, { institution: '', degree: '', fieldOfStudy: '', graduationYear: '', grade: '' }]);
  };
  const removeEducation = (index) => {
    setEducations(educations.filter((_, i) => i !== index));
  };
  const updateEducation = (index, field, value) => {
    const copy = [...educations];
    copy[index][field] = value;
    setEducations(copy);
  };

  // Experience helpers
  const addExperience = () => {
    setWorkExperiences([...workExperiences, { companyName: '', jobTitle: '', location: '', startDate: '', endDate: '', currentlyWorking: false, description: '' }]);
  };
  const removeExperience = (index) => {
    setWorkExperiences(workExperiences.filter((_, i) => i !== index));
  };
  const updateExperience = (index, field, value) => {
    const copy = [...workExperiences];
    copy[index][field] = value;
    setWorkExperiences(copy);
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving profile details..." />;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">My Candidate Profile</h1>
        <p className="text-gray-500 text-sm mt-1">
          Keep your professional details, credentials, and resume up to date for hiring managers.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-2xl font-medium">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl font-medium">
          {errorMsg}
        </div>
      )}

      {/* Resume Upload Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Resume Document</h2>
        <p className="text-xs text-gray-500 mb-6">
          Upload your resume in PDF or DOCX format (maximum 10MB). Recruiters will see this when reviewing your applications.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                {profile?.resumeOriginalName || 'No resume uploaded yet'}
              </p>
              {profile?.resumeFileSize && (
                <p className="text-xs text-gray-500">
                  Size: {(profile.resumeFileSize / (1024 * 1024)).toFixed(2)} MB
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {profile?.resumeFileName && (
              <a
                href={api.getCandidateResumeUrl()}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl text-xs hover:bg-gray-100 transition-colors"
              >
                Download Current
              </a>
            )}
            <label className="cursor-pointer px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-xs shadow-sm transition-colors">
              {uploadingResume ? 'Uploading...' : 'Upload New Resume'}
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleResumeFileChange}
                disabled={uploadingResume}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Personal & Headline Details */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Current Location
              </label>
              <input
                type="text"
                placeholder="City, State"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Professional Headline
              </label>
              <input
                type="text"
                placeholder="e.g. Lead Java & React Architect"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Career Summary
            </label>
            <textarea
              rows="4"
              placeholder="Outline your background, software engineering experience, and technical accomplishments..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Technical Skills (Comma separated)
            </label>
            <input
              type="text"
              placeholder="Java, Spring Boot, React, Tailwind CSS, PostgreSQL, AWS, Docker"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                GitHub Profile URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/username"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Education</h2>
            <button
              type="button"
              onClick={addEducation}
              className="px-3 py-1.5 bg-brand-50 text-brand-700 font-semibold text-xs rounded-xl hover:bg-brand-100 transition-colors"
            >
              + Add Education
            </button>
          </div>

          {educations.map((edu, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 relative space-y-3">
              <button
                type="button"
                onClick={() => removeEducation(idx)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xs font-semibold"
              >
                Remove
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Institution / University</label>
                  <input
                    type="text"
                    required
                    value={edu.institution}
                    onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Degree</label>
                  <input
                    type="text"
                    required
                    value={edu.degree}
                    onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Graduation Year</label>
                  <input
                    type="number"
                    value={edu.graduationYear || ''}
                    onChange={(e) => updateEducation(idx, 'graduationYear', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Grade / GPA</label>
                  <input
                    type="text"
                    value={edu.grade || ''}
                    onChange={(e) => updateEducation(idx, 'grade', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Work Experience Section */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Work Experience</h2>
            <button
              type="button"
              onClick={addExperience}
              className="px-3 py-1.5 bg-brand-50 text-brand-700 font-semibold text-xs rounded-xl hover:bg-brand-100 transition-colors"
            >
              + Add Experience
            </button>
          </div>

          {workExperiences.map((exp, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 relative space-y-3">
              <button
                type="button"
                onClick={() => removeExperience(idx)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xs font-semibold"
              >
                Remove
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={exp.companyName}
                    onChange={(e) => updateExperience(idx, 'companyName', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={exp.jobTitle}
                    onChange={(e) => updateExperience(idx, 'jobTitle', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Jan 2022"
                    value={exp.startDate || ''}
                    onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">End Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Present"
                    value={exp.endDate || ''}
                    onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Key Responsibilities / Impact</label>
                <textarea
                  rows="2"
                  value={exp.description || ''}
                  onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                ></textarea>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl text-sm shadow-md transition-colors"
        >
          {saving ? 'Saving Changes...' : 'Save Profile Details'}
        </button>
      </form>
    </div>
  );
}
