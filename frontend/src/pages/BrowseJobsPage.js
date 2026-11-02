import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function BrowseJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [employmentType, setEmploymentType] = useState(searchParams.get('employmentType') || '');
  const [minSalary, setMinSalary] = useState(searchParams.get('minSalary') || '');
  const [page, setPage] = useState(0);

  const [jobsData, setJobsData] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          size: 9,
          search: searchParams.get('search') || undefined,
          location: searchParams.get('location') || undefined,
          employmentType: searchParams.get('employmentType') || undefined,
          minSalary: searchParams.get('minSalary') || undefined,
        };
        const res = await api.searchJobs(params);
        if (res.data) {
          setJobsData(res.data);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [searchParams, page]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const newParams = {};
    if (search) newParams.search = search;
    if (location) newParams.location = location;
    if (employmentType) newParams.employmentType = employmentType;
    if (minSalary) newParams.minSalary = minSalary;
    setPage(0);
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearch('');
    setLocation('');
    setEmploymentType('');
    setMinSalary('');
    setPage(0);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Explore Open Careers</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Browse verified opportunities from top global employers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Search Filters
              </h2>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-brand-600 hover:text-brand-800 font-semibold"
              >
                Reset All
              </button>
            </div>

            <form onSubmit={handleApplyFilters} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Keywords / Skills
                </label>
                <input
                  type="text"
                  placeholder="e.g. Java, React, Cloud"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City, State, or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Employment Type
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
                >
                  <option value="">All Employment Types</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Min Salary ($ / Year)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 80000"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-colors"
              >
                Apply Filters
              </button>
            </form>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">
              Showing <span className="font-bold text-gray-900">{jobsData.totalElements}</span> jobs
            </span>
          </div>

          {loading ? (
            <LoadingSpinner text="Searching jobs..." />
          ) : jobsData.content.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobsData.content.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* Pagination Controls */}
              {jobsData.totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                    className={`px-4 py-2 border rounded-xl text-sm font-medium transition-colors ${
                      page === 0
                        ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    &larr; Previous
                  </button>

                  <span className="text-sm font-medium text-gray-600">
                    Page {page + 1} of {jobsData.totalPages}
                  </span>

                  <button
                    disabled={page >= jobsData.totalPages - 1}
                    onClick={() => setPage((prev) => prev + 1)}
                    className={`px-4 py-2 border rounded-xl text-sm font-medium transition-colors ${
                      page >= jobsData.totalPages - 1
                        ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">No jobs match your criteria</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Try loosening your search terms or resetting filters to explore all open opportunities.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-6 px-4 py-2 bg-brand-50 text-brand-700 font-semibold rounded-xl text-sm hover:bg-brand-100 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
