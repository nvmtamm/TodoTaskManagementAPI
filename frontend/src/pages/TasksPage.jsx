import { useState, useEffect } from 'react'

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setTasks(data.items || [])
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="tasks-page">
      <h1>My Tasks</h1>
      {tasks.length === 0 ? (
        <p>No tasks yet. Create one to get started!</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span>{task.isCompleted ? '✓ Completed' : 'Pending'}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
