import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await api.searchJobs({ size: 6 });
        if (res.data?.content) {
          setFeaturedJobs(res.data.content);
        }
      } catch (err) {
        console.error("Failed to load featured jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchTerm) query.append('search', searchTerm);
    if (locationTerm) query.append('location', locationTerm);
    navigate(`/jobs?${query.toString()}`);
  };

  return (
    <div className="space-y-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-gray-50 py-20 lg:py-28 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-800 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></span>
            HireHub 2.0 Enterprise Recruitment Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Find Your Dream Career or Hire <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-600">World-Class Talent</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The next-generation recruitment management ecosystem connecting verified top companies with high-performing professionals.
          </p>

          {/* Search Bar */}
          <div className="mt-10 max-w-3xl mx-auto bg-white p-3 rounded-2xl shadow-xl border border-gray-200">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5 relative flex items-center">
                <svg className="w-5 h-5 text-gray-400 absolute left-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Job title, skills, or company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-transparent focus:border-brand-500 focus:bg-white bg-gray-50 text-sm focus:outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-4 relative flex items-center">
                <svg className="w-5 h-5 text-gray-400 absolute left-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-transparent focus:border-brand-500 focus:bg-white bg-gray-50 text-sm focus:outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full h-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  Search Jobs
                </button>
              </div>
            </form>
          </div>

          {/* Quick tags */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500">
            <span className="font-medium text-gray-700">Popular:</span>
            {['Java', 'Spring Boot', 'React', 'Remote', 'Full-Stack', 'PostgreSQL'].map(tag => (
              <button
                key={tag}
                onClick={() => { setSearchTerm(tag); navigate(`/jobs?search=${tag}`); }}
                className="bg-white border border-gray-200 hover:border-brand-500 hover:text-brand-600 px-3 py-1 rounded-full font-medium transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Featured Job Openings</h2>
            <p className="text-gray-500 mt-1 text-sm">Discover recent verified opportunities from leading organizations</p>
          </div>
          <Link
            to="/jobs"
            className="mt-4 sm:mt-0 inline-flex items-center font-semibold text-brand-600 hover:text-brand-700 hover:underline gap-1 text-sm"
          >
            Explore all jobs &rarr;
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching open positions..." />
        ) : featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 font-medium">No open positions found. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Why HireHub (Value Props) */}
      <section className="bg-gray-100 py-16 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Built for Modern Recruitment</h2>
            <p className="text-gray-600 mt-2 text-sm">End-to-end transparency, automated status updates, and verified employer profiles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Verified Employers</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Recruiters undergo administrative approval before posting, ensuring legitimized openings and spam protection.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Real-Time Application Tracking</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Receive instant in-app alerts whenever your status changes from Applied to Under Review, Shortlisted, or Interview.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Granular Recruiter Controls</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Filter candidate pools, review tailored resumes, move applicants between stages, and download profiles securely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 text-white p-10 sm:p-14 text-center shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold max-w-2xl mx-auto leading-tight">
            Ready to Take the Next Step in Your Professional Career?
          </h2>
          <p className="mt-4 text-brand-200 max-w-xl mx-auto text-base">
            Create your candidate profile in less than 2 minutes and upload your resume today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register/candidate"
              className="w-full sm:w-auto bg-white text-brand-900 hover:bg-brand-50 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-colors"
            >
              Get Started as Candidate
            </Link>
            <Link
              to="/register/recruiter"
              className="w-full sm:w-auto bg-brand-700 hover:bg-brand-600 border border-brand-500 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-colors"
            >
              Post Jobs for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
