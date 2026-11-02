import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function Navbar() {
  const { user, isAuthenticated, isCandidate, isRecruiter, isAdmin, logout } = useAuth();
  const { unreadCount } = useNotification();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isRecruiter) return '/recruiter/dashboard';
    return '/candidate/dashboard';
  };

  const getNotificationLink = () => {
    if (isRecruiter) return '/recruiter/notifications';
    if (isAdmin) return '/admin/dashboard';
    return '/candidate/notifications';
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Main Nav */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-blue-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform">
                H
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-gray-900">
                Hire<span className="text-brand-600">Hub</span>
              </span>
            </Link>

            <div className="hidden md:ml-8 md:flex md:space-x-6">
              <Link to="/jobs" className="text-gray-700 hover:text-brand-600 px-3 py-2 text-sm font-medium transition-colors">
                Browse Jobs
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-brand-600 px-3 py-2 text-sm font-medium transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-brand-600 px-3 py-2 text-sm font-medium transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Right Section: Auth or User Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Notification Bell */}
                <Link
                  to={getNotificationLink()}
                  className="relative p-2 text-gray-600 hover:text-brand-600 hover:bg-gray-100 rounded-full transition-colors"
                  title="Notifications"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Dashboard Quick Link Button */}
                <Link
                  to={getDashboardLink()}
                  className="bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <span className="max-w-[120px] truncate">{user?.fullName}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase bg-gray-100 text-gray-700 border">
                      {user?.role}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50 divide-y divide-gray-100"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 text-xs text-gray-500">
                        Signed in as <br />
                        <span className="font-semibold text-gray-800 truncate block">{user?.email}</span>
                      </div>
                      <div className="py-1">
                        <Link
                          to={getDashboardLink()}
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          My Dashboard
                        </Link>
                        {isCandidate && (
                          <Link
                            to="/candidate/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Profile & Resume
                          </Link>
                        )}
                        {isRecruiter && (
                          <Link
                            to="/recruiter/company"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Company Profile
                          </Link>
                        )}
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-brand-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register/candidate"
                  className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
                >
                  Sign Up
                </Link>
                <Link
                  to="/register/recruiter"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
                >
                  Post a Job
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 pt-2 pb-4 space-y-2 bg-white">
          <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-gray-700">
            Browse Jobs
          </Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-gray-700">
            About Us
          </Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-gray-700">
            Contact
          </Link>
          {isAuthenticated ? (
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-brand-600">
                Dashboard ({user?.role})
              </Link>
              <button onClick={handleLogout} className="w-full text-left py-2 text-base font-medium text-red-600">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-gray-700">
                Log In
              </Link>
              <Link to="/register/candidate" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-brand-600">
                Candidate Registration
              </Link>
              <Link to="/register/recruiter" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-gray-900">
                Recruiter Registration
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
