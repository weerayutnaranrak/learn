# 27 — 4 รูปแบบสถาปัตยกรรม: Monolith, Modular Monolith, Distributed Monolith, Microservices

**ไฟล์:** `27-monolith-microservices.html` | **หมวด:** Distributed & Communication Patterns

## สิ่งที่จะได้เรียน

เปรียบเทียบ 4 รูปแบบสถาปัตยกรรมหลักพร้อม trade-offs — เข้าใจว่าแต่ละแบบเหมาะกับสถานการณ์ไหน และรู้จัก Distributed Monolith ซึ่งเป็น anti-pattern ที่พบบ่อยที่สุดเมื่อทีมย้ายสู่ microservices

---

## เนื้อหาหลัก

### 1. Monolith (แบบดั้งเดิม)

ทุก module รวมอยู่ใน codebase เดียว deploy เป็น binary เดียว เชื่อม DB เดียว

| ข้อดี | ข้อเสีย |
|-------|---------|
| พัฒนาและ debug ง่าย | ต้อง deploy ทั้งหมดพร้อมกัน |
| ต้นทุน ops ต่ำมาก | scale ทั้งหมดหรือไม่ scale |
| ทดสอบ end-to-end ง่าย | codebase ยิ่งใหญ่ยิ่งจัดการยาก |
| ไม่มี network latency ระหว่าง module | bug หนึ่งล้มทั้งระบบ |
| เหมาะ startup / MVP | ล็อก tech stack ทั้ง app |

**Code pattern:** Handler + Service + Repository อยู่ในโปรเจกต์เดียว เรียกกันโดยตรง

### 2. Modular Monolith

Deploy เป็น binary เดียวเหมือนเดิม แต่แบ่ง codebase เป็น module ที่มีขอบเขตชัดเจน สื่อสารกันผ่าน interface เท่านั้น ห้าม import package ข้ามโดยตรง

**โครงสร้าง:**
```
shop/
├── cmd/main.go          ← wire all modules together
└── internal/
    ├── order/           ← order module
    │   ├── service.go
    │   └── repository.go
    ├── payment/         ← payment module
    └── user/            ← user module
```

**Key rule:** `order.Service` รู้จัก `PaymentModule` interface เท่านั้น ไม่ import `payment` package โดยตรง

| ข้อดี | ข้อเสีย |
|-------|---------|
| ขอบเขต module ชัดเจน | ยังต้อง deploy พร้อมกัน |
| refactor ไป microservices ได้ง่าย | shared DB อาจ bottleneck |
| ops ยังง่าย | ต้องวินัยสูง |
| ทีม own module ชัดเจน | scale ทั้งหมด |

### 3. Distributed Monolith ⚠️ (Anti-pattern)

**สิ่งที่ไม่ควรทำ** — แยก service แต่ยัง tightly coupled ทำให้ได้ worst of both worlds

**สัญญาณเตือน (Red Flags):**
- Services ต้อง deploy พร้อมกันเสมอ
- Service A ล้ม → Service B ล้มตาม (cascade failure)
- Synchronous HTTP chain: A → B → C
- Services ใช้ DB เดียวกัน (shared DB)
- Service รู้โครงสร้าง DB ของ service อื่น
- เปลี่ยน API ตัวหนึ่งต้อง redeploy ทุกตัว

**ผลเสีย:**
- Network latency ของ microservices + ความเปราะบางของ monolith
- Ops ซับซ้อนมาก แต่ไม่ได้ประโยชน์ microservices
- Distributed transaction โดยไม่มีทางแก้

**วิธีแก้:** Revert กลับเป็น Monolith → เข้าใจ domain boundary → refactor ใหม่อย่างถูกต้อง

### 4. Microservices

แต่ละ service อิสระจริงๆ — มี DB ของตัวเอง, deploy lifecycle เป็นอิสระ, สื่อสาร async ผ่าน event/message bus

**Core components:** API Gateway · DB per Service · Message Bus (Kafka) · Service Discovery · Observability

**Communication pattern:**
```
Order Service → publish "order.created" → Kafka → Payment Service
                                                 → Notification Service
```

| ข้อดี | ข้อเสีย |
|-------|---------|
| Deploy แต่ละ service อิสระ | Ops ซับซ้อนมาก |
| Scale แยกต่อ service | Distributed tracing ยาก |
| Fault isolation จริงๆ | Eventual consistency |
| ทีมทำงานอิสระ (Conway's Law) | Integration test ยาก |
| ใช้ tech ต่างกันต่อ service | ไม่เหมาะทีมเล็ก |

### 5. ตารางเปรียบเทียบ 9 มิติ

| มิติ | Monolith | Modular Monolith | Distributed Monolith | Microservices |
|------|----------|------------------|---------------------|---------------|
| Deployment unit | binary เดียว | binary เดียว | หลาย service (พร้อมกัน) ❌ | หลาย service (อิสระ) ✅ |
| Team size | 1–5 คน | 5–20 คน | ❌ ไม่เหมาะ | 20+ คน |
| Scalability | scale ทั้งหมด | scale ทั้งหมด | scale ยาก ❌ | scale แยกต่อ service ✅ |
| Data isolation | shared DB | shared DB | shared DB ❌ | DB per service ✅ |
| Fault isolation | ต่ำ | ปานกลาง | ต่ำมาก ❌ | สูง ✅ |
| Dev complexity | ต่ำ | ปานกลาง | สูงมาก ❌ | สูง |
| Ops complexity | ต่ำ | ต่ำ | สูงมาก ❌ | สูงมาก |
| Testing | ง่าย | ง่าย–ปานกลาง | ยาก ❌ | ยาก (contract test) |
| เหมาะกับ | startup, MVP | growth stage | ❌ หลีกเลี่ยง | large scale enterprise |

### 6. เลือกแบบไหน?

- **Monolith:** startup / MVP / ทีม < 5 คน / ยังไม่รู้ domain boundary
- **Modular Monolith:** ทีม 5–20 คน / ต้องการ code organization / ยังไม่พร้อม ops overhead
- **Distributed Monolith:** ❌ หลีกเลี่ยงเสมอ — ถ้าพบสัญญาณให้ revert กลับ monolith แล้วออกแบบใหม่
- **Microservices:** ทีมใหญ่ / scale ต่างกัน / domain boundary ชัด / DevOps โต

**Key Insight (Sam Newman):** สถาปัตยกรรม microservices ที่สำเร็จส่วนใหญ่เริ่มเป็น monolith ก่อน แล้วค่อย extract services เมื่อเข้าใจ domain และมีความต้องการ scale จริงๆ

---

## Code ตัวอย่างที่มีในไฟล์

- `monolith/main.go` — Handler + Service + Repository ใน file เดียว
- `shop/internal/order/service.go` — Modular Monolith ด้วย PaymentModule interface
- `shop/cmd/main.go` — Wire all modules เข้าด้วยกัน ใน binary เดียว
- `order-service/main.go` — Distributed Monolith anti-pattern: synchronous HTTP chain
- `order-service/service.go` — Microservices: publish event แทน sync call
- `payment-service/handler.go` — Microservices: subscribe และ handle event อิสระ
