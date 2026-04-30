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
      setTasks(tasks.map(t => t.id === id ? updated : t))
      setEditingId(null)
    } catch (err) {
      setError('Failed to update task')
    }
  }

  const handleDeleteTask = async (id) => {
    try {
      await apiService.deleteTask(id)
      setTasks(tasks.filter(t => t.id !== id))
    } catch (err) {
      setError('Failed to delete task')
    }
  }

  const handleToggleComplete = async (id, isCompleted) => {
    try {
      if (isCompleted) {
        const updated = await apiService.incompleteTask(id)
        setTasks(tasks.map(t => t.id === id ? updated : t))
      } else {
        const updated = await apiService.completeTask(id)
        setTasks(tasks.map(t => t.id === id ? updated : t))
      }
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

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{
        display: 'inline-block',
        width: '40px',
        height: '40px',
        border: '4px solid #e0e0e0',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ marginTop: '1rem' }}>Loading tasks...</p>
    </div>
  )

  return (
    <div className="tasks-page">
      <h1>My Tasks</h1>
      
      {error && (
        <div style={{
          color: '#c0392b',
          backgroundColor: '#fadbd8',
          border: '1px solid #e74c3c',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <TaskFilters
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        searchValue={searchQuery}
        filterValue={filterStatus}
      />
      
      {!showForm && !editingId && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#229954'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#27ae60'}
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
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#7f8c8d'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#95a5a6'}
          >
            Cancel
          </button>
        </>
      )}

      {tasks.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          backgroundColor: 'white',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: '1.1rem', color: '#7f8c8d' }}>
            No tasks yet. Create one to get started!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'box-shadow 0.3s, transform 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: task.isCompleted ? '#27ae60' : '#e67e22',
                      color: 'white',
                      borderRadius: '4px',
                      marginTop: '0.5rem',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'opacity 0.3s'
                    }}
                    onClick={() => handleToggleComplete(task.id, task.isCompleted)}
                    onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                    title="Click to toggle status"
                  >
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
                      cursor: 'pointer',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
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
                      cursor: 'pointer',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
                  >
                    Delete
                  </button>
                </div>
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
