import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  GraduationCap, 
  X, 
  Building2, 
  ShieldCheck 
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onOpenRegisterModal, 
  studentCount = 0,
  isMobileOpen,
  setIsMobileOpen
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'students',
      label: 'Student Directory',
      icon: Users,
      badge: studentCount
    }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="sidebar-mobile-backdrop"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo-box">
            <GraduationCap size={24} className="brand-icon" />
          </div>
          <div className="brand-text">
            <h3>EduAdmin</h3>
            <span>University Portal</span>
          </div>

          {/* Mobile Close Button */}
          <button 
            className="mobile-close-btn"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Action */}
        <div className="sidebar-action-wrap">
          <button 
            className="btn btn-primary sidebar-register-btn"
            onClick={() => {
              onOpenRegisterModal();
              if (setIsMobileOpen) setIsMobileOpen(false);
            }}
          >
            <UserPlus size={18} />
            <span>New Student</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">Main Navigation</div>
          <ul className="nav-list">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <IconComponent size={20} className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                    {item.badge !== null && (
                      <span className={`nav-badge ${isActive ? 'active-badge' : ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="nav-section-title" style={{ marginTop: '28px' }}>
            Academic Info
          </div>
          <div className="sidebar-info-card">
            <div className="info-card-header">
              <Building2 size={16} />
              <span>Academic Year</span>
            </div>
            <p className="info-card-sub">2024 – 2025 Semester I</p>
            <div className="info-card-badge">
              <ShieldCheck size={13} />
              <span>Accredited System</span>
            </div>
          </div>
        </nav>

        {/* Footer Admin Tag */}
        <div className="sidebar-footer">
          <div className="admin-status">
            <div className="status-dot"></div>
            <div className="status-meta">
              <p className="admin-name">Registrar Office</p>
              <p className="admin-role">System Online</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
