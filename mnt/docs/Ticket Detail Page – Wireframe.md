# Wireframe – Ticket Detail Page

## Objective
ให้ผู้ใช้ดูข้อมูล Ticket ทั้งหมด และสามารถแก้ไข/เปลี่ยนสถานะได้  
สอดคล้องกับ FR-002, FR-003, FR-007

---

## Layout Overview

+----------------------------------------------------------------------------------+
| Header Bar                                                                       |
+----------------------------------------------------------------------------------+
| Title Row                                                                         |
|  - Left: "#TCK-0001 – Ticket Title"                                              |
|  - Right: Status Badge (pending/accepted/Resolved/Rejected)                      |
+----------------------------------------------------------------------------------+
| Ticket Information Section                                                        |
|  - Title                                                                          |
|  - Description                                                                    |
|  - Contact Information (name / email / phone)                                    |
|  - Created At                                                                     |
|  - Updated At                                                                     |
+----------------------------------------------------------------------------------+
| Actions Section                                                                   |
|  - Edit Ticket (button)                                                           |
|  - Change Status (dropdown or buttons)                                           |
+----------------------------------------------------------------------------------+
| Optional: Notes / Comments / Activity Log                                         |
+----------------------------------------------------------------------------------+

## Interaction Notes
- Clicking Edit → /tickets/:id/edit
- Changing status → PATCH /tickets/:id/status
