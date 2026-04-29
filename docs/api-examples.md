# API Examples

## Register

POST /api/auth/register

```json
{
  "fullName": "Minh Tam",
  "email": "nvmtamm@gmail.com",
  "password": "Password123!"
}
```

## Login

POST /api/auth/login

```json
{
  "email": "nvmtamm@gmail.com",
  "password": "Password123!"
}
```

## Create Task (Bearer token required)

POST /api/tasks

```json
{
  "title": "Finish Task API",
  "description": "Implement authentication and CRUD"
}
```

## Query Tasks with filter and pagination

GET /api/tasks?search=task&isCompleted=false&page=1&pageSize=10

## Mark Complete

PATCH /api/tasks/{id}/complete

## Mark Incomplete

PATCH /api/tasks/{id}/incomplete
