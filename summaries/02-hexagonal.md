# 02 — Hexagonal Architecture (Ports & Adapters)

**ไฟล์:** `2-hexagonal.html` | **หมวด:** Architecture Styles

## สิ่งที่จะได้เรียน

แยก Business Logic ออกจาก Infrastructure ด้วย Ports และ Adapters — เปลี่ยน DB หรือ Framework ได้โดยไม่แตะ core

---

## เนื้อหาหลัก

### 1. ปัญหาที่ Hexagonal แก้
- **Business Logic ผูกกับ Database** — แก้ logic ต้องระวัง DB
- **Test ยาก** — ต้อง mock DB ทุกครั้ง
- **เปลี่ยน Technology ยาก** — อยากเปลี่ยนจาก MySQL → PostgreSQL ต้องแก้ทั้ง codebase

### 2. แนวคิดหลัก

```
         [ HTTP / gRPC ]          [ CLI ]
               ↓                     ↓
         Driving Adapter       Driving Adapter
               ↓                     ↓
         INPUT PORT            INPUT PORT
               ↓                     ↓
    ┌──────────────────────────────────────┐
    │        CORE / APPLICATION            │
    │    (Business Logic บริสุทธิ์)        │
    └──────────────────────────────────────┘
               ↓                     ↓
         OUTPUT PORT           OUTPUT PORT
               ↓                     ↓
         Driven Adapter        Driven Adapter
               ↓                     ↓
          [ Database ]          [ Email / SMS ]
```

| ส่วน | คำอธิบาย |
|------|----------|
| **Driving Side** | ฝั่งที่ start interaction (HTTP, CLI, Test) |
| **Driven Side** | ฝั่งที่ถูกเรียกใช้ (DB, Email, Queue) |
| **Driving Adapter** | HTTP Handler, CLI command — แปลง input → port call |
| **Driven Adapter** | DB implementation, Email sender — implement output port |
| **Port** | Interface ที่ core กำหนด ไม่รู้จัก implementation |

### 3. ตัวอย่าง Go — User Registration Service
- `UserService` (core) ใช้ `UserRepository` interface (output port)
- `PostgresUserRepository` (driven adapter) implement `UserRepository`
- `HTTPHandler` (driving adapter) รับ HTTP request → เรียก `UserService`
- Test ใช้ `InMemoryUserRepository` แทน Postgres ได้ทันที

### 4. เปรียบเทียบกับ Traditional Layered Architecture

| | Traditional | Hexagonal |
|--|------------|-----------|
| Dependency | Presentation → Business → DB | Core ไม่รู้จัก DB |
| Test | ต้อง mock หลายชั้น | Mock แค่ port |
| เปลี่ยน DB | แก้หลายไฟล์ | แก้แค่ adapter |

### 5. โครงสร้างไฟล์แนะนำ
```
/internal
  /core        ← Business logic + Port interfaces
  /adapters
    /http      ← Driving adapters
    /postgres  ← Driven adapters
    /inmem     ← Test adapters
```

---

## Code ตัวอย่างที่มีในไฟล์
- `UserRepository` interface (output port)
- `PostgresUserRepository` struct
- `UserService` core ที่ depend บน interface เท่านั้น
- HTTP handler ที่ inject service เข้าไป
