import './Pagination.css'

export default function Pagination({ page, pageSize, totalCount, onPageChange }) {
  const totalPages = Math.ceil(totalCount / pageSize)

  if (totalPages <= 1) return null

  return (
    <nav className="pagination" aria-label="Pagination Navigation">
      <button
        className="pagination-btn pagination-prev"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        ← Previous
      </button>

      <div className="pagination-numbers">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            className={`pagination-number ${page === p ? 'active' : ''}`}
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={page === p ? 'page' : undefined}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        className="pagination-btn pagination-next"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        Next →
      </button>

      <div className="pagination-info">
        Page <span className="page-current">{page}</span> of <span className="page-total">{totalPages}</span>
      </div>
    </nav>
  )
}
