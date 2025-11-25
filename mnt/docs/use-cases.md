# Use Cases Document – Helpdesk Support Ticket System

> Mapping ตาม System Requirements (FR-001 → FR-008)  
> อ้างอิงจาก:  
> - Nipa_Fullstack Assignment-Test.pdf  
> - System_Requirements_Helpdesk.pdf  

---

## UC-001 – Create Ticket  
**Mapping:** FR-001  
**Actor:** User  
**Goal:** ผู้ใช้สร้าง Ticket ใหม่เพื่อแจ้งปัญหา

### Preconditions
- ผู้ใช้อยู่บนหน้า “Create Ticket”
- ระบบพร้อมรับข้อมูล

### Main Flow
1. User เปิดหน้า Create Ticket  
2. User กรอกข้อมูล:
   - title (required)
   - description (required)
   - contact (name/email/phone)
3. User กด "Create Ticket"
4. ระบบสร้างข้อมูลอัตโนมัติ:
   - id
   - createdAt
   - updatedAt = createdAt
   - status = "pending"
5. ระบบบันทึก ticket ลง datastore
6. ระบบ redirect ไปหน้า Ticket Detail

### Postconditions
- Ticket ถูกสร้างสำเร็จในสถานะ pending

---

## UC-002 – View Ticket Detail  
**Mapping:** FR-007  
**Actor:** User  
**Goal:** ดูรายละเอียดของ Ticket

### Preconditions
- Ticket ต้องมีอยู่จริง

### Main Flow
1. User เปิด /tickets/:id  
2. ระบบดึงข้อมูล Ticket  
3. ระบบแสดง: title, description, contact, timestamps, status

### Postconditions
- User เห็นข้อมูล Ticket ครบถ้วน

---

## UC-003 – Update Ticket Information  
**Mapping:** FR-002  
**Actor:** User  
**Goal:** แก้ไขข้อมูล Ticket

### Preconditions
- Ticket ต้องมีอยู่จริง

### Main Flow
1. User เปิดหน้า /tickets/:id/edit  
2. User แก้ไข title, description, contact  
3. User กด “Save changes”  
4. ระบบอัปเดตข้อมูล  
5. ระบบเปลี่ยน updatedAt timestamp  
6. Redirect กลับ Ticket Detail

### Postconditions
- Ticket ถูกแก้ไขและ timestamp อัปเดต

---

## UC-004 – Update Ticket Status  
**Mapping:** FR-003  
**Actor:** User  
**Goal:** เปลี่ยนสถานะของ Ticket

### Preconditions
- Ticket ต้องมีอยู่จริง
- ต้องเป็น transition ที่ถูกต้อง:
  - pending → accepted / rejected
  - accepted → resolved / rejected
  - resolved → final
  - rejected → final

### Main Flow
1. User เปิด Ticket Detail  
2. User เลือกสถานะใหม่จาก dropdown  
3. ระบบตรวจสอบ valid state transition  
4. ถ้าถูกต้อง → update status + updatedAt  
5. ระบบแสดงผลใหม่

### Alternative Flow
- ถ้า transition ผิดกฎ → ระบบแจ้ง error

### Postconditions
- สถานะถูกเปลี่ยนตาม workflow ที่กำหนด

---

## UC-005 – List Tickets  
**Mapping:** FR-004  
**Actor:** User  
**Goal:** ดูรายการ Ticket ทั้งหมด

### Preconditions
- ระบบมี datastore ให้ query ได้

### Main Flow
1. User เปิด /tickets  
2. ระบบดึง ticket ทั้งหมด  
3. Default sort = updatedAt DESC  
4. ระบบแสดง pagination

### Postconditions
- User เห็น ticket list ล่าสุด

---

## UC-006 – Sort Tickets  
**Mapping:** FR-005  
**Actor:** User  
**Goal:** เรียงลำดับ Ticket

### Main Flow
1. User เลือก Sort By:
   - Status (pending → accepted → resolved → rejected)
   - CreatedAt
   - UpdatedAt
2. User เลือก direction: ASC / DESC  
3. ระบบ sort และแสดงผลใหม่

### Postconditions
- Ticket list เรียงตามที่เลือก

---

## UC-007 – Filter Tickets  
**Mapping:** FR-006  
**Actor:** User  
**Goal:** ค้นหา Ticket ตามสถานะ

### Main Flow
1. User เลือก filter:
   - single status
   - multi status
   - all statuses (default)
2. ระบบ filter ticket ตามเงื่อนไข  
3. ระบบแสดงผล list ใหม่

### Postconditions
- ผู้ใช้เห็นเฉพาะ Ticket ที่ตรงตาม status filter

---

## UC-008 – No Delete Operation  
**Mapping:** FR-008  
**Actor:** User (implicit)  
**Goal:** ระบบต้องไม่อนุญาตลบ Ticket

### Main Flow
1. UI ไม่มีปุ่ม delete  
2. Backend ไม่มี endpoint DELETE  
3. ถ้ามี request DELETE → reject

### Postconditions
- Ticket ไม่ถูกลบในทุกกรณี

---

# Summary Mapping Table

| Use Case | System Requirement |
|----------|--------------------|
| UC-001 | FR-001 |
| UC-002 | FR-007 |
| UC-003 | FR-002 |
| UC-004 | FR-003 |
| UC-005 | FR-004 |
| UC-006 | FR-005 |
| UC-007 | FR-006 |
| UC-008 | FR-008 |

