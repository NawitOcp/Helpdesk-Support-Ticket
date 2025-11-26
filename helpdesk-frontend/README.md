# 🎨 Helpdesk Ticket Management System – Frontend

> Modern, responsive React SPA for helpdesk ticket management

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38B2AC.svg)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [UI Components](#-ui-components)
- [API Integration](#-api-integration)
- [Styling Guide](#-styling-guide)
- [Testing](#-testing)
- [Build & Deployment](#-build--deployment)

---

## 🌟 Overview

A modern, responsive **React 18** Single Page Application for managing helpdesk support tickets. Built with:

- **React** for component-based UI
- **TailwindCSS** for utility-first styling
- **Vite** for blazing-fast development
- **React Router v6** for client-side routing
- **Feature-based architecture** for scalability

### Key Highlights

✨ **Modern UI/UX** – Clean, intuitive interface  
📱 **Fully Responsive** – Works seamlessly on desktop and mobile  
🎯 **3-Layer Architecture** – Presentation, Application, Persistence  
🔍 **Advanced Filtering** – Multi-status filter with sorting  
📄 **Pagination** – Efficient navigation through large datasets  
✅ **Form Validation** – Client-side validation with error messages  
🎨 **Design System** – Consistent colors, typography, and spacing  

---

## ✨ Features

### 🎫 Ticket Management

✅ **Create Tickets** – Form with validation  
✅ **View Ticket List** – Table view with sorting and filtering  
✅ **Ticket Details** – Complete information display  
✅ **Edit Tickets** – Update title, description, contact info  
✅ **Status Updates** – Change ticket status with validation  

### 🔍 Data Operations

- **Multi-Status Filtering** – Select multiple statuses at once
- **Flexible Sorting** – By status, created date, or updated date
- **Pagination** – Navigate through pages efficiently
- **Search** – (Ready for implementation)

### 🎨 User Experience

- **Responsive Design** – Mobile-first approach
- **Loading States** – Spinners during data fetching
- **Error Handling** – User-friendly error messages
- **Success Feedback** – Confirmation messages
- **Intuitive Navigation** – Clear breadcrumbs and buttons

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI library |
| **React Router** | 6.20.0 | Client-side routing |
| **TailwindCSS** | 3.3.6 | Utility-first CSS framework |
| **Vite** | 5.0.8 | Build tool & dev server |
| **PostCSS** | 8.4.32 | CSS processing |
| **Autoprefixer** | 10.4.16 | CSS vendor prefixing |

### Development Dependencies

- **ESLint** – Code linting
- **React DevTools** – Debugging

---

## 📁 Project Structure

```
helpdesk-frontend/
│
├── public/                          # Static assets
│   └── vite.svg
│
├── src/
│   │
│   ├── main.jsx                     # Application entry point
│   ├── App.jsx                      # Root component
│   ├── index.css                    # Global styles & Tailwind imports
│   │
│   ├── routes/
│   │   └── router.jsx               # Route configuration
│   │
│   ├── pages/                       # Page-level components
│   │   ├── TicketsListPage.jsx      # 📋 List all tickets
│   │   ├── TicketDetailPage.jsx     # 🔍 View ticket details
│   │   ├── TicketCreatePage.jsx     # ➕ Create new ticket
│   │   └── TicketEditPage.jsx       # ✏️ Edit existing ticket
│   │
│   ├── features/                    # Feature modules
│   │   └── tickets/
│   │       │
│   │       ├── api/                 # API layer
│   │       │   ├── ticketsApiClient.js        # HTTP client
│   │       │   ├── useTicketsQuery.js         # Fetch tickets list
│   │       │   ├── useTicketDetailQuery.js    # Fetch single ticket
│   │       │   ├── useCreateTicketMutation.js # Create ticket
│   │       │   ├── useUpdateTicketMutation.js # Update ticket
│   │       │   └── useUpdateStatusMutation.js # Update status
│   │       │
│   │       ├── components/          # Feature components
│   │       │   ├── TicketsTable.jsx
│   │       │   ├── TicketRow.jsx
│   │       │   ├── TicketFilters.jsx
│   │       │   ├── TicketStatusBadge.jsx
│   │       │   ├── TicketForm.jsx
│   │       │   └── Pagination.jsx
│   │       │
│   │       └── utils/               # Helper functions
│   │           ├── ticketStatusHelpers.js
│   │           └── ticketMappers.js
│   │
│   ├── components/                  # Shared components
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── AppLayout.jsx
│   │   │   └── HeaderBar.jsx
│   │   │
│   │   └── ui/                      # Reusable UI components
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── TextArea.jsx
│   │       ├── Select.jsx
│   │       ├── Dropdown.jsx
│   │       └── Badge.jsx
│   │
│   ├── hooks/                       # Custom hooks
│   │   └── useQueryStringState.js
│   │
│   └── config/                      # Configuration
│       └── apiConfig.js
│
├── .eslintrc.cjs                    # ESLint configuration
├── .gitignore
├── index.html                       # HTML template
├── package.json
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Tailwind configuration
├── vite.config.js                   # Vite configuration
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16 or higher
- **npm** or **yarn**
- **Backend API** running on `http://localhost:5000`

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd helpdesk-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint** (optional)
   
   The API base URL is configured in `src/config/apiConfig.js`:
   ```javascript
   export const API_BASE_URL = '/api';
   ```
   
   Vite proxy is configured in `vite.config.js`:
   ```javascript
   server: {
     port: 3000,
     proxy: {
       '/api': {
         target: 'http://localhost:5000',
         changeOrigin: true
       }
     }
   }
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Application will be available at: **http://localhost:3000**

### Development Tips

- Hot Module Replacement (HMR) is enabled – changes appear instantly
- React DevTools browser extension recommended for debugging
- Use the Network tab to inspect API calls

---

## 🏗️ Architecture

### Layer Separation

```
┌─────────────────────────────────────────────┐
│         Presentation Layer                  │
│  • Pages (route-level components)           │
│  • Layout components                         │
│  • UI components                             │
│                                              │
│  📁 src/pages/, src/components/             │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Application Layer                   │
│  • Custom hooks for data fetching           │
│  • Business logic                            │
│  • State management                          │
│  • API client                                │
│                                              │
│  📁 src/features/*/api/, src/hooks/         │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Persistence Layer                   │
│  • Backend REST API                          │
│  • Data storage & retrieval                  │
│                                              │
│  🌐 Backend API (http://localhost:5000)     │
└──────────────────────────────────────────────┘
```

### Component Design Principles

| Component Type | Responsibility | Example |
|---------------|----------------|---------|
| **Pages** | Route-level orchestration | `TicketsListPage.jsx` |
| **Feature Components** | Domain-specific logic | `TicketsTable.jsx` |
| **UI Components** | Reusable, generic elements | `Button.jsx`, `Input.jsx` |
| **Layout Components** | Page structure | `AppLayout.jsx` |
| **Custom Hooks** | Data fetching & state | `useTicketsQuery.js` |

### Data Flow

```
User Action
    ↓
Page Component
    ↓
Custom Hook (API call)
    ↓
API Client
    ↓
Backend API
    ↓
Response
    ↓
Custom Hook (state update)
    ↓
Re-render Components
```

---

## 🎨 UI Components

### Layout Components

#### AppLayout
Main layout wrapper with header and content area.

```jsx
<AppLayout>
  <h1>Page Title</h1>
  {/* Page content */}
</AppLayout>
```

#### HeaderBar
Application header with logo and user info.

### UI Components

#### Button
```jsx
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

Variants: `primary`, `secondary`, `danger`

#### Input
```jsx
<Input
  label="Title"
  placeholder="Enter title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  error={errors.title}
/>
```

#### TextArea
```jsx
<TextArea
  label="Description"
  rows={6}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  error={errors.description}
/>
```

#### Select (Single Selection)
```jsx
<Select
  label="Sort By"
  options={sortOptions}
  value={sortBy}
  onChange={setSortBy}
/>
```

#### Dropdown (Multi-Selection)
```jsx
<Dropdown
  label="Status Filter"
  options={statusOptions}
  value={selectedStatuses}
  onChange={setSelectedStatuses}
/>
```

#### Badge
```jsx
<Badge status="pending" />
<Badge status="accepted" />
<Badge status="resolved" />
<Badge status="rejected" />
```

### Feature Components

#### TicketsTable
Displays tickets in a table format.

```jsx
<TicketsTable
  tickets={tickets}
  onRowClick={handleRowClick}
/>
```

#### TicketForm
Reusable form for creating and editing tickets.

```jsx
<TicketForm
  initialData={ticket}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  isEdit={true}
  submitLabel="Save Changes"
/>
```

#### Pagination
```jsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>
```

---

## 🔌 API Integration

### Custom Hooks Pattern

All API interactions use custom hooks for:
- Consistent error handling
- Loading state management
- Automatic re-fetching
- Separation of concerns

### Example: Fetching Tickets List

```javascript
import useTicketsQuery from '../features/tickets/api/useTicketsQuery';

function TicketsListPage() {
  const { tickets, loading, error, totalPages } = useTicketsQuery({
    page: 1,
    limit: 10,
    status: ['pending', 'accepted'],
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {tickets.map(ticket => (
        <TicketRow key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
```

### Available Hooks

| Hook | Purpose | Returns |
|------|---------|---------|
| `useTicketsQuery` | Fetch tickets list | `{ tickets, loading, error, totalPages, refetch }` |
| `useTicketDetailQuery` | Fetch single ticket | `{ ticket, loading, error, refetch }` |
| `useCreateTicketMutation` | Create new ticket | `{ createTicket, loading, error }` |
| `useUpdateTicketMutation` | Update ticket info | `{ updateTicket, loading, error }` |
| `useUpdateStatusMutation` | Update ticket status | `{ updateStatus, loading, error }` |

### API Client

The `ticketsApiClient` handles all HTTP requests:

```javascript
import ticketsApiClient from './ticketsApiClient';

// Get tickets
const response = await ticketsApiClient.getTickets({
  page: 1,
  limit: 10,
  status: ['pending']
});

// Create ticket
const ticket = await ticketsApiClient.createTicket({
  title: 'Issue title',
  description: 'Issue description',
  contact: { name: 'John', email: 'john@example.com' }
});

// Update status
await ticketsApiClient.updateTicketStatus(ticketId, 'accepted');
```

---

## 🎨 Styling Guide

### Design System

#### Color Palette

```javascript
// Status Colors (from tailwind.config.js)
const colors = {
  pending: '#F59E0B',   // Orange
  accepted: '#3B82F6',  // Blue
  resolved: '#16A34A',  // Green
  rejected: '#DC2626'   // Red
};
```

#### Typography

```css
/* Font Family */
font-family: 'Inter', sans-serif;

/* Sizes */
text-3xl  /* 24px - Headings (H1) */
text-base /* 16px - Body text */
text-sm   /* 14px - Small text */
```

#### Spacing Scale

```javascript
// Tailwind spacing (rem)
4  → 1rem  → 16px
8  → 2rem  → 32px
12 → 3rem  → 48px
16 → 4rem  → 64px
20 → 5rem  → 80px
24 → 6rem  → 96px
32 → 8rem  → 128px
```

#### Border Radius

```css
rounded-lg  /* 8px - Default */
rounded-xl  /* 12px - Large */
```

### TailwindCSS Usage

#### Common Patterns

**Container:**
```jsx
<div className="max-w-7xl mx-auto px-8 py-8">
  {/* Content */}
</div>
```

**Card:**
```jsx
<div className="bg-white rounded-lg border border-gray-200 p-6">
  {/* Card content */}
</div>
```

**Button:**
```jsx
<button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
  Click Me
</button>
```

**Input:**
```jsx
<input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
```

### Responsive Design

```jsx
{/* Mobile-first approach */}
<div className="
  grid 
  grid-cols-1       /* Mobile: 1 column */
  md:grid-cols-2    /* Tablet: 2 columns */
  lg:grid-cols-3    /* Desktop: 3 columns */
  gap-4
">
  {/* Items */}
</div>
```

---

## 📱 Pages Overview

### 1. Tickets List Page (`/tickets`)

**Features:**
- Table view of all tickets
- Multi-status filter
- Sort by: status, created date, updated date
- Pagination
- Click row to view details

**Components Used:**
- `TicketsTable`
- `TicketFilters`
- `Pagination`
- `Button`

### 2. Ticket Detail Page (`/tickets/:id`)

**Features:**
- Display all ticket information
- Status update dropdown (with validation)
- Edit button (navigates to edit page)
- Back button

**Components Used:**
- `TicketStatusBadge`
- `Select` (for status change)
- `Button`

### 3. Create Ticket Page (`/tickets/create`)

**Features:**
- Form for new ticket
- Client-side validation
- Contact information (optional)
- Cancel button

**Components Used:**
- `TicketForm`
- `Input`
- `TextArea`
- `Button`

### 4. Edit Ticket Page (`/tickets/:id/edit`)

**Features:**
- Pre-filled form with current data
- Update title, description, contact
- Status cannot be edited here
- Cancel button

**Components Used:**
- `TicketForm`
- `TicketStatusBadge`

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test Structure

```
tests/
├── components/
│   ├── Button.test.jsx
│   ├── TicketForm.test.jsx
│   └── TicketsTable.test.jsx
├── hooks/
│   └── useTicketsQuery.test.js
└── pages/
    └── TicketsListPage.test.jsx
```

### Example Test

```javascript
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click Me</Button>);
  const button = screen.getByText('Click Me');
  expect(button).toBeInTheDocument();
});
```

---

## 🏗️ Build & Deployment

### Build for Production

```bash
npm run build
```

Build output: `dist/`

### Preview Production Build

```bash
npm run preview
```

Serves the built application at `http://localhost:4173`

### Deployment Options

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Netlify

1. Connect your Git repository
2. Build command: `npm run build`
3. Publish directory: `dist`

#### Cloudflare Pages

1. Connect GitHub repository
2. Framework preset: Vite
3. Build command: `npm run build`
4. Build output: `dist`

### Environment Variables for Production

Create `.env.production`:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

---

## 🔧 Configuration Files

### vite.config.js

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
```

### tailwind.config.js

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      colors: {
        status: {
          pending: '#F59E0B',
          accepted: '#3B82F6',
          resolved: '#16A34A',
          rejected: '#DC2626'
        }
      }
    }
  },
  plugins: []
};
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Change port in vite.config.js
server: {
  port: 3001  // Use different port
}
```

### API Connection Issues

1. Verify backend is running on `http://localhost:5000`
2. Check CORS configuration in backend
3. Inspect Network tab in browser DevTools

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Best Practices

### Component Design

✅ **Keep components small and focused**  
✅ **Use functional components with hooks**  
✅ **Implement proper error boundaries**  
✅ **Add loading states for async operations**  
✅ **Validate user input**  

### Performance

✅ **Use React.memo for expensive components**  
✅ **Implement code splitting with lazy loading**  
✅ **Optimize images and assets**  
✅ **Use Vite's build optimizations**  

### Accessibility

✅ **Use semantic HTML**  
✅ **Add proper ARIA labels**  
✅ **Ensure keyboard navigation**  
✅ **Maintain color contrast ratios**  

---

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

## 📄 License

ISC License - Part of Technical Assessment Project

---

## 🙏 Acknowledgments

- Design inspired by modern helpdesk systems
- Built with React best practices
- UI components follow Figma specifications

---

**Made with ❤️ using React + Vite + TailwindCSS** 🚀