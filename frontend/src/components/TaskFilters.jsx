import './TaskFilters.css'

export default function TaskFilters({ onSearchChange, onFilterChange, searchValue, filterValue }) {
  return (
    <div className="task-filters">
      <div className="filter-search">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          placeholder="Search tasks..."
          className="filter-input"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <select
        className="filter-select"
        value={filterValue}
        onChange={(e) => onFilterChange(e.target.value)}
      >
        <option value="">All Tasks</option>
        <option value="true">Completed</option>
        <option value="false">Pending</option>
      </select>
    </div>
  )
}
