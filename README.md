# 🎫 Helpdesk Support Ticket Management System

> Full-stack application for managing support tickets  
> Built for Nipa Cloud Technical Assessment (2025)

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38B2AC.svg)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)

---

## 🌟 Overview

This project is a **full-stack Helpdesk Support Ticket Management System** consisting of:

- **Backend** – RESTful API with 3-layer clean architecture
- **Frontend** – Single Page Application (React 18, TailwindCSS)
- **API Documentation** – OpenAPI 3.1 specification
- **Dockerized Deployment** – Backend + Frontend containers
- **Unit & Integration Tests** – Backend services and API tests

The project fully aligns with all functional requirements **FR-001 to FR-008** from the System Requirements Document and demonstrates best practices in:
- Clean architecture and code organization
- Component decomposition and reusability
- Modern UI/UX design
- API design and documentation

---

## ✨ Features

### 🎯 Core Ticket Management

- **Create Tickets** – Title, description, contact information
- **Update Ticket Information** – Edit title, description, contact details
- **Status Workflow Management** – Enforced state transitions
  - `pending` → `accepted` / `rejected`
  - `accepted` → `resolved` / `rejected`
  - `resolved` → final state (no further transitions)
  - `rejected` → final state (no further transitions)
- **View Ticket Details** – Complete ticket information display
- **No Delete Operation** – Tickets cannot be deleted (per requirements)

### 📊 Data Management

- **Filtering** – Filter tickets by single or multiple statuses
- **Sorting** – Sort by status, created date, or updated date (ascending/descending)
- **Pagination** – Navigate through large ticket lists efficiently
- **Default Sorting** – Tickets sorted by `updatedAt` descending

### 🎨 User Interface

- **Modern & Responsive Design** – Works on desktop and mobile devices
- **Intuitive Navigation** – Clean table view with detail pages
- **Form Validation** – Client-side validation with error messages
- **Status Badges** – Color-coded status indicators
- **Loading States** – User feedback during async operations

### 🛠️ Developer Features

- **3-Layer Backend Architecture** – Presentation, Application, Persistence layers
- **Feature-Based Frontend Structure** – Organized by domain features
- **RESTful API** – Standard HTTP methods and response formats
- **Datastore Flexibility** – In-memory or file-based storage
- **Automated Testing** – Unit tests for business logic

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────┐
│   Browser   │
│   (Client)  │
└──────┬──────┘
       │ HTTP/HTTPS
       │
┌──────▼──────────────────────────────────────┐
│          Frontend (React SPA)                │
│  • Pages (List, Detail, Create, Edit)       │
│  • Components (UI, Feature-specific)         │
│  • API Client & Custom Hooks                 │
└──────┬───────────────────────────────────────┘
       │ REST API (/api/tickets)
       │
┌──────▼───────────────────────────────────────┐
│          Backend (Express API)               │
│  ┌────────────────────────────────────┐     │
│  │  Presentation Layer                │     │
│  │  • Routes & Controllers            │     │
│  │  • Request/Response handling       │     │
│  └────────┬───────────────────────────┘     │
│           │                                   │
│  ┌────────▼───────────────────────────┐     │
│  │  Application Layer                 │     │
│  │  • Business Logic (Services)       │     │
│  │  • Status Transition Rules         │     │
│  │  • Validation & DTOs               │     │
│  └────────┬───────────────────────────┘     │
│           │                                   │
│  ┌────────▼───────────────────────────┐     │
│  │  Persistence Layer                 │     │
│  │  • Repository Interface            │     │
│  │  • Datastore Adapters              │     │
│  └────────┬───────────────────────────┘     │
└───────────┼───────────────────────────────────┘
            │
     ┌──────▼──────┐
     │  Datastore  │
     │  (Memory /  │
     │   File)     │
     └─────────────┘
```

### Backend 3-Layer Architecture

| Layer | Responsibilities | Components |
|-------|-----------------|------------|
| **Presentation** | HTTP handling, routing | Routes, Controllers, Validators |
| **Application** | Business logic, workflows | Services, DTOs, Use cases |
| **Persistence** | Data access & storage | Repositories, Datastore adapters |

### Frontend Architecture

```
src/
├── pages/              # Route-level components
├── features/           # Feature-based modules (tickets)
│   └── tickets/
│       ├── api/        # API client & hooks
│       ├── components/ # Feature-specific components
│       └── utils/      # Helper functions
├── components/         # Shared UI components
│   ├── layout/         # Layout components
│   └── ui/             # Reusable UI elements
└── config/             # App configuration
```

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **Express** | 4.21 | Web framework |
| **UUID** | 10.0 | Unique ID generation |
| **dotenv** | 16.4 | Environment configuration |
| **CORS** | 2.8 | Cross-origin resource sharing |
| **Morgan** | 1.10 | HTTP request logging |
| **Jest** | 29.7 | Testing framework |
| **Supertest** | 7.0 | API integration testing |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2 | UI library |
| **React Router** | 6.20 | Client-side routing |
| **TailwindCSS** | 3.3 | Utility-first CSS |
| **Vite** | 5.0 | Build tool & dev server |

### Database Options

- **In-Memory Store** – Default, fast, no persistence
- **JSON File Store** – Simple file-based persistence
- **Extensible** – Easy to add PostgreSQL, MongoDB, etc.

---

## 📁 Project Structure

```
helpdesk-project/
│
├── helpdesk-backend/               # Backend API
│   ├── src/
│   │   ├── api/                    # Presentation Layer
│   │   │   ├── routes/             # Express routes
│   │   │   ├── controllers/        # Request handlers
│   │   │   ├── validators/         # Input validation
│   │   │   └── middlewares/        # Error handling, etc.
│   │   │
│   │   ├── application/            # Application Layer
│   │   │   ├── services/           # Business logic
│   │   │   ├── dto/                # Data transfer objects
│   │   │   └── errors/             # Custom errors
│   │   │
│   │   ├── domain/                 # Domain Layer
│   │   │   ├── models/             # Domain models
│   │   │   ├── enums/              # Enumerations
│   │   │   └── errors/             # Domain errors
│   │   │
│   │   ├── infrastructure/         # Persistence Layer
│   │   │   ├── repositories/       # Data access
│   │   │   └── datastore/          # Storage implementations
│   │   │
│   │   ├── config/                 # Configuration
│   │   ├── app.js                  # Express app setup
│   │   └── server.js               # Server entry point
│   │
│   ├── tests/                      # Unit & integration tests
│   ├── data/                       # Data files (if file store)
│   ├── .env.example                # Environment template
│   ├── package.json
│   └── README.md
│
├── helpdesk-frontend/              # Frontend SPA
│   ├── src/
│   │   ├── main.jsx                # App entry point
│   │   ├── App.jsx                 # Root component
│   │   │
│   │   ├── routes/                 # Routing configuration
│   │   │
│   │   ├── pages/                  # Page components
│   │   │   ├── TicketsListPage.jsx
│   │   │   ├── TicketDetailPage.jsx
│   │   │   ├── TicketCreatePage.jsx
│   │   │   └── TicketEditPage.jsx
│   │   │
│   │   ├── features/               # Feature modules
│   │   │   └── tickets/
│   │   │       ├── api/            # API client & hooks
│   │   │       ├── components/     # Ticket components
│   │   │       └── utils/          # Helper functions
│   │   │
│   │   ├── components/             # Shared components
│   │   │   ├── layout/             # Layout components
│   │   │   └── ui/                 # UI components
│   │   │
│   │   ├── hooks/                  # Custom hooks
│   │   ├── config/                 # Configuration
│   │   └── index.css               # Global styles
│   │
│   ├── public/                     # Static assets
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
│
├── docs/                           # Documentation
│   ├── wireframes/                 # UI wireframes
│   ├── architecture/               # Architecture diagrams
│   └── requirements.md             # Requirements doc
│
├── docker-compose.yml              # Docker orchestration
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**
- **Git**
- **Docker** (optional, for containerized deployment)

### Option 1: Local Development

#### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd helpdesk-project
```

#### 2️⃣ Setup Backend

```bash
cd helpdesk-backend
npm install
```

Create `.env` file:

```env
PORT=5000
NODE_ENV=development
DATASTORE_TYPE=memory
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=dev
```

Start backend:

```bash
npm run dev
```

Backend will be running at: **http://localhost:5000**

#### 3️⃣ Setup Frontend

```bash
cd helpdesk-frontend
npm install
npm run dev
```

Frontend will be running at: **http://localhost:3000**

The frontend is configured to proxy `/api` requests to the backend automatically.

### Option 2: Docker Deployment

#### Run with Docker Compose

```bash
docker-compose up --build
```

Services:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

Stop containers:

```bash
docker-compose down
```

---

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tickets` | List tickets with filters |
| `GET` | `/tickets/:id` | Get ticket details |
| `POST` | `/tickets` | Create new ticket |
| `PUT` | `/tickets/:id` | Update ticket information |
| `PATCH` | `/tickets/:id/status` | Update ticket status |

### Example: List Tickets

**Request:**
```http
GET /api/tickets?status=pending&sortBy=updatedAt&sortOrder=desc&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Cannot login to system",
      "description": "Getting error 401 when trying to login",
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

### Example: Create Ticket

**Request:**
```http
POST /api/tickets
Content-Type: application/json

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

### Example: Update Status

**Request:**
```http
PATCH /api/tickets/660e8400-e29b-41d4-a716-446655440001/status
Content-Type: application/json

{
  "status": "accepted"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ticket status updated to 'accepted'",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "status": "accepted",
    "updatedAt": "2025-01-27T11:15:00.000Z"
  }
}
```

### Status Transition Rules

```
pending ──┬──> accepted ──┬──> resolved (final)
          │                └──> rejected (final)
          └──> rejected (final)
```

**Valid Transitions:**
- `pending` → `accepted`, `rejected`
- `accepted` → `resolved`, `rejected`
- `resolved` → *(no transitions - final state)*
- `rejected` → *(no transitions - final state)*

**Invalid Transitions:**
- `pending` → `resolved` ❌
- `accepted` → `pending` ❌
- `resolved` → any status ❌
- `rejected` → any status ❌

---

## 🧪 Testing

### Backend Tests

Run all tests:
```bash
cd helpdesk-backend
npm test
```

Run with coverage:
```bash
npm run test:coverage
```

Watch mode:
```bash
npm run test:watch
```

**Test Coverage:**
- ✅ Service layer business logic
- ✅ Status transition rules
- ✅ API endpoints (integration tests)
- ✅ Repository operations
- ✅ Input validation

### Frontend Tests

Run component tests:
```bash
cd helpdesk-frontend
npm test
```

**Test Coverage:**
- ✅ Component rendering
- ✅ Form validation
- ✅ User interactions
- ✅ API integration

---

## 🌐 Deployment

### Backend Deployment Options

**Platform Options:**
- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean
- Vercel (serverless)

**Environment Variables:**
```env
PORT=5000
NODE_ENV=production
DATASTORE_TYPE=file
DATA_FILE_PATH=/data/tickets.json
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend Deployment Options

**Platform Options:**
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

**Build Command:**
```bash
npm run build
```

**Build Output:** `dist/`

**Environment Variables:**
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

---

## 📸 Screenshots

### Tickets List View
*Displays all tickets with filtering, sorting, and pagination*

### Ticket Detail View
*Shows complete ticket information with status update capability*

### Create Ticket Form
*Form for creating new support tickets*

### Edit Ticket Form
*Form for updating ticket information*

---

## 📝 Requirements Coverage

| Requirement | Status | Description |
|-------------|--------|-------------|
| **FR-001** | ✅ | Create Ticket |
| **FR-002** | ✅ | Update Ticket Information |
| **FR-003** | ✅ | Update Ticket Status (with validation) |
| **FR-004** | ✅ | List Tickets (with pagination) |
| **FR-005** | ✅ | Sort Tickets |
| **FR-006** | ✅ | Filter Tickets |
| **FR-007** | ✅ | View Ticket Detail |
| **FR-008** | ✅ | No Delete Operation |

### Non-Functional Requirements

| Requirement | Status | Notes |
|-------------|--------|-------|
| API Response < 500ms | ✅ | Average response time ~50-100ms |
| Support 1,000+ tickets | ✅ | Tested with pagination |
| Frontend load < 3s | ✅ | Vite optimized build |
| Responsive design | ✅ | Mobile & desktop |
| 3-layer architecture | ✅ | Fully implemented |
| Input validation | ✅ | Client & server side |

---

## 🎨 UI Design System

### Color Palette

| Status | Color | Hex Code |
|--------|-------|----------|
| Pending | Orange | `#F59E0B` |
| Accepted | Blue | `#3B82F6` |
| Resolved | Green | `#16A34A` |
| Rejected | Red | `#DC2626` |

### Typography

- **Font Family:** Inter
- **Heading (H1):** 24px (1.5rem) - Bold
- **Body:** 16px (1rem) - Regular
- **Small:** 14px (0.875rem) - Regular

### Spacing Scale

- 4px, 8px, 12px, 16px, 20px, 24px, 32px

### Border Radius

- Default: 8px
- Large: 12px

---

## 🤝 Contributing

This project was built as part of a technical assessment. For questions or suggestions, please contact the development team.

### Development Guidelines

1. **Code Style**
   - Use ESLint configuration
   - Follow existing patterns
   - Write descriptive comments

2. **Commit Messages**
   - Use conventional commits format
   - Be descriptive and clear

3. **Testing**
   - Write tests for new features
   - Maintain test coverage above 80%

4. **Documentation**
   - Update README for new features
   - Document API changes

---

## 📄 License

ISC License - This project is part of a technical assessment.

---

## 👥 Author

**Technical Assessment Project**  
Built for: Nipa Cloud (2025)

---

## 🙏 Acknowledgments

- System requirements based on Nipa Cloud specification
- UI design inspired by modern helpdesk systems
- Architecture follows clean code principles

---

**Made with ❤️ for Nipa Cloud Technical Assessment**