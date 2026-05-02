const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

async function readResponseBody(response) {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') || ''

  if (!contentType.includes('application/json')) {
    return null
  }

  return response.json()
}

function getErrorMessage(status, body) {
  if (body?.message) {
    return body.message
  }

  if (body?.title) {
    return body.title
  }

  return `API request failed with status ${status}`
}

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

    const body = await readResponseBody(response)

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }

      throw new Error(getErrorMessage(response.status, body))
    }

    return body
  },

  login(data) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  register(data) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    })
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
