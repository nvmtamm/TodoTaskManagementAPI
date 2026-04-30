import { useState } from 'react'

export default function TaskForm({ onSubmit, initialValues = null, isLoading = false }) {
  const [title, setTitle] = useState(initialValues?.title || '')
  const [description, setDescription] = useState(initialValues?.description || '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit({ title, description })
    setTitle('')
    setDescription('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#ecf0f1', borderRadius: '4px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>Task Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', minHeight: '100px' }}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {isLoading ? 'Saving...' : initialValues ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  )
}
