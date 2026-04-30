# React + Vite Frontend

This is the frontend for the Task Management API built with React and Vite.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` from `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Architecture

- `src/main.jsx` - App entry point
- `src/App.jsx` - Root component
- `src/routes.jsx` - Route definitions
- `src/pages/` - Page components
- `src/components/` - Reusable components
- `src/services/` - API service
- `src/context/` - React context for state
