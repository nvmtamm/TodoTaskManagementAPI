# Task Management API

A RESTful Task Management API built with ASP.NET Core, Entity Framework Core, JWT authentication, and PostgreSQL.

This project is designed as a practical learning project to understand:
- API design in ASP.NET Core
- CRUD operations with Entity Framework Core
- JWT authentication and protected endpoints
- Search, filter, and pagination patterns

## Tech Stack
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- JWT Bearer Authentication
- Swagger / OpenAPI

## Features
- User registration and login
- JWT token generation
- Protected task endpoints
- Create, read, update, and delete tasks
- Mark tasks as complete or incomplete
- Search tasks by title or description
- Filter tasks by completion status
- Pagination for task listing
- Swagger API documentation with Bearer auth

## Project Structure
- `src/TaskManagementApi`: Web API project
- `docs/phase-1-mvp.md`: Phase 1 scope document

## Prerequisites
- .NET 8 SDK
- PostgreSQL

## Configuration
Update `src/TaskManagementApi/appsettings.json`:

- `ConnectionStrings:DefaultConnection`
- `Jwt:Issuer`
- `Jwt:Audience`
- `Jwt:Key`
- `Jwt:ExpirationMinutes`

Use a long random value for `Jwt:Key` in local development.

## Run Locally
1. Restore dependencies:
	- `dotnet restore`
2. Run database migrations (after adding migrations):
	- `dotnet ef database update --project src/TaskManagementApi`
3. Start the API:
	- `dotnet run --project src/TaskManagementApi`
4. Open Swagger:
	- `https://localhost:7286/swagger`

## API Endpoints

### Health
- `GET /api/health`

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Tasks (Requires JWT)
- `GET /api/tasks?search=&isCompleted=&page=1&pageSize=10`
- `GET /api/tasks/{id}`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `PATCH /api/tasks/{id}/complete`
- `PATCH /api/tasks/{id}/incomplete`
- `DELETE /api/tasks/{id}`

## Auth Flow
1. Register a user with `POST /api/auth/register`
2. Login using `POST /api/auth/login`
3. Copy the returned JWT token
4. In Swagger, click **Authorize** and enter `Bearer <token>`
5. Call protected task endpoints

## Status
Implemented:
- Core project scaffold
- Data models and `DbContext`
- JWT authentication wiring
- Auth endpoints
- Task CRUD with query capabilities
- Swagger Bearer setup

Planned next improvements:
- Add EF Core migrations to repository
- Add global exception handling middleware
- Add endpoint validation and integration tests
