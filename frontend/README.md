# Task Manager Frontend

A modern React-based frontend for the Task Management API, built with Vite and React Router for a seamless user experience.

## Tech Stack

- **React** 18.2.0 - UI library for building interactive interfaces
- **Vite** 5.0.0 - Modern build tool and dev server
- **React Router DOM** 6.20.0 - Client-side routing with protected routes
- **CSS3** - Custom styling with animations and transitions

## Features

### Authentication
- User registration with email and password validation
- User login with JWT token storage
- Persistent authentication using localStorage
- Automatic logout on token expiration

### Task Management
- **Create Tasks** - Add new tasks with title and description
- **Read Tasks** - View all tasks with pagination
- **Update Tasks** - Edit existing task details
- **Delete Tasks** - Remove tasks permanently
- **Toggle Completion** - Mark tasks as complete/incomplete with clickable status badge
- **Search & Filter** - Search by title/description, filter by completion status
- **Pagination** - Navigate through tasks with page controls

### User Interface
- Responsive design that works on desktop and mobile
- Clean, intuitive layout with proper visual hierarchy
- Loading states with animated spinner
- Error messages with helpful feedback
- Hover effects and interactive elements
- Smooth animations and transitions

## Project Structure

```
frontend/
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # Root component with routing
│   ├── index.css             # Global styles
│   ├── layouts/
│   │   ├── MainLayout.jsx    # Logged-in user layout with navbar
│   │   ├── MainLayout.css    # Navbar styling
│   │   ├── AuthLayout.jsx    # Auth page layout with gradient
│   │   └── AuthLayout.css    # Auth container styling
│   ├── pages/
│   │   ├── HomePage.jsx      # Welcome page for logged-in users
│   │   ├── HomePage.css      # Home page styling
│   │   ├── LoginPage.jsx     # User login form
│   │   ├── RegisterPage.jsx  # User registration form
│   │   ├── TasksPage.jsx     # Main task management page
│   │   └── TasksPage.css     # Tasks page styling
│   ├── components/
│   │   ├── TaskForm.jsx      # Reusable form for create/update
│   │   ├── TaskFilters.jsx   # Search and status filter controls
│   │   └── Pagination.jsx    # Page navigation component
│   ├── context/
│   │   └── AuthContext.jsx   # React context for auth state
│   ├── services/
│   │   └── apiService.js     # Centralized API client with Bearer tokens
│   └── routes.jsx            # React Router configuration
├── index.html                # HTML entry point
├── vite.config.js            # Vite configuration with API proxy
├── package.json              # Dependencies and scripts
└── .gitignore               # Git ignore rules
```

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Backend API running on `https://localhost:7286`

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (optional, for custom API URL)
echo "VITE_API_URL=https://localhost:7286" > .env

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Configuration

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# API Backend URL (defaults to https://localhost:7286)
VITE_API_URL=https://localhost:7286
```

The Vite config automatically proxies `/api/*` requests to the backend URL.

### Vite Configuration

The `vite.config.js` includes:
- **Dev Server** on port 3000
- **API Proxy** routing `/api/*` to the backend
- **HTTPS** disabled for development (set to false for localhost)

## API Integration

The `apiService.js` provides these methods:

```javascript
// Authentication
apiService.login(email, password)           // Returns { token, expiresAt }
apiService.register(fullName, email, password) // Returns { token, expiresAt }

// Task CRUD
apiService.getTasks(params)                 // Returns { items: [], totalCount, page, pageSize }
apiService.getTask(id)                      // Returns task object
apiService.createTask({ title, description }) // Returns created task
apiService.updateTask(id, { title, description }) // Returns updated task
apiService.deleteTask(id)                   // Returns success message

// Task Status
apiService.completeTask(id)                 // Mark task complete
apiService.incompleteTask(id)               // Mark task incomplete
```

All requests automatically include Bearer token from localStorage.

## Component Documentation

### TaskForm
Reusable form for creating and updating tasks.

**Props:**
- `onSubmit(data)` - Called with { title, description }
- `initialValues` - Pre-populated values for edit mode

### TaskFilters
Search and filter controls for task listing.

**Props:**
- `onSearchChange(value)` - Called when search input changes
- `onFilterChange(value)` - Called when status filter changes
- `searchValue` - Current search query
- `filterValue` - Current filter status

### Pagination
Page navigation component for task lists.

**Props:**
- `page` - Current page number (1-indexed)
- `pageSize` - Items per page
- `totalCount` - Total number of items
- `onPageChange(newPage)` - Called when user navigates to new page

## Development

### Available Scripts

```bash
npm run dev      # Start development server (Ctrl+C to stop)
npm run build    # Build for production
npm run preview  # Preview production build locally
```

### Code Style

- Uses ES6+ modern JavaScript
- Functional components with hooks
- JSX for component templates
- Inline styles for quick iteration
- CSS classes for major components

## Styling

The project uses plain CSS with:
- **Color Palette**:
  - Primary: #667eea (purple)
  - Secondary: #764ba2 (dark purple)
  - Success: #27ae60 (green)
  - Warning: #e67e22 (orange)
  - Danger: #e74c3c (red)
  - Neutral: #95a5a6 (gray)

- **Global Fonts**: System font stack for performance
- **Animations**: Fade-in on page load, spin on loading
- **Responsive**: Flex layout for mobile compatibility

## Troubleshooting

### API Connection Issues
If you get CORS errors or connection refused:
1. Ensure backend is running on `https://localhost:7286`
2. Check `.env` file for correct `VITE_API_URL`
3. Verify `vite.config.js` proxy configuration

### Authentication Problems
If you can't log in:
1. Clear localStorage: `localStorage.clear()`
2. Check browser console for specific errors
3. Verify backend JWT configuration

### Build Issues
If production build fails:
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear build cache: `rm -rf dist`
3. Check Node.js version (16+ required)

## Future Enhancements

- Task categories/tags
- Task due dates and reminders
- Task priority levels
- Dark mode theme toggle
- Offline sync with service workers
- Export tasks to CSV/PDF
- Collaborative task sharing
- Real-time updates with WebSockets

## License

MIT License - See root LICENSE file for details

## Author

Created by **Nguyễn Văn Minh Tâm** (nvmtamm@gmail.com)

Part of the Todo Task Management API project - A comprehensive learning project covering backend API development, database design, authentication, and modern frontend development with React.

## Related Documentation

- [Backend README](../README.md) - API documentation and setup
- [API Endpoints](../README.md#api-endpoints) - Complete API reference
- [Architecture Overview](../phase-1-mvp.md) - Project planning document
