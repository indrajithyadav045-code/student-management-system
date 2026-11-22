import React from 'react';
import { Menu, Calendar } from 'lucide-react';
import { getAcademicYearInfo } from '../utils/helpers';

export default function Header({ 
  activeTab, 
  onToggleMobileSidebar
}) {
  const academicYearInfo = getAcademicYearInfo();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="app-header">
      <div className="header-left">
        {/* Mobile Hamburger */}
        <button 
          className="header-toggle-btn"
          onClick={onToggleMobileSidebar}
          aria-label="Open sidebar navigation"
        >
          <Menu size={22} />
        </button>

        <div className="header-breadcrumbs">
          <span className="breadcrumb-root">Portal</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">
            {activeTab === 'dashboard' ? 'Overview' : 'Students'}
          </span>
        </div>
      </div>

      <div className="header-right">
        {/* Academic Session & Date */}
        <div className="header-date-badge">
          <Calendar size={15} />
          <span>{today}</span>
        </div>

        {/* Dynamic Academic Year Tag */}
        <div className="header-chip">
          <span className="chip-dot"></span>
          <span>{academicYearInfo.tag}</span>
        </div>

        {/* Admin Profile */}
        <div className="header-profile">
          <div className="profile-avatar">
            <span>AD</span>
          </div>
          <div className="profile-meta">
            <span className="profile-name">Admin Office</span>
            <span className="profile-role">Registrar Dept</span>
          </div>
        </div>
      </div>
    </header>
  );
}
