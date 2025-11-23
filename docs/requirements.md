# Helpdesk Support Ticket System

## Overview
Full-stack application for managing support tickets with REST API and SPA frontend.

## Features
- Create / Update ticket
- Update status (pending, accepted, resolved, rejected)
- Sort, Filter, Pagination
- No delete functionality
- 3-layer backend architecture
- Clean UI with responsive design

## Tech Stack
- Backend: Node.js + Express / NestJS
- Frontend: React + TypeScript + Tailwind
- Database: SQLite / MongoDB / JSON

## Run Instructions
```
npm install
npm run dev
```

## API Endpoints
- GET /api/tickets
- GET /api/tickets/:id
- POST /api/tickets
- PUT /api/tickets/:id
- PATCH /api/tickets/:id/status
