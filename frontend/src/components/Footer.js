import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-extrabold text-lg">
                H
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Hire<span className="text-brand-400">Hub</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Enterprise Job Portal & Recruitment Management System connecting high-caliber talent with verified industry employers.
            </p>
            <div className="text-xs text-gray-500">
              Built with React, Spring Boot 3 & PostgreSQL.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Candidates</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Browse All Jobs</Link></li>
              <li><Link to="/register/candidate" className="hover:text-white transition-colors">Create Candidate Profile</Link></li>
              <li><Link to="/candidate/dashboard" className="hover:text-white transition-colors">Application Tracker</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Recruiters</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register/recruiter" className="hover:text-white transition-colors">Register Company Account</Link></li>
              <li><Link to="/recruiter/jobs/new" className="hover:text-white transition-colors">Post a New Job</Link></li>
              <li><Link to="/recruiter/applications" className="hover:text-white transition-colors">Candidate Management</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About HireHub</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Help & Support</Link></li>
              <li><span className="inline-flex items-center gap-1.5 text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full font-medium">REST API v1.0 Online</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} HireHub Inc. All rights reserved.</p>
          <p className="mt-4 sm:mt-0">Designed & engineered for production recruitment workflows.</p>
        </div>
      </div>
    </footer>
  );
}
