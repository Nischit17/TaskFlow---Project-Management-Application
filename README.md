# TaskFlow - Project Management Application

TaskFlow is a collaborative project management tool that helps teams organize their work efficiently. It provides features for managing projects, tasks, and team collaboration.

## Features

- 🔐 User Authentication

  - Secure registration and login
  - JWT-based authentication
  - Role-based access control

- 📊 Project Management

  - Create, read, update, and delete projects
  - Assign team members to projects
  - Track project status and progress

- ✅ Task Management

  - Create, read, update, and delete tasks
  - Assign tasks to team members
  - Set task priorities and due dates
  - Track task status

- 📈 Dashboard
  - Overview of projects and tasks
  - Task statistics
  - Filter and search functionality

## Tech Stack

- **Frontend:**

  - React.js
  - React Router
  - Redux Toolkit for state management
  - Material-UI for styling

- **Backend:**
  - Express.js
  - PostgreSQL
  - Sequelize ORM
  - JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:

   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=taskflow
   JWT_SECRET=your_jwt_secret
   ```

4. Create the database:

   ```bash
   createdb taskflow
   ```

5. Run migrations:

   ```bash
   npm run migrate
   ```

6. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory:

   ```
   VITE_API_URL=http://localhost:5001/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication Endpoints

#### Register User

- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```

#### Login

- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```

### Project Endpoints

#### Create Project

- **POST** `/api/projects`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "title": "Project Title",
    "description": "Project Description",
    "dueDate": "2024-12-31"
  }
  ```

#### Get All Projects

- **GET** `/api/projects`
- **Headers:** `Authorization: Bearer <token>`

#### Get Project by ID

- **GET** `/api/projects/:id`
- **Headers:** `Authorization: Bearer <token>`

#### Update Project

- **PUT** `/api/projects/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "title": "Updated Title",
    "description": "Updated Description",
    "status": "completed"
  }
  ```

#### Delete Project

- **DELETE** `/api/projects/:id`
- **Headers:** `Authorization: Bearer <token>`

### Task Endpoints

#### Create Task

- **POST** `/api/tasks`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "title": "Task Title",
    "description": "Task Description",
    "projectId": "project-uuid",
    "assignedTo": "user-uuid",
    "priority": "high",
    "dueDate": "2024-12-31"
  }
  ```

#### Get All Tasks

- **GET** `/api/tasks`
- **Headers:** `Authorization: Bearer <token>`

#### Get Task by ID

- **GET** `/api/tasks/:id`
- **Headers:** `Authorization: Bearer <token>`

#### Update Task

- **PUT** `/api/tasks/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "title": "Updated Title",
    "description": "Updated Description",
    "status": "completed",
    "priority": "medium"
  }
  ```

#### Delete Task

- **DELETE** `/api/tasks/:id`
- **Headers:** `Authorization: Bearer <token>`

## Database Schema

<!-- ![Database Schema Diagram](docs/database-schema.png) -->

### Tables

1. **Users**

   - id (UUID, PK)
   - name (STRING)
   - email (STRING, UNIQUE)
   - password (STRING)
   - role (ENUM: user, admin)

2. **Projects**

   - id (UUID, PK)
   - title (STRING)
   - description (TEXT)
   - dueDate (DATE)
   - status (ENUM: active, completed, on_hold)
   - createdBy (UUID, FK)

3. **Tasks**

   - id (UUID, PK)
   - title (STRING)
   - description (TEXT)
   - dueDate (DATE)
   - priority (ENUM: low, medium, high)
   - status (ENUM: todo, in_progress, completed)
   - projectId (UUID, FK)
   - assignedTo (UUID, FK)
   - createdBy (UUID, FK)

4. **ProjectUsers**
   - id (UUID, PK)
   - projectId (UUID, FK)
   - userId (UUID, FK)
   - role (ENUM: member, admin)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add some NewFeature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request
