# 03 — Event Driven Design

**ไฟล์:** `3-event-driven.html` | **หมวด:** Distributed & Communication Patterns

## สิ่งที่จะได้เรียน

ระบบที่ส่วนต่างๆ สื่อสารกันผ่าน Events แทน direct call — ทำให้ Loose Coupling และ Scale ได้ง่าย

---

## เนื้อหาหลัก

### 1. Event Driven คืออะไร?
- แทนที่จะเรียก service ตรงๆ → publish event แล้วให้ subscriber ทำงานต่อ
- **Asynchronous by default** — publisher ไม่รอ subscriber
- Event คือสิ่งที่ "เกิดขึ้นแล้ว" เช่น `OrderPlaced`, `PaymentCompleted`

### 2. ส่วนประกอบหลัก

| ส่วน | หน้าที่ |
|------|---------|
| **Event** | ข้อมูลที่บอกว่าเกิดอะไรขึ้น — immutable, past tense |
| **Publisher (Producer)** | สร้างและส่ง event เมื่อเกิด state change |
| **Subscriber (Consumer)** | รับ event และทำงานตามที่ตัวเองสนใจ |
| **Event Bus** | ตัวกลางส่ง event (Kafka, RabbitMQ, in-memory) |

### 3. ตัวอย่าง Go — Order Processing
- Order service publish `OrderPlaced` event
- Inventory service subscribe → ลด stock
- Notification service subscribe → ส่ง email
- ทั้งคู่ทำงานแบบ async ไม่รอกัน

### 4. Event Sourcing
- **แนวคิด:** แทนที่จะเก็บ state ปัจจุบัน → เก็บ sequence of events ทั้งหมด
- **Replay:** สร้าง state ใหม่ได้ตลอดเวลาจาก event log
- **Audit Trail:** รู้ว่าเกิดอะไรขึ้นทุก step
- ใช้ร่วมกับ CQRS เสมอ

### 5. CQRS (ใน Event Driven Context)
- Command เปลี่ยน state → publish event
- Event → update Read Model (projection)
- Query อ่านจาก Read Model โดยตรง (ไม่ผ่าน event)

### 6. เหมาะกับ / ความท้าทาย

**เหมาะกับ:**
- ระบบที่ต้องการ loose coupling ระหว่าง services
- Audit log / history สำคัญ
- Scale แต่ละส่วนอิสระ

**ความท้าทาย:**
- Eventual consistency — ข้อมูลอาจยังไม่ sync ทันที
- Debug ยากกว่า synchronous
- ต้องจัดการ duplicate events (idempotency)

---

## Code ตัวอย่างที่มีในไฟล์
- In-memory Event Bus พร้อม Subscribe/Publish
- Order service publish `OrderPlaced`
- Inventory + Notification subscriber handlers
- Event Sourcing aggregate pattern
