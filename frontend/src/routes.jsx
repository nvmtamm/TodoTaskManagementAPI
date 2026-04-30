import { Routes as RRoutes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TasksPage from './pages/TasksPage'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

export default function Routes() {
  const isAuthenticated = !!localStorage.getItem('token')

  return (
    <RRoutes>
      <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
      <Route path="/tasks" element={isAuthenticated ? <MainLayout><TasksPage /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="*" element={<Navigate to="/" />} />
    </RRoutes>
  )
}
