import React from 'react';

export default function StatCard({ 
  title, 
  value, 
  icon: IconComponent, 
  trend, 
  trendLabel, 
  subtitle,
  iconBg = '#eef2ff', 
  iconColor = '#4f46e5' 
}) {
  return (
    <div className="card stat-card">
      <div className="stat-card-header">
        <div className="stat-info">
          <span className="stat-title">{title}</span>
          <span className="stat-value">{value}</span>
        </div>
        <div 
          className="stat-icon-wrapper" 
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          {IconComponent && <IconComponent size={24} />}
        </div>
      </div>

      <div className="stat-footer">
        {trend && (
          <span className="stat-trend">
            {trend}
          </span>
        )}
        <span>{trendLabel || subtitle || 'Updated live from records'}</span>
      </div>
    </div>
  );
}
