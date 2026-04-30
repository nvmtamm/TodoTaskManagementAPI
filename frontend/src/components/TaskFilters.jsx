export default function TaskFilters({ onSearchChange, onFilterChange, searchValue, filterValue }) {
  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      marginBottom: '1rem',
      padding: '1rem',
      backgroundColor: 'white',
      borderRadius: '4px',
      flexWrap: 'wrap'
    }}>
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          flex: 1,
          minWidth: '200px',
          padding: '0.5rem',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      />
      <select
        value={filterValue}
        onChange={(e) => onFilterChange(e.target.value)}
        style={{
          padding: '0.5rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: 'white'
        }}
      >
        <option value="">All Tasks</option>
        <option value="true">Completed</option>
        <option value="false">Pending</option>
      </select>
    </div>
  )
}
