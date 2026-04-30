const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7286'

export const apiService = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token')
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  },

  getTasks(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/api/tasks${query ? '?' + query : ''}`)
  },

  getTask(id) {
    return this.request(`/api/tasks/${id}`)
  },

  createTask(data) {
    return this.request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  updateTask(id, data) {
    return this.request(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  completeTask(id) {
    return this.request(`/api/tasks/${id}/complete`, {
      method: 'PATCH'
    })
  },

  incompleteTask(id) {
    return this.request(`/api/tasks/${id}/incomplete`, {
      method: 'PATCH'
    })
  },

  deleteTask(id) {
    return this.request(`/api/tasks/${id}`, {
      method: 'DELETE'
    })
  }
}
