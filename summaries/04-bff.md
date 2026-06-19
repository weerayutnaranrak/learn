# 04 — Backend for Frontend (BFF)

**ไฟล์:** `4-bff.html` | **หมวด:** UI & Integration Patterns

## สิ่งที่จะได้เรียน

สร้าง Backend แยกสำหรับแต่ละ Client Type — แก้ปัญหา over-fetching, under-fetching และ coupling ระหว่าง client กับ microservices

---

## เนื้อหาหลัก

### 1. ปัญหาที่ BFF แก้

| ปัญหา | อธิบาย |
|-------|--------|
| **Over-fetching** | Mobile ได้ข้อมูลมากเกิน (data ที่ web ต้องการแต่ mobile ไม่ต้องการ) |
| **Under-fetching** | ต้อง call หลาย API เพื่อ render หน้าเดียว |
| **N+1 Client Calls** | Client ต้องเรียก service A → ได้ ID → เรียก service B ต่อ |
| **Coupling** | Client ต้องรู้ internal structure ของ microservices ทุกตัว |

### 2. แนวคิด BFF
```
Mobile App  →  Mobile BFF  →  [Order Svc, User Svc, Product Svc]
Web App     →  Web BFF     →  [Order Svc, User Svc, Product Svc]
3rd Party   →  Public API  →  [Order Svc, User Svc, Product Svc]
```

- แต่ละ BFF รู้จัก client ของตัวเองดีที่สุด
- Aggregate ข้อมูลจากหลาย service → ส่ง response เดียว
- Transform data ให้เหมาะกับ client (mobile อาจได้น้อยกว่า web)

### 3. ตัวอย่าง Go — Web BFF vs Mobile BFF

**Web BFF:** ส่ง full product detail + related products + reviews
**Mobile BFF:** ส่งแค่ thumbnail + price + rating (ประหยัด bandwidth)

### 4. เปรียบเทียบ Response Size
- Web: ~2KB (full data)
- Mobile: ~300 bytes (minimal data)
- ความต่าง 6x — สำคัญมากสำหรับ mobile network

### 5. ควรใช้เมื่อ / Trade-offs

**ควรใช้เมื่อ:**
- มี clients หลายประเภทที่ต้องการข้อมูลต่างกัน
- Mobile performance สำคัญ
- Microservices มีหลาย services ที่ต้อง aggregate

**Trade-offs:**
- เพิ่ม codebase — ต้องดูแล BFF แต่ละตัว
- อาจเกิด logic ซ้ำระหว่าง BFFs
- ต้องจัดการ auth ใน BFF ด้วย

---

## Code ตัวอย่างที่มีในไฟล์
- Go Web BFF handler ที่ call หลาย services แบบ parallel (goroutine)
- Go Mobile BFF ที่ return minimal struct
- Struct transformation จาก internal → external format
