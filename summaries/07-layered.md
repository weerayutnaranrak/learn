# 07 — Layered / N-Tier Architecture

**ไฟล์:** `7-layered.html` | **หมวด:** Architecture Styles

## สิ่งที่จะได้เรียน

สถาปัตยกรรมคลาสสิกที่แบ่ง application เป็นชั้นๆ — Presentation, Business, Data Access มีหน้าที่ชัดเจนแต่ละชั้น

---

## เนื้อหาหลัก

### 1. Layered Architecture คืออะไร?
- แบ่ง code ออกเป็น horizontal layers
- แต่ละ layer มีหน้าที่เดียว และ depend ลงไปชั้นล่างเท่านั้น
- สถาปัตยกรรมยอดนิยม — เข้าใจง่าย สอนได้ง่าย

### 2. รูปแบบต่างๆ

| รูปแบบ | Layers |
|--------|--------|
| **2-Tier** | Client → Database |
| **3-Tier** | Presentation → Business Logic → Data Access |
| **N-Tier** | เพิ่ม layer เช่น API Gateway, Cache, Message Queue |

### 3. 3-Tier Classic

```
┌─────────────────────┐
│  Presentation Layer  │  HTTP Handlers, Templates, JSON response
├─────────────────────┤
│  Business Layer      │  Use Cases, Validation, Domain Logic
├─────────────────────┤
│  Data Access Layer   │  Repository, DB queries, ORM
└─────────────────────┘
```

### 4. กฎหลัก
- **One-Direction Dependency:** Presentation → Business → Data, ห้ามย้อนกลับ
- **Encapsulation:** แต่ละ layer ซ่อน implementation จาก layer อื่น
- **Reusability:** Business layer ใช้ได้กับหลาย Presentation (HTTP + CLI)
- **Testability:** test แต่ละ layer แยกกันได้

### 5. ตัวอย่าง Go — Blog Application
- **Presentation:** `PostHandler` รับ HTTP request → call service
- **Business:** `PostService` validate, apply business rules
- **Data Access:** `PostRepository` query DB

### 6. เหมาะกับ / ข้อจำกัด

**เหมาะกับ:**
- Web applications ทั่วไป
- Team ที่คุ้นเคย layered architecture
- Project ขนาดกลาง

**ข้อจำกัด:**
- Monolithic — scale ทั้ง app ไม่ได้ scale ทีละ layer
- Business layer อาจอ้วนถ้าไม่จัดการดี
- ถ้า layer เยอะเกินไป → performance overhead

---

## Code ตัวอย่างที่มีในไฟล์
- `PostRepository` interface + PostgreSQL implementation
- `PostService` with business logic
- `PostHandler` HTTP handler
- สาธิต dependency injection ผ่าน constructor
