# 13 — CQRS (Command Query Responsibility Segregation)

**ไฟล์:** `13-cqrs.html` | **หมวด:** Design Principles & Patterns

## สิ่งที่จะได้เรียน

แยก Write Model และ Read Model ออกจากกัน — scale และ optimize ได้อิสระ ใช้คู่กับ Event Sourcing

---

## เนื้อหาหลัก

### 1. CQRS คืออะไร?
- **Command** = เปลี่ยน state (Create, Update, Delete) — ไม่ return ข้อมูล
- **Query** = อ่านข้อมูล (Read) — ไม่เปลี่ยน state
- แยก Model สำหรับแต่ละด้าน — Write Model ≠ Read Model

### 2. Concepts ที่เกี่ยวข้อง

| Concept | คำอธิบาย |
|---------|----------|
| **Command** | Intent เปลี่ยน state — `PlaceOrderCommand` |
| **Query** | ขอข้อมูล — `GetOrderByIDQuery` |
| **Domain Event** | บอกว่าเกิดอะไรขึ้นหลัง command — `OrderPlacedEvent` |
| **Projection / Read Model** | ข้อมูลที่ optimize ไว้สำหรับ query |
| **Command Handler** | รับ command → validate → apply business logic → persist |
| **Query Handler** | อ่าน read model ตรงๆ — ไม่ผ่าน domain |
| **Event Handler / Projector** | รับ event → update read model |

### 3. Architecture

```
Client
  │
  ├─► Command → Command Handler → Aggregate → Domain Event
  │                                               │
  │                                         Event Store
  │                                               │
  │                                         Projector → Read Model DB
  │
  └─► Query → Query Handler → Read Model DB → Result
```

### 4. CQRS + Event Sourcing

| ประโยชน์ | อธิบาย |
|---------|--------|
| **Complete Audit Trail** | ทุก event เก็บไว้ — รู้ว่าใครทำอะไรเมื่อไหร่ |
| **Replay & Rebuild** | Replay events สร้าง state ใหม่ได้ตลอดเวลา |
| **Debugging** | ย้อนดูว่า state เปลี่ยนยังไงใน timeline |
| **Multiple Projections** | สร้าง Read Model หลายแบบจาก event เดียวกัน |

### 5. ตัวอย่าง Go
- `PlaceOrderCommand` + `PlaceOrderCommandHandler`
- `GetOrderQuery` + `GetOrderQueryHandler`
- `OrderAggregate` + `OrderPlacedEvent`
- `OrderProjector` update Read Model ใน PostgreSQL/Redis

### 6. เมื่อไหร่ควรใช้ CQRS?

**เหมาะกับ:**
- Read/Write load ต่างกันมาก (scale แยก)
- Complex queries ที่ต้องการ optimized read model
- ระบบที่ต้องการ audit trail สมบูรณ์

**ระวัง:**
- Eventual consistency — read model อาจ lag หลัง write
- Complexity เพิ่มขึ้นมาก — ไม่เหมาะกับ CRUD ง่ายๆ
- Infrastructure เพิ่ม (event store, message queue)

---

## Code ตัวอย่างที่มีในไฟล์
- Command/Query/Handler interfaces
- Aggregate ที่ emit events
- Projector ที่อัพเดต read model
- In-memory event store
