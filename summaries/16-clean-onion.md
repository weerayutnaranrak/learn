# 16 — Clean Architecture & Onion Architecture

**ไฟล์:** `16-clean-onion.html` | **หมวด:** Design Principles & Patterns

## สิ่งที่จะได้เรียน

Business Logic อยู่ตรงกลาง ไม่ขึ้นกับ Framework หรือ DB — Dependency Rule, Layers, Go implementation ทั้งสองแบบ

---

## เนื้อหาหลัก

### 1. ปัญหาที่ทั้งสองแก้ไข
- **Business Logic ผูกติดกับ Framework** — เปลี่ยน Gin → Echo ต้องแก้ business code
- **Unit Test ทำยาก** — ต้อง spin up DB ก่อน test ได้
- **Architecture ไม่ "Scream"** — ดูโครงสร้างไม่รู้ว่า app ทำอะไร

### 2. The Dependency Rule (หัวใจสำคัญ)
> **Source code dependencies ต้องชี้เข้าหาศูนย์กลางเท่านั้น**

- Inner layers ไม่รู้จัก outer layers
- Outer layers implement interfaces ที่ inner layers กำหนด
- ถ้าต้อง outer → inner ให้ใช้ interface (Dependency Inversion)

### 3. Clean Architecture (Robert Martin)

```
┌─────────────────────────────────────┐
│  Frameworks & Drivers (outer)        │  DB, UI, Web, Devices
│  ┌───────────────────────────────┐   │
│  │  Interface Adapters           │   │  Controllers, Presenters, Gateways
│  │  ┌─────────────────────────┐  │   │
│  │  │  Application Use Cases  │  │   │  Business Rules (Application)
│  │  │  ┌─────────────────┐    │  │   │
│  │  │  │    Entities     │    │  │   │  Business Rules (Enterprise/Domain)
│  │  │  └─────────────────┘    │  │   │
│  │  └─────────────────────────┘  │   │
│  └───────────────────────────────┘   │
└─────────────────────────────────────┘
```

**4 Layers:**
- **Entities** — Business objects + rules (ไม่ depend อะไรเลย)
- **Use Cases** — Application business rules
- **Interface Adapters** — Convert data (Controller, Presenter, Repository interface)
- **Frameworks & Drivers** — DB, Web framework, External services

### 4. Onion Architecture (Jeffrey Palermo)

```
Domain Model (core)
    → Domain Services
        → Application Services
            → Infrastructure (outer ring)
```

- คล้าย Clean Arch แต่เน้น Domain Model ที่ center
- **Domain Layer** ไม่ขึ้นกับ Infrastructure เลย
- Infrastructure implements interfaces จาก Domain

### 5. เปรียบเทียบ 3 Architecture

| | Layered | Clean Arch | Onion Arch |
|--|---------|-----------|-----------|
| Dependency direction | top → down | inward | inward |
| Domain ขึ้นกับ DB? | ใช่ | ไม่ | ไม่ |
| Testability | ปานกลาง | สูงมาก | สูงมาก |
| Complexity | ต่ำ | สูง | สูง |

### 6. Go Code — Clean Architecture
- `Order` entity ใน innermost layer
- `CreateOrderUseCase` depend บน `OrderRepository` interface
- `PostgresOrderRepository` implement interface (outer layer)
- `OrderController` (HTTP) เรียก use case

### 7. Go Code — Onion Architecture
- `domain/` — Entity + Repository interface
- `application/` — Use Cases / Services
- `infrastructure/` — DB, HTTP, Email implementations

### 8. เลือกใช้เมื่อไหร่?
- **Clean Arch:** Enterprise app ที่ business logic ซับซ้อน ต้องการ test coverage สูง
- **Onion:** DDD-heavy project ที่ Domain เป็นหัวใจ
- **ไม่ต้องใช้:** CRUD simple app, prototype, startup MVP

---

## Code ตัวอย่างที่มีในไฟล์
- Clean Architecture ครบทุก layer ใน Go
- Onion Architecture ใน Go
- Unit test ที่ inject mock repository
- โครงสร้างไฟล์แนะนำ
