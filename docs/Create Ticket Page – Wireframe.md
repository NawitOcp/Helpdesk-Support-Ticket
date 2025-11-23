# Wireframe – Create Ticket Page

## Objective
ให้ผู้ใช้สร้าง Ticket ใหม่ตาม FR-001

---

## Layout Overview

+----------------------------------------------------------------------------------+
| Header Bar                                                                       |
+----------------------------------------------------------------------------------+
| Page Title: "Create Ticket"                                                      |
+----------------------------------------------------------------------------------+
| Form Section                                                                      |
|  - Input: Title (text)                                                            |
|  - Input: Description (textarea)                                                  |
|  - Input: Contact Name                                                            |
|  - Input: Contact Email                                                           |
|  - Input: Contact Phone (optional)                                                |
+----------------------------------------------------------------------------------+
| Action Buttons                                                                    |
|  - Create (primary button)                                                        |
|  - Cancel (secondary button → back to list)                                       |
+----------------------------------------------------------------------------------+

## Interaction Notes
- Submit → POST /api/tickets
- System sets id, status="pending", createdAt, updatedAt
- Cancel → /tickets
