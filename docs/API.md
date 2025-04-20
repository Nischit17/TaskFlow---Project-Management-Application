# TaskFlow API Documentation

## Base URL

```
http://localhost:5001/api
```

## Authentication

All endpoints except authentication endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Authentication Endpoints

#### Register User

Register a new user account.

- **URL:** `/auth/register`
- **Method:** `POST`
- **Auth required:** No
- **Data constraints:**
  ```json
  {
    "name": "[string]",
    "email": "[valid email]",
    "password": "[min 6 characters]"
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "token": "jwt_token"
    }
    ```
- **Error Response:**
  - **Code:** 400
  - **Content:**
    ```json
    {
      "message": "Email already exists"
    }
    ```

#### Login

Authenticate a user and receive a JWT token.

- **URL:** `/auth/login`
- **Method:** `POST`
- **Auth required:** No
- **Data constraints:**
  ```json
  {
    "email": "[valid email]",
    "password": "[string]"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "token": "jwt_token"
    }
    ```
- **Error Response:**
  - **Code:** 401
  - **Content:**
    ```json
    {
      "message": "Invalid credentials"
    }
    ```

### Project Endpoints

#### Create Project

Create a new project.

- **URL:** `/projects`
- **Method:** `POST`
- **Auth required:** Yes
- **Data constraints:**
  ```json
  {
    "title": "[string]",
    "description": "[string]",
    "dueDate": "[ISO date string]"
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "id": "uuid",
      "title": "Project Title",
      "description": "Project Description",
      "dueDate": "2024-12-31",
      "status": "active",
      "createdBy": "user_uuid"
    }
    ```

#### Get All Projects

Retrieve all projects for the authenticated user.

- **URL:** `/projects`
- **Method:** `GET`
- **Auth required:** Yes
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    [
      {
        "id": "uuid",
        "title": "Project Title",
        "description": "Project Description",
        "dueDate": "2024-12-31",
        "status": "active",
        "createdBy": "user_uuid",
        "members": [
          {
            "id": "user_uuid",
            "name": "John Doe",
            "role": "member"
          }
        ]
      }
    ]
    ```

#### Get Project by ID

Retrieve a specific project by ID.

- **URL:** `/projects/:id`
- **Method:** `GET`
- **Auth required:** Yes
- **URL Params:** `id=[uuid]`
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "id": "uuid",
      "title": "Project Title",
      "description": "Project Description",
      "dueDate": "2024-12-31",
      "status": "active",
      "createdBy": "user_uuid",
      "members": [
        {
          "id": "user_uuid",
          "name": "John Doe",
          "role": "member"
        }
      ],
      "tasks": [
        {
          "id": "task_uuid",
          "title": "Task Title",
          "status": "todo",
          "priority": "high"
        }
      ]
    }
    ```

#### Update Project

Update a project's details.

- **URL:** `/projects/:id`
- **Method:** `PUT`
- **Auth required:** Yes
- **URL Params:** `id=[uuid]`
- **Data constraints:**
  ```json
  {
    "title": "[string]",
    "description": "[string]",
    "dueDate": "[ISO date string]",
    "status": "[active|completed|on_hold]"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "id": "uuid",
      "title": "Updated Title",
      "description": "Updated Description",
      "dueDate": "2024-12-31",
      "status": "completed"
    }
    ```

#### Delete Project

Delete a project.

- **URL:** `/projects/:id`
- **Method:** `DELETE`
- **Auth required:** Yes
- **URL Params:** `id=[uuid]`
- **Success Response:**
  - **Code:** 204
  - **Content:** None

### Task Endpoints

#### Create Task

Create a new task.

- **URL:** `/tasks`
- **Method:** `POST`
- **Auth required:** Yes
- **Data constraints:**
  ```json
  {
    "title": "[string]",
    "description": "[string]",
    "projectId": "[uuid]",
    "assignedTo": "[uuid]",
    "priority": "[low|medium|high]",
    "dueDate": "[ISO date string]"
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:**
    ```json
    {
      "id": "uuid",
      "title": "Task Title",
      "description": "Task Description",
      "projectId": "project_uuid",
      "assignedTo": "user_uuid",
      "priority": "high",
      "status": "todo",
      "dueDate": "2024-12-31"
    }
    ```

#### Get All Tasks

Retrieve all tasks for the authenticated user.

- **URL:** `/tasks`
- **Method:** `GET`
- **Auth required:** Yes
- **Query Params:**
  - `status=[todo|in_progress|completed]`
  - `priority=[low|medium|high]`
  - `projectId=[uuid]`
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    [
      {
        "id": "uuid",
        "title": "Task Title",
        "description": "Task Description",
        "projectId": "project_uuid",
        "assignedTo": "user_uuid",
        "priority": "high",
        "status": "todo",
        "dueDate": "2024-12-31"
      }
    ]
    ```

#### Get Task by ID

Retrieve a specific task by ID.

- **URL:** `/tasks/:id`
- **Method:** `GET`
- **Auth required:** Yes
- **URL Params:** `id=[uuid]`
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "id": "uuid",
      "title": "Task Title",
      "description": "Task Description",
      "projectId": "project_uuid",
      "assignedTo": "user_uuid",
      "priority": "high",
      "status": "todo",
      "dueDate": "2024-12-31",
      "project": {
        "id": "project_uuid",
        "title": "Project Title"
      },
      "assignee": {
        "id": "user_uuid",
        "name": "John Doe"
      }
    }
    ```

#### Update Task

Update a task's details.

- **URL:** `/tasks/:id`
- **Method:** `PUT`
- **Auth required:** Yes
- **URL Params:** `id=[uuid]`
- **Data constraints:**
  ```json
  {
    "title": "[string]",
    "description": "[string]",
    "priority": "[low|medium|high]",
    "status": "[todo|in_progress|completed]",
    "dueDate": "[ISO date string]",
    "assignedTo": "[uuid]"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "id": "uuid",
      "title": "Updated Title",
      "description": "Updated Description",
      "priority": "medium",
      "status": "in_progress",
      "dueDate": "2024-12-31",
      "assignedTo": "user_uuid"
    }
    ```

#### Delete Task

Delete a task.

- **URL:** `/tasks/:id`
- **Method:** `DELETE`
- **Auth required:** Yes
- **URL Params:** `id=[uuid]`
- **Success Response:**
  - **Code:** 204
  - **Content:** None

### User Endpoints

#### Get User Profile

Retrieve the authenticated user's profile.

- **URL:** `/users/profile`
- **Method:** `GET`
- **Auth required:** Yes
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdProjects": [
        {
          "id": "project_uuid",
          "title": "Project Title"
        }
      ],
      "assignedTasks": [
        {
          "id": "task_uuid",
          "title": "Task Title",
          "status": "todo"
        }
      ]
    }
    ```

#### Update User Profile

Update the authenticated user's profile.

- **URL:** `/users/profile`
- **Method:** `PUT`
- **Auth required:** Yes
- **Data constraints:**
  ```json
  {
    "name": "[string]",
    "password": "[string]"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "id": "uuid",
      "name": "Updated Name",
      "email": "john@example.com",
      "role": "user"
    }
    ```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "message": "Authentication required"
}
```

### 403 Forbidden

```json
{
  "message": "You don't have permission to perform this action"
}
```

### 404 Not Found

```json
{
  "message": "Resource not found"
}
```

### 500 Server Error

```json
{
  "message": "Internal server error"
}
```
