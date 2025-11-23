# Wireframe – Tickets List Page

## Objective
หน้ารวม Tickets สำหรับ:
- ดูรายการ Ticket ทั้งหมด
- Filter ตาม Status
- Sort ตามเกณฑ์ต่าง ๆ
- เข้าสู่หน้า Create / Detail
- รองรับ pagination

---

## Layout Overview (Desktop)

+----------------------------------------------------------------------------------+
|  Header Bar                                                                      |
|  - Left: Logo / App Name (e.g., "Helpdesk")                                     |
|  - Right: User info / placeholder                                               |
+----------------------------------------------------------------------------------+
|  Page Title Row                                                                  |
|  - Left: "Tickets"                                                               |
|  - Right: Button: "+ Create Ticket"                                              |
+----------------------------------------------------------------------------------+
|  Filter & Sort Bar                                                               |
|  - Status Filter: Dropdown (single/multi status)                                 |
|  - Sort By: Dropdown (Created / Updated / Status, ASC/DESC)                      |
|  - View Toggle: [List] [Board] (optional)                                        |
+----------------------------------------------------------------------------------+
|  Tickets Table / List                                                            |
|  Columns (example):                                                              |
|    - Ticket ID                                                                   |
|    - Title                                                                       |
|    - Status (badge)                                                              |
|    - Created At                                                                  |
|    - Updated At                                                                  |
|                                                                                |
|  Each row is clickable → navigate to Ticket Detail                               |
+----------------------------------------------------------------------------------+
|  Pagination                                                                      |
|  - Prev page / Next page                                                         |
|  - Page numbers                                                                  |
+----------------------------------------------------------------------------------+

---

## Sections Detail

### 1. Header Bar
- Fixed height (e.g., 64 px)
- Content:
  - Left: Text logo "Helpdesk" หรือ placeholder
  - Right: Circle avatar + username (placeholder)

### 2. Page Title Row
- Left:
  - Text: "Tickets" (H1)
- Right:
  - Button: "+ Create Ticket"
  - ใช้เพื่อไปหน้า Create Ticket

### 3. Filter & Sort Bar
- Elements:
  - Dropdown: "Status filter"
    - default: All statuses
  - Dropdown: "Sort by"
    - Created time / Updated time / Status
  - Optional: Toggle view
    - [List] [Board]

### 4. Tickets Table / List
- Header row:
  - Ticket ID
  - Title
  - Status
  - Created At
  - Updated At
- 3–5 sample rowsเพื่อใช้เป็น mock data
- แถวแต่ละอัน = clickable area → Ticket Detail

### 5. Pagination
- Text/Buttons:
  - "< Prev" | "1" "2" "3" | "Next >"
- อยู่ด้านล่างสุดของ content

---

## Interaction Notes (Wireframe Level)

- Clicking "+ Create Ticket" → ไปหน้า Create Ticket
- Clicking a row in table → ไปหน้า Ticket Detail
- Changing Status filter → refresh list
- Changing Sort By → re-order list
- (Optional) Switching to "Board" → ไป Kanban Board view

