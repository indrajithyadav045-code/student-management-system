import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { DEPARTMENTS, YEARS_OF_STUDY } from '../data/initialStudents';

export default function SearchFilter({
  searchTerm,
  setSearchTerm,
  selectedDept,
  setSelectedDept,
  selectedYear,
  setSelectedYear,
  onResetFilters,
  totalResults,
  totalStudents
}) {
  const hasActiveFilters = Boolean(searchTerm.trim() || selectedDept || selectedYear);

  return (
    <div className="card filter-card">
      <div className="filter-row">
        {/* Search Input Box */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, register number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              title="Clear search text"
              aria-label="Clear search text"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="filter-controls">
          {/* Department Filter */}
          <select
            className="filter-select"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            aria-label="Filter by department"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Academic Year Filter */}
          <select
            className="filter-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            aria-label="Filter by academic year"
          >
            <option value="">All Academic Years</option>
            {YEARS_OF_STUDY.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onResetFilters}
              title="Reset all filters to default"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Summary & Active Tags */}
      <div className="filter-summary">
        <div>
          Showing <strong>{totalResults}</strong> of <strong>{totalStudents}</strong> student records
        </div>

        {hasActiveFilters && (
          <div className="active-filter-tags">
            {searchTerm.trim() && (
              <span className="filter-tag">
                Query: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} aria-label="Remove search filter">
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedDept && (
              <span className="filter-tag">
                Dept: {selectedDept}
                <button onClick={() => setSelectedDept('')} aria-label="Remove department filter">
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedYear && (
              <span className="filter-tag">
                Year: {selectedYear}
                <button onClick={() => setSelectedYear('')} aria-label="Remove year filter">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
