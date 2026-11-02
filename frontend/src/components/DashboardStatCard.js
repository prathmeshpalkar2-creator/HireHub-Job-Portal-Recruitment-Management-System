import React from 'react';

export default function DashboardStatCard({ title, value, icon, change, color = "brand" }) {
  const colorMap = {
    brand: "bg-blue-50 text-brand-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100"
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900 mt-2">{value ?? 0}</p>
        {change && (
          <p className="text-xs text-gray-400 mt-1 font-medium">{change}</p>
        )}
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${colorMap[color] || colorMap.brand}`}>
        {icon || (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )}
      </div>
    </div>
  );
}
