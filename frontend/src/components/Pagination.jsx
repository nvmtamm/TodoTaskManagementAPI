export default function Pagination({ page, pageSize, totalCount, onPageChange }) {
  const totalPages = Math.ceil(totalCount / pageSize)

  if (totalPages <= 1) return null

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
      marginTop: '2rem',
      padding: '1rem',
      backgroundColor: 'white',
      borderRadius: '4px'
    }}>
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: page === 1 ? '#ecf0f1' : '#3498db',
          color: page === 1 ? '#bdc3c7' : 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: page === 1 ? 'not-allowed' : 'pointer'
        }}
      >
        Previous
      </button>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: page === p ? '#2c3e50' : '#ecf0f1',
              color: page === p ? 'white' : '#2c3e50',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: page === p ? 'bold' : 'normal'
            }}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: page === totalPages ? '#ecf0f1' : '#3498db',
          color: page === totalPages ? '#bdc3c7' : 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: page === totalPages ? 'not-allowed' : 'pointer'
        }}
      >
        Next
      </button>

      <span style={{ marginLeft: '1rem', color: '#7f8c8d' }}>
        Page {page} of {totalPages}
      </span>
    </div>
  )
}
