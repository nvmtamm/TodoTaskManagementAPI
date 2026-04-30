import { useState, useEffect } from 'react'
import { apiService } from '../services/apiService'
import TaskForm from '../components/TaskForm'
import TaskFilters from '../components/TaskFilters'

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const params = {}
      if (searchQuery) params.search = searchQuery
      if (filterStatus !== '') params.isCompleted = filterStatus === 'true'
      const data = await apiService.getTasks(params)
      setTasks(data.items || [])
    } catch (err) {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (value) => {
    setSearchQuery(value)
  }

  const handleFilterChange = (value) => {
    setFilterStatus(value)
  }

  useEffect(() => {
    fetchTasks()
  }, [searchQuery, filterStatus])

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
      setTasks(tasks.map(t => t.id === id ? updated : t))
      setEditingId(null)
    } catch (err) {
      setError('Failed to update task')
    }
  }

  const handleDeleteTask = async (id) => {
    tr<TaskFilters
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        searchValue={searchQuery}
        filterValue={filterStatus}
      />
      
      y {
      await apiService.deleteTask(id)
      setTasks(tasks.filter(t => t.id !== id))
    } catch (err) {
      setError('Failed to delete task')
    }
  }

  if (loading) return <div>Loading tasks...</div>

  return (
    <div className="tasks-page">
      <h1>My Tasks</h1>
      {error && <div style={{ color: '#e74c3c', marginBottom: '1rem' }}>{error}</div>}
      
      {!showForm && !editingId && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          + New Task
        </button>
      )}

      {(showForm || editingId) && (
        <>
          <TaskForm
            onSubmit={editingId
              ? (data) => handleUpdateTask(editingId, data)
              : handleCreateTask
            }
            initialValues={editingId ? tasks.find(t => t.id === editingId) : null}
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
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </>
      )}

      {tasks.length === 0 ? (
        <p>No tasks yet. Create one to get started!</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: task.isCompleted ? '#27ae60' : '#e67e22',
                    color: 'white',
                    borderRadius: '4px',
                    marginTop: '0.5rem'
                  }}>
                    {task.isCompleted ? '✓ Completed' : 'Pending'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setEditingId(task.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
