# 🔧 Helpdesk Ticket System – Backend

> RESTful API with 3-layer clean architecture for helpdesk ticket management

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Jest](https://img.shields.io/badge/Jest-29.7-red.svg)](https://jestjs.io/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [Configuration](#-configuration)
- [Deployment](#-deployment)

---

## 🌟 Overview

A clean and maintainable **Node.js (JavaScript)** backend that follows **3-Layer Architecture** principles. This backend provides a simple and extensible REST API for the Helpdesk Ticket Management System.

### Key Principles

✅ **Separation of Concerns** – Each layer has a single responsibility  
✅ **Replaceable Datastore** – Repository pattern allows easy storage swapping  
✅ **Framework-Isolated Domain** – Business rules independent of Express  
✅ **Clean Structure** – Easy to test, scale, and maintain  
✅ **No Delete Operations** – Tickets are never deleted (per requirements)

---

## 🏗️ Architecture

### 3-Layer Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Presentation Layer                   │
│  • Express Routes & Controllers                      │
│  • HTTP Request/Response handling                    │
│  • Input Validation                                  │
│  • Error mapping to HTTP status codes               │
│                                                       │
│  📁 src/api/                                         │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│                 Application Layer                    │
│  • Business Logic & Use Cases                        │
│  • Status Transition Rules                           │
│  • Ticket Creation with defaults                     │
│  • Filtering, Sorting, Pagination logic              │
│                                                       │
│  📁 src/application/                                 │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│                 Persistence Layer                    │
│  • Repository Pattern                                │
│  • Data Access Operations                            │
│  • Datastore Abstraction                             │
│  • No Business Logic                                 │
│                                                       │
│  📁 src/infrastructure/                              │
└────────────────────┬────────────────────────────────┘
                     │
              ┌──────▼──────┐
              │  Datastore  │
              │  (Memory /  │
              │   File)     │
              └─────────────┘
```

### Layer Responsibilities

| Layer | What It Does | What It Doesn't Do |
|-------|--------------|-------------------|
| **Presentation** | • Handle HTTP requests<br>• Parse params/query/body<br>• Return HTTP responses<br>• Map errors to status codes | • Business logic<br>• Data access<br>• Domain rules |
| **Application** | • Execute use cases<br>• Validate business rules<br>• Coordinate between layers<br>• Process filters/sorting | • HTTP handling<br>• Direct database access<br>• Framework dependencies |
| **Persistence** | • CRUD operations<br>• Query data<br>• Manage storage | • Business rules<br>• HTTP concerns<br>• Validation logic |

### Domain Layer

Additionally, there's a **Domain Layer** that contains:
- Domain models (Ticket)
- Enumerations (TicketStatus)
- Domain-specific errors
- Business rule definitions

This layer is shared by all other layers and contains pure domain logic.

---

## ✨ Features

### Core Functionality

✅ **Create Tickets** – Auto-generate ID, timestamps, default status  
✅ **Update Ticket Information** – Title, description, contact details  
✅ **Update Status** – With strict transition validation  
✅ **List Tickets** – With filtering, sorting, and pagination  
✅ **View Ticket Details** – Retrieve complete ticket information  
✅ **No Delete** – Deletion is strictly prohibited  

### Technical Features

🔹 **RESTful API** – Standard HTTP methods and status codes  
🔹 **Status Workflow** – Enforced state machine transitions  
🔹 **Input Validation** – Express-validator for request validation  
🔹 **Error Handling** – Centralized error handling middleware  
🔹 **CORS Support** – Configurable cross-origin requests  
🔹 **Request Logging** – Morgan for HTTP request logs  
🔹 **Environment Config** – dotenv for configuration  
🔹 **Unit Testing** – Jest for testing business logic  
🔹 **Integration Testing** – Supertest for API testing  

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **Express.js** | 4.21.0 | Web framework |
| **UUID** | 10.0.0 | Unique ID generation |
| **dotenv** | 16.4.5 | Environment variables |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **Morgan** | 1.10.0 | HTTP request logging |
| **Express Validator** | 7.2.0 | Request validation |
| **Jest** | 29.7.0 | Testing framework |
| **Supertest** | 7.0.0 | HTTP assertion testing |
| **Nodemon** | 3.1.4 | Development auto-reload |

---

## 📁 Project Structure

```
helpdesk-backend/
│
├── src/
│   │
│   ├── api/                          # Presentation Layer
│   │   ├── routes/
│   │   │   └── tickets.routes.js     # Express routes definition
│   │   │
│   │   ├── controllers/
│   │   │   └── tickets.controller.js # Request handlers
│   │   │
│   │   ├── validators/
│   │   │   └── tickets.validator.js  # Input validation rules
│   │   │
│   │   └── middlewares/
│   │       └── errorHandler.js       # Error handling middleware
│   │
│   ├── application/                  # Application Layer
│   │   ├── services/
│   │   │   └── tickets.service.js    # Business logic
│   │   │
│   │   ├── dto/
│   │   │   ├── ticket.input.js       # Input DTOs & validation
│   │   │   └── ticket.query.js       # Query DTOs & parsing
│   │   │
│   │   └── errors/
│   │       └── AppError.js           # Application errors
│   │
│   ├── domain/                       # Domain Layer
│   │   ├── models/
│   │   │   └── ticket.model.js       # Ticket domain model
│   │   │
│   │   ├── enums/
│   │   │   └── ticketStatus.js       # Status enumeration
│   │   │
│   │   └── errors/
│   │       └── domainErrors.js       # Domain-specific errors
│   │
│   ├── infrastructure/               # Persistence Layer
│   │   ├── repositories/
│   │   │   └── tickets.repository.js # Data access interface
│   │   │
│   │   └── datastore/
│   │       ├── index.js              # Datastore factory
│   │       ├── memoryStore.js        # In-memory implementation
│   │       └── fileStore.js          # File-based implementation
│   │
│   ├── config/
│   │   ├── env.js                    # Environment configuration
│   │   └── logger.js                 # Logging configuration
│   │
│   ├── app.js                        # Express app setup
│   └── server.js                     # Server entry point
│
├── tests/
│   ├── tickets.service.test.js       # Service unit tests
│   └── tickets.api.test.js           # API integration tests
│
├── data/                             # Data directory (if file store)
│   └── tickets.json
│
├── .env.example                      # Environment template
├── .gitignore
├── package.json
├── jest.config.js
└── README.md                         # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** (comes with Node.js)

### Installation

1. **Navigate to backend directory**
   ```bash
   cd helpdesk-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy the example file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Datastore Configuration
   # Options: "memory" | "file"
   DATASTORE_TYPE=memory
   
   # File Datastore Settings (required if DATASTORE_TYPE=file)
   DATA_FILE_PATH=./data/tickets.json
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   
   # Logging
   LOG_LEVEL=dev
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Server will run at: **http://localhost:5000**

5. **Verify it's working**
   ```bash
   curl http://localhost:5000/health
   ```
   
   Expected response:
   ```json
   {
     "status": "ok",
     "timestamp": "2025-01-27T10:30:00.000Z"
   }
   ```

### Production Build

```bash
npm start
```

---

## 📚 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Endpoints Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/tickets` | List tickets with filters | No |
| `GET` | `/tickets/:id` | Get ticket by ID | No |
| `POST` | `/tickets` | Create new ticket | No |
| `PUT` | `/tickets/:id` | Update ticket info | No |
| `PATCH` | `/tickets/:id/status` | Update ticket status | No |

### 1. List Tickets

**Endpoint:** `GET /api/tickets`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string/array | No | Filter by status (comma-separated or multiple params) |
| `sortBy` | string | No | Sort field: `status`, `createdAt`, `updatedAt` (default: `updatedAt`) |
| `sortOrder` | string | No | Sort order: `asc`, `desc` (default: `desc`) |
| `page` | integer | No | Page number (default: `1`) |
| `limit` | integer | No | Items per page (default: `10`, max: `100`) |

**Example Request:**
```bash
curl "http://localhost:5000/api/tickets?status=pending,accepted&sortBy=updatedAt&sortOrder=desc&page=1&limit=10"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Cannot login to system",
      "description": "Getting error 401",
      "contact": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "123-456-7890"
      },
      "status": "pending",
      "createdAt": "2025-01-27T10:30:00.000Z",
      "updatedAt": "2025-01-27T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2. Get Ticket by ID

**Endpoint:** `GET /api/tickets/:id`

**Example Request:**
```bash
curl http://localhost:5000/api/tickets/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Cannot login to system",
    "description": "Getting error 401",
    "contact": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "123-456-7890"
    },
    "status": "pending",
    "createdAt": "2025-01-27T10:30:00.000Z",
    "updatedAt": "2025-01-27T10:30:00.000Z"
  }
}
```

### 3. Create Ticket

**Endpoint:** `POST /api/tickets`

**Request Body:**
```json
{
  "title": "Printer not working",
  "description": "Office printer is offline and not responding",
  "contact": {
    "name": "Jane Smith",
    "email": "jane.smith@company.com",
    "phone": "555-0123"
  }
}
```

**Validation Rules:**
- `title`: Required, max 255 characters
- `description`: Required, max 2000 characters
- `contact.name`: Required
- `contact.email`: Required, valid email format
- `contact.phone`: Optional

**Response:**
```json
{
  "success": true,
  "message": "Ticket created successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Printer not working",
    "description": "Office printer is offline and not responding",
    "contact": {
      "name": "Jane Smith",
      "email": "jane.smith@company.com",
      "phone": "555-0123"
    },
    "status": "pending",
    "createdAt": "2025-01-27T11:00:00.000Z",
    "updatedAt": "2025-01-27T11:00:00.000Z"
  }
}
```

### 4. Update Ticket Information

**Endpoint:** `PUT /api/tickets/:id`

**Request Body:**
```json
{
  "title": "Printer still not working",
  "description": "Updated: Tried restarting but still offline",
  "contact": {
    "name": "Jane Smith",
    "email": "jane.smith@company.com",
    "phone": "555-0123"
  }
}
```

**Notes:**
- All fields are optional
- Only provided fields will be updated
- Status cannot be updated through this endpoint
- `updatedAt` is automatically updated

**Response:**
```json
{
  "success": true,
  "message": "Ticket updated successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Printer still not working",
    "description": "Updated: Tried restarting but still offline",
    "contact": {
      "name": "Jane Smith",
      "email": "jane.smith@company.com",
      "phone": "555-0123"
    },
    "status": "pending",
    "createdAt": "2025-01-27T11:00:00.000Z",
    "updatedAt": "2025-01-27T11:30:00.000Z"
  }
}
```

### 5. Update Ticket Status

**Endpoint:** `PATCH /api/tickets/:id/status`

**Request Body:**
```json
{
  "status": "accepted"
}
```

**Status Transitions:**
```
pending ──┬──> accepted ──┬──> resolved (final)
          │                └──> rejected (final)
          └──> rejected (final)
```

**Valid Transitions:**
- `pending` → `accepted` ✅
- `pending` → `rejected` ✅
- `accepted` → `resolved` ✅
- `accepted` → `rejected` ✅

**Invalid Transitions:**
- `pending` → `resolved` ❌
- `accepted` → `pending` ❌
- `resolved` → any status ❌ (final state)
- `rejected` → any status ❌ (final state)

**Response (Success):**
```json
{
  "success": true,
  "message": "Ticket status updated to 'accepted'",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "status": "accepted",
    "updatedAt": "2025-01-27T11:45:00.000Z"
  }
}
```

**Response (Invalid Transition):**
```json
{
  "success": false,
  "errorCode": "INVALID_STATUS_TRANSITION",
  "message": "Cannot transition from 'pending' to 'resolved'. Allowed: accepted, rejected",
  "statusCode": 422
}
```

### Error Responses

**404 Not Found:**
```json
{
  "success": false,
  "errorCode": "TICKET_NOT_FOUND",
  "message": "Ticket with ID 'xxx' not found",
  "statusCode": 404
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "errorCode": "VALIDATION_ERROR",
  "message": "Title is required",
  "statusCode": 400,
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

---

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run with Coverage

```bash
npm run test:coverage
```

### Watch Mode (for development)

```bash
npm run test:watch
```

### Test Structure

```
tests/
├── tickets.service.test.js    # Unit tests for business logic
│   ├── createTicket tests
│   ├── updateTicket tests
│   ├── updateTicketStatus tests
│   │   ├── Valid transitions
│   │   ├── Invalid transitions
│   │   └── Edge cases
│   └── listTickets tests
│
└── tickets.api.test.js         # Integration tests for API
    ├── POST /api/tickets
    ├── GET /api/tickets
    ├── GET /api/tickets/:id
    ├── PUT /api/tickets/:id
    └── PATCH /api/tickets/:id/status
```

### Example Test Output

```
PASS  tests/tickets.service.test.js
  Tickets Service
    createTicket
      ✓ should create ticket with pending status (15ms)
      ✓ should throw error if title is missing (5ms)
      ✓ should trim whitespace from title and description (8ms)
    updateTicketStatus - Valid Transitions
      ✓ should allow pending → accepted (12ms)
      ✓ should allow pending → rejected (10ms)
      ✓ should allow accepted → resolved (11ms)
    updateTicketStatus - Invalid Transitions
      ✓ should reject pending → resolved (9ms)
      ✓ should reject resolved → accepted (final state) (7ms)

PASS  tests/tickets.api.test.js
  Tickets API
    POST /api/tickets
      ✓ should create a ticket and return 201 (45ms)
      ✓ should return 400 if title is missing (22ms)
    PATCH /api/tickets/:id/status
      ✓ should allow pending → accepted (35ms)
      ✓ should reject pending → resolved (invalid) (28ms)

Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total
Coverage:    85.7% statements, 82.3% branches
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment: `development`, `production`, `test` |
| `DATASTORE_TYPE` | `memory` | Storage type: `memory` or `file` |
| `DATA_FILE_PATH` | `./data/tickets.json` | Path to JSON file (if file store) |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |
| `LOG_LEVEL` | `dev` | Morgan log level |

### Datastore Options

#### In-Memory Store (Default)
- Fast and simple
- Data is lost on server restart
- Good for development and testing

```env
DATASTORE_TYPE=memory
```

#### File Store
- Persistent storage
- Data saved to JSON file
- Good for small deployments

```env
DATASTORE_TYPE=file
DATA_FILE_PATH=./data/tickets.json
```

#### Extending to Database

The repository pattern makes it easy to add database support:

1. Create new datastore implementation (e.g., `postgresStore.js`)
2. Implement the same interface as `memoryStore.js`
3. Register in `infrastructure/datastore/index.js`
4. Configure via environment variable

---

## 🚀 Deployment

### Option 1: Traditional Hosting (Heroku, Railway, Render)

1. **Set environment variables**
   ```env
   PORT=5000
   NODE_ENV=production
   DATASTORE_TYPE=file
   DATA_FILE_PATH=/data/tickets.json
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

2. **Build and start**
   ```bash
   npm start
   ```

### Option 2: Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Build and run:**
```bash
docker build -t helpdesk-backend .
docker run -p 5000:5000 -e NODE_ENV=production helpdesk-backend
```

### Option 3: Serverless (Vercel, AWS Lambda)

The Express app in `src/app.js` can be adapted for serverless environments by exporting the app and using appropriate adapters.

---

## 📝 API Design Decisions

### Why 3-Layer Architecture?

1. **Maintainability** – Easy to understand and modify
2. **Testability** – Each layer can be tested independently
3. **Flexibility** – Easy to swap implementations (e.g., change database)
4. **Scalability** – Clear boundaries for growing the codebase

### Why Repository Pattern?

- Abstracts data access logic
- Makes testing easier (mock repositories)
- Allows switching storage without changing business logic

### Why No ORM?

- Keeps dependencies minimal
- Direct control over data operations
- Easier to understand for assessment purposes
- Can easily add ORM (TypeORM, Prisma) later if needed

---

## 🔍 Troubleshooting

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### File Store Permission Issues

```bash
# Ensure data directory exists and is writable
mkdir -p data
chmod 755 data
```

### CORS Errors

Make sure `CORS_ORIGIN` in `.env` matches your frontend URL:
```env
CORS_ORIGIN=http://localhost:3000
```

---

## 📚 Additional Resources

- [Express Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [REST API Design Guide](https://restfulapi.net/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

## 📄 License

ISC License - Part of Technical Assessment Project

---

**Built with clean code principles and best practices** 🚀