import { useState, useEffect } from 'react'
import { apiService } from '../services/apiService'
import TaskForm from '../components/TaskForm'
import TaskFilters from '../components/TaskFilters'
import Pagination from '../components/Pagination'
import './TasksPage.css'

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    fetchTasks()
  }, [searchQuery, filterStatus, page])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const params = { page, pageSize }
      if (searchQuery) params.search = searchQuery
      if (filterStatus !== '') params.isCompleted = filterStatus === 'true'

      const data = await apiService.getTasks(params)
      setTasks(data.items || [])
      setTotalCount(data.totalCount || 0)
    } catch (err) {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (formData) => {
    try {
      const newTask = await apiService.createTask(formData)
      setTasks([newTask, ...tasks])
      setShowForm(false)
    } catch (err) {
      setError('Failed to create task')
    }
  }

  const handleUpdateTask = async (id, formData) => {
    try {
      const updated = await apiService.updateTask(id, formData)
      setTasks(tasks.map((task) => (task.id === id ? updated : task)))
      setEditingId(null)
    } catch (err) {
      setError('Failed to update task')
    }
  }

  const handleDeleteTask = async (id) => {
    try {
      await apiService.deleteTask(id)
      setTasks(tasks.filter((task) => task.id !== id))
    } catch (err) {
      setError('Failed to delete task')
    }
  }

  const handleToggleComplete = async (id, isCompleted) => {
    try {
      const updated = isCompleted
        ? await apiService.incompleteTask(id)
        : await apiService.completeTask(id)

      setTasks(tasks.map((task) => (task.id === id ? updated : task)))
    } catch (err) {
      setError('Failed to update task status')
    }
  }

  const handleSearchChange = (value) => {
    setSearchQuery(value)
    setPage(1)
  }

  const handleFilterChange = (value) => {
    setFilterStatus(value)
    setPage(1)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  if (loading) {
    return (
      <div className="tasks-page">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #e0e0e0',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          <p style={{ marginTop: '1rem' }}>Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <h1>My Tasks</h1>
        {!showForm && !editingId && (
          <button className="btn-new" onClick={() => setShowForm(true)}>
            + New Task
          </button>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      <TaskFilters
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        searchValue={searchQuery}
        filterValue={filterStatus}
      />

      {(showForm || editingId) && (
        <>
          <TaskForm
            onSubmit={
              editingId ? (data) => handleUpdateTask(editingId, data) : handleCreateTask
            }
            initialValues={editingId ? tasks.find((task) => task.id === editingId) : null}
          />
          <button
            onClick={() => {
              setShowForm(false)
              setEditingId(null)
            }}
            style={{
              marginBottom: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(event) => {
              event.target.style.backgroundColor = '#7f8c8d'
            }}
            onMouseLeave={(event) => {
              event.target.style.backgroundColor = '#95a5a6'
            }}
          >
            Cancel
          </button>
        </>
      )}

      {tasks.length === 0 ? (
        <div className="tasks-empty">
          <p>No tasks yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`task-card ${task.isCompleted ? 'completed' : 'pending'}`}
            >
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
              </div>

              {task.description && <p className="task-description">{task.description}</p>}

              <span
                className={`task-badge ${task.isCompleted ? 'completed' : 'pending'}`}
                onClick={() => handleToggleComplete(task.id, task.isCompleted)}
                title="Click to toggle status"
              >
                {task.isCompleted ? '✓ Completed' : 'Pending'}
              </span>

              <div className="task-actions">
                <button className="task-btn edit" onClick={() => setEditingId(task.id)}>
                  Edit
                </button>
                <button className="task-btn delete" onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
