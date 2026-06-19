# 21 — Saga Pattern

**ไฟล์:** `21-saga.html` | **หมวด:** Distributed & Communication Patterns

## สิ่งที่จะได้เรียน

Distributed Transaction ใน Microservices — Choreography vs Orchestration, Compensating Transactions, Outbox Pattern

---

## เนื้อหาหลัก

### 1. ปัญหา: Distributed Transaction

ใน Microservices ไม่มี ACID transaction ข้าม services — ถ้า step ใดล้มเหลว ต้อง "undo" ขั้นตอนก่อนหน้า

**ตัวอย่าง: Place Order**
1. Create Order ✅
2. Reserve Inventory ✅
3. Charge Payment ❌ (card declined)
→ ต้องยกเลิก Inventory reservation และ Cancel Order ด้วย

### 2. Saga Pattern
- แบ่ง distributed transaction เป็นหลาย **local transactions**
- แต่ละ step publish event เมื่อสำเร็จ
- ถ้า step ล้มเหลว → trigger **Compensating Transactions** ย้อนกลับ

### 3. Choreography-based Saga

```
Order Svc → "OrderCreated" → Inventory Svc → "InventoryReserved" → Payment Svc
                                                                         │
                                          "InventoryReleased" ←──────── │ ← "PaymentFailed"
                          "OrderCancelled" ←──────────────────
```

- ไม่มี central coordinator
- แต่ละ service ตัดสินใจเองตาม events ที่รับ
- **ข้อดี:** Loose coupling, ไม่มี single point of failure
- **ข้อเสีย:** Flow ยากติดตาม, เพิ่ม services ยาก

### 4. Orchestration-based Saga

```
Saga Orchestrator → Order Svc → InventorySvc → PaymentSvc
                  ← result    ← result       ← result/fail
                              ↓ (on fail)
                   trigger compensations
```

- Central **Saga Orchestrator** ควบคุม flow ทั้งหมด
- รู้ state ปัจจุบัน และ compensate เมื่อ fail
- **ข้อดี:** Flow ชัดเจน, debug ง่าย, control flow ดี
- **ข้อเสีย:** Orchestrator อาจ complex, coupling กับ services

### 5. Choreography vs Orchestration

| | Choreography | Orchestration |
|--|-------------|--------------|
| Coordinator | ไม่มี | มี (Orchestrator) |
| Coupling | Loose | Tighter |
| Debug | ยาก | ง่ายกว่า |
| Scale | ดีกว่า | อาจเป็น bottleneck |
| ใช้เมื่อ | Simple flow | Complex flow |

### 6. Outbox Pattern — ส่ง Event ได้แน่นอน

**ปัญหา:** Save DB แล้ว publish event ล้มเหลว → data inconsistent

**Outbox Solution:**
```
Transaction {
    INSERT INTO orders ...
    INSERT INTO outbox (event_type, payload) ...  ← ใน transaction เดียวกัน
}
Outbox Worker: อ่าน outbox → publish event → mark as sent
```

- ใช้ DB transaction เดียวกัน save data + event
- Worker แยกส่ง event ออก — retry ได้ถ้าล้มเหลว
- **Guarantee:** ส่ง event อย่างน้อย 1 ครั้ง (at-least-once delivery)

### 7. Compensating Transactions
- "undo" operation ที่ทำไปแล้ว
- ไม่ใช่ rollback จริง — เป็น new transaction ที่ยกเลิกผล
- ต้อง design compensating action สำหรับทุก step

---

## Code ตัวอย่างที่มีในไฟล์
- Choreography saga ด้วย Kafka events
- Orchestration saga orchestrator ใน Go
- Outbox pattern ใน Go + PostgreSQL
- Compensating transaction handlers
