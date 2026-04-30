import { Link } from 'react-router-dom'
import './MainLayout.css'

export default function MainLayout({ children }) {
  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <div className="main-layout">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">Task Manager</Link>
          <ul className="nav-menu">
            <li><Link to="/tasks" className="nav-link">Tasks</Link></li>
            <li><button onClick={handleLogout} className="nav-link logout">Logout</button></li>
          </ul>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  )
}
