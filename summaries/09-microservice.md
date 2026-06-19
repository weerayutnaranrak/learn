# 09 — Microservice Architecture

**ไฟล์:** `9-microservice.html` | **หมวด:** Architecture Styles / Distributed

## สิ่งที่จะได้เรียน

แบ่ง Application เป็น Services เล็กๆ อิสระ — deploy แยก, scale แยก, team แยก

---

## เนื้อหาหลัก

### 1. Monolith vs Microservices

| | Monolith | Microservices |
|--|---------|--------------|
| Deploy | ทั้ง app พร้อมกัน | แต่ละ service อิสระ |
| Scale | scale ทั้ง app | scale แค่ service ที่ bottleneck |
| Team | 1 team ดู codebase เดียว | แต่ละ team ดู service ตัวเอง |
| Failure | service ล่ม → app ล่มทั้งหมด | service ล่ม → isolate ได้ |
| Complexity | ง่ายกว่าตอนเริ่ม | ซับซ้อนกว่า — network, distributed tracing |

### 2. Microservice Building Blocks

| Component | หน้าที่ |
|-----------|---------|
| **API Gateway** | จุดเดียวที่ client เข้า — routing, auth, rate limit |
| **Service Discovery** | service ค้นหากันเองได้ (Consul, K8s Service) |
| **Message Bus** | async communication (Kafka, RabbitMQ) |
| **Circuit Breaker** | หยุดเรียก service ที่ล่ม ป้องกัน cascade failure |
| **Load Balancer** | กระจาย traffic ระหว่าง instances |
| **Observability** | Logs + Metrics + Traces รู้ว่าเกิดอะไรขึ้น |
| **Container Orchestration** | K8s จัดการ lifecycle ของ containers |
| **Service Mesh** | Istio/Linkerd จัดการ network ระหว่าง services |

### 3. Communication Patterns

**Synchronous (REST/gRPC):** เรียกแล้วรอ — ง่าย แต่ tight coupling
```
Order Service → (HTTP) → Payment Service → (HTTP) → Inventory Service
```

**Asynchronous (Events):** publish event แล้วไม่รอ — loose coupling แต่ eventual consistency
```
Order Service → publish "OrderPlaced" → Kafka → Payment Service
                                              → Inventory Service
                                              → Notification Service
```

### 4. ตัวอย่าง Go — Microservices จริง
- `OrderService` เรียก `PaymentService` ด้วย gRPC
- `NotificationService` subscribe Kafka topic
- Circuit Breaker ด้วย `sony/gobreaker`
- Health check endpoint

### 5. เมื่อไหร่ควรใช้ Microservices?

**ควรใช้เมื่อ:**
- ทีมใหญ่ ต้องการ deploy อิสระ
- Load ต่างกันมากในแต่ละส่วน
- Technology stack ต่างกันในแต่ละ domain

**ไม่ควรใช้เมื่อ:**
- ทีมเล็ก (< 5 คน)
- ยังไม่รู้ domain boundary ชัด
- เริ่มต้น project ใหม่ (start monolith ก่อน)

### 6. Saga Pattern (กับ Microservices)
- Distributed transaction ข้าม services
- Compensating transaction เมื่อ step ใด step หนึ่ง fail

---

## Code ตัวอย่างที่มีในไฟล์
- gRPC service definition + Go implementation
- Kafka producer/consumer
- Circuit Breaker pattern ใน Go
- Docker Compose สำหรับ run หลาย services
