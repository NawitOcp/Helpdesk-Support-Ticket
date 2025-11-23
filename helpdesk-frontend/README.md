# Helpdesk Ticket Management System - Frontend

A modern, responsive React-based frontend for the Helpdesk Support Ticket Management System.

## Features

- ✅ Create, view, edit, and manage support tickets
- ✅ Filter tickets by status (pending, accepted, resolved, rejected)
- ✅ Sort tickets by various criteria
- ✅ Pagination support
- ✅ Update ticket status with validation rules
- ✅ Responsive design (desktop & mobile)
- ✅ Clean UI based on Figma specifications
- ✅ 3-layer architecture (Presentation, Application, Persistence)

## Tech Stack

- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: TailwindCSS
- **Build Tool**: Vite
- **Language**: JavaScript (ES6+)

## Project Structure

```
src/
├── main.jsx                      # Application entry point
├── App.jsx                       # Root component
├── index.css                     # Global styles
├── routes/
│   └── router.jsx               # Route configuration
├── pages/
│   ├── TicketsListPage.jsx      # Tickets list view
│   ├── TicketDetailPage.jsx     # Ticket detail view
│   ├── TicketCreatePage.jsx     # Create ticket form
│   └── TicketEditPage.jsx       # Edit ticket form
├── features/
│   └── tickets/
│       ├── components/
│       │   ├── TicketsTable.jsx
│       │   ├── TicketRow.jsx
│       │   ├── TicketFilters.jsx
│       │   ├── TicketStatusBadge.jsx
│       │   ├── TicketForm.jsx
│       │   └── Pagination.jsx
│       ├── api/
│       │   ├── ticketsApiClient.js
│       │   ├── useTicketsQuery.js
│       │   ├── useTicketDetailQuery.js
│       │   ├── useCreateTicketMutation.js
│       │   ├── useUpdateTicketMutation.js
│       │   └── useUpdateStatusMutation.js
│       └── utils/
│           ├── ticketStatusHelpers.js
│           └── ticketMappers.js
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx
│   │   └── HeaderBar.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── TextArea.jsx
│       ├── Select.jsx
│       ├── Dropdown.jsx
│       └── Badge.jsx
├── hooks/
│   └── useQueryStringState.js
└── config/
    └── apiConfig.js
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd helpdesk-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   
   The API base URL is configured in `src/config/apiConfig.js`:
   ```javascript
   export const API_BASE_URL = '/api';
   ```
   
   Vite proxy is configured in `vite.config.js` to forward `/api` requests to `http://localhost:5000`.

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## API Endpoints

The frontend expects the following API endpoints:

- `GET /api/tickets` - List tickets with filters
- `GET /api/tickets/:id` - Get ticket details
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/:id` - Update ticket information
- `PATCH /api/tickets/:id/status` - Update ticket status

## Features Overview

### Tickets List Page (`/tickets`)
- View all tickets in a table format
- Filter by status (multi-select)
- Sort by status, created date, or updated date
- Pagination support
- Click row to view details

### Ticket Detail Page (`/tickets/:id`)
- View complete ticket information
- Update ticket status (with validation)
- Edit ticket information
- View contact details and timestamps

### Create Ticket Page (`/tickets/create`)
- Create new tickets with title, description
- Add optional contact information
- Form validation

### Edit Ticket Page (`/tickets/:id/edit`)
- Edit existing ticket information
- Pre-filled with current data
- Status cannot be edited here

## Status Transition Rules

Per requirements, valid status transitions are:
- `pending` → `accepted` or `rejected`
- `accepted` → `resolved` or `rejected`
- `resolved` → (final state, no transitions)
- `rejected` → (final state, no transitions)

## UI Design Tokens

### Colors
- Pending: `#F59E0B` (Orange)
- Accepted: `#3B82F6` (Blue)
- Resolved: `#16A34A` (Green)
- Rejected: `#DC2626` (Red)

### Typography
- Font: Inter
- Heading: 24px
- Body: 16px
- Small: 14px

### Spacing
- 4px, 8px, 12px, 16px, 20px, 24px, 32px

### Border Radius
- Default: 8px
- Large: 12px

## Development Guidelines

### Code Architecture

The project follows a feature-based structure with clear separation of concerns:

1. **Presentation Layer** (`pages/`, `components/`)
   - Page components
   - Reusable UI components
   - Layout components

2. **Application Layer** (`features/*/api/`, `hooks/`)
   - Custom hooks for data fetching
   - Business logic
   - API client

3. **Persistence Layer** (Backend API)
   - Data storage handled by backend

### Component Design

- **Pages**: Thin components that orchestrate data and layout
- **Feature Components**: Domain-specific components
- **UI Components**: Reusable, generic components
- **Hooks**: Encapsulate data fetching and state management

### Best Practices

- Use functional components with hooks
- Keep components small and focused
- Implement proper error handling
- Add loading states for async operations
- Validate user input
- Use semantic HTML
- Follow accessibility guidelines

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of a technical assessment.

## Support

For issues or questions, please contact the development team.