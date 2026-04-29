# Phase 1 - MVP Scope

## Goal
Build a small but realistic RESTful Task Management API that teaches the essentials of:
- ASP.NET Core Web API
- CRUD endpoints
- Database access with Entity Framework Core
- Basic authentication with JWT
- Common API patterns such as search, filter, and pagination

## Recommended Tech Stack
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- JWT Bearer Authentication
- Swagger / OpenAPI

## MVP Features
### Authentication
- User registration
- User login
- JWT token generation
- Password hashing

### Task Management
- Create task
- Read task list
- Read task details
- Update task
- Delete task
- Mark task as complete
- Mark task as incomplete

### Query Features
- Search tasks by title or description
- Filter by completion status
- Pagination for task list

### Documentation
- Swagger API docs
- English README with setup and usage instructions

## Core Rules
- A user can only access their own tasks
- Tasks belong to exactly one user
- Authentication is required for all task endpoints
- Registration and login are public endpoints

## Out of Scope for MVP
- Refresh tokens
- Role-based authorization
- File attachments
- Real-time notifications
- Complex recurring tasks
- Soft delete
- Multi-tenant support

## Suggested First Implementation Order
1. Create the ASP.NET Core Web API project
2. Add EF Core and configure PostgreSQL
3. Create User and Task entities
4. Add authentication endpoints
5. Add task CRUD endpoints
6. Add search, filter, and pagination
7. Add Swagger documentation
8. Write the English README

## Definition of Done for Phase 1
- Scope is fixed
- Tech stack is chosen
- Feature list is clear
- Implementation order is defined
