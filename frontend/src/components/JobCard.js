import React from 'react';
import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary Negotiable';
    if (min && max) return `$${Number(min).toLocaleString()} - $${Number(max).toLocaleString()}`;
    return min ? `From $${Number(min).toLocaleString()}` : `Up to $${Number(max).toLocaleString()}`;
  };

  const skillsList = job.requiredSkills
    ? job.requiredSkills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4)
    : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-brand-300 transition-all group flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-lg font-bold text-gray-700 flex-shrink-0">
              {job.company?.name ? job.company.name.charAt(0) : 'J'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                <Link to={`/jobs/${job.id}`}>{job.title}</Link>
              </h3>
              <p className="text-sm font-medium text-gray-600 mt-0.5">
                {job.company?.name || 'Verified Employer'}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
            {job.employmentType?.replace('_', ' ')}
          </span>
        </div>

        <p className="text-sm text-gray-600 mt-4 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {skillsList.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {skillsList.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-2.5 py-1 rounded-lg transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-medium text-gray-700">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </span>
          <span className="flex items-center gap-1 font-semibold text-emerald-600">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatSalary(job.minSalary, job.maxSalary)}
          </span>
        </div>
        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex items-center justify-center font-semibold text-brand-600 hover:text-brand-700 hover:underline gap-1"
        >
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
}
