import React from 'react';
import { 
  Users, 
  Building2, 
  GraduationCap, 
  UserPlus, 
  ArrowRight, 
  Calendar, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { DEPARTMENTS } from '../data/initialStudents';

export default function Dashboard({
  students,
  onNavigateToStudents,
  onOpenRegisterModal,
  onViewStudent
}) {
  // 1. Total Registered Students
  const totalStudents = students.length;

  // 2. Total Departments
  const uniqueDepartments = new Set(students.map((s) => s.department).filter(Boolean));
  const totalDepartments = uniqueDepartments.size || DEPARTMENTS.length;

  // 3. First-Year Students
  const firstYearStudents = students.filter(
    (s) => s.yearOfStudy && s.yearOfStudy.toLowerCase().includes('1st')
  ).length;

  // 4. Latest Registrations (sorted by createdAt or reverse insertion)
  const latestStudents = [...students]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  // Department distribution
  const deptCounts = DEPARTMENTS.map((dept) => {
    const count = students.filter((s) => s.department === dept).length;
    const percentage = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
    return { name: dept, count, percentage };
  }).sort((a, b) => b.count - a.count);

  const getInitials = (name) => {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <div className="banner-badge">
            <Sparkles size={14} />
            <span>Academic Management Suite</span>
          </div>
          <h1>Welcome to EduAdmin Dashboard</h1>
          <p>
            Seamlessly monitor admissions, manage student dossiers, maintain institutional records, and analyze departmental enrollment across academic years.
          </p>
        </div>

        <div className="banner-actions">
          <button 
            className="btn btn-white"
            onClick={onOpenRegisterModal}
          >
            <UserPlus size={18} />
            <span>Enroll Student</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Statistics Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Registered Students"
          value={totalStudents}
          icon={Users}
          trend="+100%"
          trendLabel="Active enrollment"
          iconBg="#eef2ff"
          iconColor="#4f46e5"
        />

        <StatCard
          title="Academic Departments"
          value={totalDepartments}
          icon={Building2}
          trend="7 Active"
          trendLabel="Engineering & Sciences"
          iconBg="#ecfdf5"
          iconColor="#059669"
        />

        <StatCard
          title="First-Year Students"
          value={firstYearStudents}
          icon={GraduationCap}
          trend={`${totalStudents > 0 ? Math.round((firstYearStudents / totalStudents) * 100) : 0}%`}
          trendLabel="Freshman cohort"
          iconBg="#eff6ff"
          iconColor="#0284c7"
        />

        <StatCard
          title="Latest Registrations"
          value={latestStudents.length}
          icon={Clock}
          trend="Real-time"
          trendLabel="Recent admissions"
          iconBg="#faf5ff"
          iconColor="#7e22ce"
        />
      </div>

      {/* Main Content Grid: Recent Students (Left) & Department Distribution (Right) */}
      <div className="dashboard-grid">
        {/* Recent Students Section */}
        <div className="card section-card">
          <div className="section-header">
            <div>
              <h2>
                <Clock size={20} color="#4f46e5" />
                <span>Recent Registrations</span>
              </h2>
              <p>Most recently enrolled students in the university records</p>
            </div>
            <button
              className="btn btn-ghost"
              style={{ fontSize: '0.8125rem' }}
              onClick={onNavigateToStudents}
            >
              <span>View All</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="recent-students-list">
            {latestStudents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                No registered students found yet. Click Enroll Student to get started.
              </div>
            ) : (
              latestStudents.map((student) => (
                <div key={student.id} className="recent-student-item">
                  <div className="student-meta-left">
                    <div 
                      className="student-avatar" 
                      style={{ backgroundColor: student.avatarBg || '#4f46e5' }}
                    >
                      {getInitials(student.fullName)}
                    </div>
                    <div className="student-info-text">
                      <h4>{student.fullName}</h4>
                      <p>{student.registerNumber} • {student.department}</p>
                    </div>
                  </div>

                  <div className="student-meta-right">
                    <span className="badge badge-year-1">{student.yearOfStudy}</span>
                    <button
                      className="btn btn-secondary btn-icon"
                      style={{ width: '32px', height: '32px' }}
                      onClick={() => onViewStudent(student)}
                      title="View Student"
                      aria-label={`View ${student.fullName}`}
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Action Prompt */}
          <div className="quick-action-box">
            <div>
              <h4>Need to register a transfer or new student?</h4>
              <p>Use our validated registration workflow to assign register numbers instantly.</p>
            </div>
            <button className="btn btn-primary" onClick={onOpenRegisterModal}>
              <UserPlus size={16} />
              <span>Register Now</span>
            </button>
          </div>
        </div>

        {/* Department Enrollment Breakdown */}
        <div className="card section-card">
          <div className="section-header">
            <div>
              <h2>
                <Building2 size={20} color="#059669" />
                <span>Department Distribution</span>
              </h2>
              <p>Student share across academic departments</p>
            </div>
          </div>

          <div className="dept-stat-list">
            {deptCounts.slice(0, 6).map((item) => (
              <div key={item.name} className="dept-stat-item">
                <div className="dept-stat-labels">
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{item.name}</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>
                    {item.count} <span style={{ color: '#94a3b8', fontWeight: 400 }}>({item.percentage}%)</span>
                  </span>
                </div>
                <div className="dept-progress-bar">
                  <div 
                    className="dept-progress-fill" 
                    style={{ width: `${Math.max(item.percentage, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#64748b' }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>All student records verified in LocalStorage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
