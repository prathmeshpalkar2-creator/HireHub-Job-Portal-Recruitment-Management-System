import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutUsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">About HireHub</h1>
        <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
          Pioneering modern recruitment through full transparency, streamlined applicant tracking, and enterprise-grade reliability.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm space-y-6 text-sm text-gray-700 leading-relaxed">
        <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
        <p>
          HireHub was created to bridge the communication gap between ambitious software professionals and verified hiring teams. Traditional recruitment platforms are often cluttered with stale job listings, unverified recruiters, and silent rejections.
        </p>
        <p>
          At HireHub, every employer profile is vetted before job postings can go live. Candidates receive real-time, transparent in-app status updates at every stage—from initial submission and review to shortlisting, interviews, and job offers.
        </p>

        <h2 className="text-xl font-bold text-gray-900 pt-4 border-t border-gray-100">Enterprise Full-Stack Architecture</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <h3 className="font-bold text-gray-900">React & Tailwind CSS</h3>
            <p className="text-xs text-gray-600 mt-1">
              Modular, responsive user interface with accessible components, role-specific portals, and instant client-side transitions.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <h3 className="font-bold text-gray-900">Java Spring Boot 3</h3>
            <p className="text-xs text-gray-600 mt-1">
              Stateless REST APIs, BCrypt password hashing, JWT authentication filters, and Spring Security 6 role-based authorization.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <h3 className="font-bold text-gray-900">PostgreSQL Persistence</h3>
            <p className="text-xs text-gray-600 mt-1">
              Relational schemas, foreign key integrity, duplicate prevention constraints, and transactional status histories.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <h3 className="font-bold text-gray-900">Cloud & Docker Ready</h3>
            <p className="text-xs text-gray-600 mt-1">
              Multi-stage container builds with Docker Compose for local orchestration and cloud-ready AWS deployments.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link to="/jobs" className="inline-block bg-brand-600 text-white font-bold px-8 py-3 rounded-xl shadow-md hover:bg-brand-700 transition-colors text-sm">
          Browse Open Positions
        </Link>
      </div>
    </div>
  );
}
