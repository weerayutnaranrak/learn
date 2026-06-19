# 01 — Domain Driven Design (DDD)

**ไฟล์:** `1-ddd.html` | **หมวด:** Design Principles & Patterns

## สิ่งที่จะได้เรียน

DDD คือแนวคิดที่ให้ Business Domain เป็นศูนย์กลางการออกแบบ — code ต้องสะท้อน business จริง ไม่ใช่แค่ CRUD

---

## เนื้อหาหลัก

### 1. DDD คืออะไร?
- ออกแบบ software ให้ตรงกับ business domain
- ใช้ภาษาเดียวกับ domain expert (**Ubiquitous Language**)
- แบ่งระบบใหญ่เป็น **Bounded Context** ย่อยๆ

### 2. Bounded Context
- แต่ละ context มี model และ language ของตัวเอง
- ตัวอย่าง: "Customer" ใน Sales context ≠ "Customer" ใน Support context
- ใช้ **Context Map** แสดงความสัมพันธ์ระหว่าง context

### 3. Tactical Patterns (Building Blocks)

| Pattern | คำอธิบาย |
|---------|----------|
| **Entity** | Object ที่มี identity ไม่เปลี่ยน แม้ attribute จะเปลี่ยน (เช่น User มี UserID) |
| **Value Object** | Object ที่ไม่มี identity — เปรียบเทียบด้วย value (เช่น Money, Address) |
| **Aggregate Root** | กลุ่ม Entity/VO ที่ถูกจัดการเป็นหน่วยเดียว มี entry point เดียว |
| **Repository** | Interface สำหรับ persist/retrieve Aggregate — ซ่อน DB logic |
| **Domain Service** | Business logic ที่ไม่เป็นของ Entity ใดเลย |
| **Domain Event** | เหตุการณ์ใน domain ที่เกิดขึ้นแล้ว เช่น `OrderPlaced` |

### 4. Entity vs Value Object
- **Entity:** มี ID, mutable, lifecycle ยาว เช่น `Order`, `User`
- **Value Object:** ไม่มี ID, immutable, compare ด้วย value เช่น `Money{100, "THB"}`

### 5. ตัวอย่าง Go — E-Commerce System
- `Order` เป็น Aggregate Root
- `OrderItem` เป็น Entity ใน Aggregate
- `Money` เป็น Value Object
- `OrderRepository` เป็น interface ซ่อน DB
- `OrderPlaced` เป็น Domain Event

### 6. DDD Layers
```
UI / API Layer
    ↓
Application Layer (Use Cases / Commands)
    ↓
Domain Layer (Entities, Value Objects, Domain Services) ← หัวใจ
    ↓
Infrastructure Layer (DB, External API, Messaging)
```

### 7. เมื่อไหร่ควรใช้ / ไม่ควรใช้

**ควรใช้เมื่อ:**
- Business logic ซับซ้อนมาก
- ต้องทำงานร่วมกับ domain expert
- ระบบใหญ่ มีหลาย subdomain

**ไม่ควรใช้เมื่อ:**
- CRUD application ง่ายๆ
- Team เล็ก เวลาน้อย
- Business rules ไม่ซับซ้อน

---

## Code ตัวอย่างที่มีในไฟล์
- Entity `Order` พร้อม business methods
- Value Object `Money` แบบ immutable
- `OrderRepository` interface + in-memory implementation
- Domain Event dispatch pattern
