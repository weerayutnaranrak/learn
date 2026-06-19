# 11 — Service-Oriented Architecture (SOA)

**ไฟล์:** `11-soa.html` | **หมวด:** Architecture Styles

## สิ่งที่จะได้เรียน

แบ่งระบบเป็น Services ที่สื่อสารผ่าน Standard Protocol — predecessor ของ Microservices ใช้ใน Enterprise

---

## เนื้อหาหลัก

### 1. SOA คืออะไร?
- ระบบประกอบด้วย Services ที่ reusable และ interoperable
- สื่อสารผ่าน standard protocols (SOAP/REST)
- มี **Enterprise Service Bus (ESB)** เป็นตัวกลาง orchestrate
- เน้น **reuse** — service เดียวใช้ได้หลาย application

### 2. Enterprise Service Bus (ESB)
- ตัวกลางที่ services ทุกตัวต่อผ่าน
- ทำ routing, transformation, orchestration
- ตัวอย่าง: MuleSoft, IBM MQ, WSO2
- **ข้อเสีย:** Single point of failure, bottleneck

### 3. Service Contracts

| Contract | คำอธิบาย |
|---------|----------|
| **WSDL / OpenAPI** | กำหนด interface ที่ service expose |
| **Service Schema** | โครงสร้างข้อมูล input/output |
| **SLA Policy** | uptime, response time ที่รับประกัน |
| **Security Policy** | auth method, encryption |

### 4. SOA Design Patterns

| Pattern | คำอธิบาย |
|---------|----------|
| **Orchestration** | Central coordinator เรียก services ตามลำดับ |
| **Choreography** | Services ประสานงานกันเองผ่าน events |
| **Service Facade** | Wrapper ที่ simplify complex service |
| **Atomic Service** | service ทำ 1 อย่างเดียว |
| **Composite Service** | รวม atomic services เป็น process ใหม่ |
| **Process Service** | Long-running business process |

### 5. SOA vs Microservices

| | SOA | Microservices |
|--|-----|--------------|
| Communication | ESB (central) | Direct / Message Queue |
| Service size | ใหญ่กว่า | เล็กกว่า |
| Data | อาจ share DB | DB แยกต่อ service |
| Technology | มักเป็น Java/.NET | polyglot |
| Deploy | อาจ deploy พร้อมกัน | อิสระ |

### 6. เมื่อไหร่ควรใช้ SOA?

**เหมาะกับ:**
- Enterprise ที่มีระบบเดิม (legacy) หลายตัว
- ต้องการ integrate หลาย systems ด้วย standard protocol
- ต้องการ reuse service ข้าม applications

**ระวัง:**
- ESB อาจกลายเป็น bottleneck
- Overhead ของ SOAP/XML สูงกว่า REST/JSON
- ซับซ้อนกว่า Microservices ในบางกรณี

---

## Code ตัวอย่างที่มีในไฟล์
- Go service ที่ expose REST endpoint
- Service orchestration pattern
- Simple ESB-like router ใน Go
