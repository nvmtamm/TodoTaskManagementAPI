import { useState } from 'react'
import './TaskForm.css'

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
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-field">
        <label>Task Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-field">
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="btn-submit"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : initialValues ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  )
}
