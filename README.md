# Helpdesk Support Ticket Management System

A full-stack web application for managing support tickets with RESTful API and modern React frontend.

## 🌟 Features

- ✅ **Create Tickets** - Submit support requests with title, description, and contact information
- ✅ **View Tickets** - List all tickets with filtering, sorting, and pagination
- ✅ **Update Tickets** - Edit ticket information and track changes
- ✅ **Status Management** - Track ticket lifecycle with enforced state transitions
- ✅ **No Delete** - Tickets are preserved for audit trail
- ✅ **Responsive Design** - Works on desktop and mobile devices

## 🏗️ Architecture

### Backend (3-Layer Architecture)
```
├── Presentation Layer (API Routes & Controllers)
├── Application Layer (Business Logic & Services)
└── Persistence Layer (Repository & Datastore)
```

### Frontend (Feature-Based Structure)
```
├── Pages (Route Components)
├── Features (Domain-Specific Components & Logic)
└── Components (Reusable UI Components)
```

## 🛠️ Tech Stack

### Backend
- **Framework**: Node.js + Express.js
- **Language**: JavaScript (ES Modules)
- **Datastore**: In-memory / JSON file
- **Testing**: Jest
- **API Spec**: OpenAPI 3.1

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **API Client**: Orval (TypeScript-generated from OpenAPI)
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd helpdesk-assignment
```

### 2. Backend Setup
```bash
cd helpdesk-backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd helpdesk-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📚 API Documentation

### View Documentation
Open the API documentation:
```bash
cd helpdesk-backend/docs
# Open api-docs.html in browser
```

Or visit: `http://localhost:5000/api-docs` (if hosted)

### OpenAPI Specification
- Location: `helpdesk-backend/docs/openapi.yaml`
- Version: OpenAPI 3.1.0
- Validated: ✅ 0 errors

## 🔄 Status Workflow

Valid state transitions:
- `pending` → `accepted` | `rejected`
- `accepted` → `resolved` | `rejected`
- `resolved` → (final state)
- `rejected` → (final state)

## 🧪 Testing

### Backend Tests
```bash
cd helpdesk-backend
npm test
```

### Run with coverage
```bash
npm run test:coverage
```

## 📁 Project Structure

```
helpdesk-assignment/
├── helpdesk-backend/
│   ├── src/
│   │   ├── api/                 # Presentation Layer
│   │   │   ├── routes/
│   │   │   ├── controllers/
│   │   │   ├── validators/
│   │   │   └── middlewares/
│   │   ├── application/         # Application Layer
│   │   │   ├── services/
│   │   │   ├── dto/
│   │   │   └── errors/
│   │   ├── domain/              # Domain Layer
│   │   │   ├── models/
│   │   │   ├── enums/
│   │   │   └── errors/
│   │   └── infrastructure/      # Persistence Layer
│   │       ├── repositories/
│   │       └── datastore/
│   ├── tests/
│   ├── docs/
│   │   ├── openapi.yaml
│   │   └── api-docs.html
│   └── package.json
│
├── helpdesk-frontend/
│   ├── src/
│   │   ├── pages/               # Route Components
│   │   ├── features/            # Feature Modules
│   │   │   └── tickets/
│   │   │       ├── api/         # API Hooks
│   │   │       ├── components/  # Feature Components
│   │   │       └── utils/       # Utilities
│   │   ├── components/          # Shared Components
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── api-client/          # Generated API Client
│   │   ├── config/
│   │   └── routes/
│   ├── openapi.yaml
│   ├── orval.config.js
│   └── package.json
│
└── README.md
```

## 🎨 Design System

### Colors (Status)
- **Pending**: Orange (#F59E0B)
- **Accepted**: Blue (#3B82F6)
- **Resolved**: Green (#16A34A)
- **Rejected**: Red (#DC2626)

### Typography
- Font: Inter
- Sizes: 14px, 16px, 24px

## 🔧 Development Scripts

### Backend
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run generate:api # Regenerate API client from OpenAPI spec
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | List all tickets (with filters) |
| GET | `/api/tickets/:id` | Get ticket details |
| POST | `/api/tickets` | Create new ticket |
| PUT | `/api/tickets/:id` | Update ticket information |
| PATCH | `/api/tickets/:id/status` | Update ticket status |

### Query Parameters (GET /api/tickets)
- `status`: Filter by status (can use multiple)
- `sortBy`: Field to sort by (status, createdAt, updatedAt)
- `sortOrder`: Sort direction (asc, desc)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

## 📝 Data Model

```typescript
interface Ticket {
  id: string;              // UUID
  title: string;           // Max 255 chars
  description: string;     // Max 2000 chars
  contact: {
    name: string;
    email: string;
    phone?: string;
  };
  status: 'pending' | 'accepted' | 'resolved' | 'rejected';
  createdAt: string;       // ISO datetime
  updatedAt: string;       // ISO datetime
}
```

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DATASTORE_TYPE=memory
CORS_ORIGIN=http://localhost:3000
```

### Frontend
API calls are proxied through Vite config to avoid CORS issues.

## 🚢 Deployment

### Backend
- Can be deployed to: Railway, Render, Heroku
- Set `NODE_ENV=production`
- Configure `CORS_ORIGIN` to frontend URL

### Frontend
- Can be deployed to: Vercel, Netlify
- Build command: `npm run build`
- Output directory: `dist`

## 🤝 Contributing

This is an assignment project. For educational purposes only.

## 📄 License

This project is part of a technical assessment.

## 👨‍💻 Author

[Your Name]

## 📞 Support

For questions or issues, please contact: [Your Email]

---

**Built with ❤️ for Nipa Cloud Technical Assessment**

## 🐳 Docker Setup (Recommended)

### Quick Start with Docker:
```bash
# 1. Make sure Docker Desktop is running

# 2. Clone and run:
git clone <repository-url>
cd helpdesk-assignment
docker-compose up

# 3. Open browser:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000/api
```

### Stop:
```bash
docker-compose down
```

See [DOCKER.md](DOCKER.md) for detailed instructions.