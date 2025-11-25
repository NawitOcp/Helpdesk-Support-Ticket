# Wireframe – Edit Ticket Page

## Objective
สำหรับแก้ไขข้อมูล Title, Description, Contact ตาม FR-002

---

## Layout Overview

+----------------------------------------------------------------------------------+
| Header Bar                                                                       |
+----------------------------------------------------------------------------------+
| Page Title: "Edit Ticket"                                                        |
+----------------------------------------------------------------------------------+
| Form Section (pre-filled with existing values)                                   |
|  - Input: Title                                                                   |
|  - Input: Description                                                              |
|  - Input: Contact Name                                                             |
|  - Input: Contact Email                                                            |
|  - Input: Contact Phone                                                            |
+----------------------------------------------------------------------------------+
| Action Buttons                                                                    |
|  - Save Changes (primary button)                                                  |
|  - Cancel (go back to Ticket Detail)                                              |
+----------------------------------------------------------------------------------+

## Interaction Notes
- Save → PUT /api/tickets/:id
- updatedAt ต้องถูกอัปเดตอัตโนมัติ
- Cancel → /tickets/:id
