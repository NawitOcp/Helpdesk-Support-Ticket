# Helpdesk Support Ticket System – Backend

This project is a **Node.js (JavaScript)** backend that follows a clean and maintainable **3-Layer Architecture**.  
It is designed to provide a simple and extensible REST API for a Helpdesk Ticket System.

---

## 🧱 Architecture Overview

The backend is structured using **Three-Layer Architecture**:

### 1. Presentation Layer (API Layer)
- Contains Express routes and controllers.
- Responsible for:
  - Receiving HTTP requests.
  - Parsing params, query, and body.
  - Mapping errors to appropriate HTTP status codes.
  - Returning HTTP responses.
- **No business logic** should be in this layer.

### 2. Application Layer (Service Layer)
- Contains all **business logic / use-cases** of the system.
- Responsible for:
  - Creating tickets with default values.
  - Validating status transition rules.
  - Processing filters, sorting, and pagination.
  - Coordinating repositories and domain logic.
- Does **not** know anything about HTTP or Express.

### 3. Persistence Layer (Repository Layer)
- Abstracts data access.
- Provides simple data operations:
  - findById, findAll (with criteria), create, update.
- Can be implemented using:
  - JSON file storage
  - In-memory storage
  - SQLite or other storage options if extended
- Contains **no business logic**—only data read/write.

---

## 🧩 Domain Layer
- Holds domain models, enums, and error definitions.
- Defines:
  - Ticket structure
  - Allowed status values
  - Domain-specific errors such as invalid transitions
- Independent from frameworks and storage.

---

## 📁 Project Structure (Simplified)

src/
api/ → presentation layer (routes + controllers)
application/ → business logic (services + DTOs)
domain/ → models, enums, domain errors
infrastructure/ → repositories + datastore adapter
config/ → environment settings, logger


---

## 🌐 API Style
- RESTful endpoints under `/api/tickets`.
- Supports:
  - Listing with filter, sort, pagination
  - Creating tickets
  - Updating info
  - Updating ticket status (with transition rules)
- No DELETE operation (per requirements).

---

## 🎯 Key Principles
- **Separation of Concerns**: Each layer has a single responsibility.
- **Replaceable datastore**: Repository pattern allows swapping storage easily.
- **Framework-isolated domain**: Business rules do not depend on Express.
- **Clean structure** for testing, scaling, and long-term maintenance.

---

## 🛠 Technology Stack
- Node.js
- Express.js
- JavaScript (ES Modules or CommonJS depending on preference)
- Optional: dotenv, nodemon, etc.

---

This backend design follows the requirements from the system specification and ensures clean, maintainable, and testable code.
