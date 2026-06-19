# 10 — MVC Pattern

**ไฟล์:** `10-mvc.html` | **หมวด:** Architecture Styles

## สิ่งที่จะได้เรียน

Model-View-Controller — แยก Data, Presentation, Logic ออกจากกัน สถาปัตยกรรมยอดนิยมสำหรับ Web

---

## เนื้อหาหลัก

### 1. 3 ส่วนหลักของ MVC

| ส่วน | หน้าที่ | ตัวอย่าง Go |
|------|---------|-----------|
| **Model** | Data + Business rules — ไม่รู้จัก View | `Post`, `User` struct + DB logic |
| **View** | Presentation — แสดงผลข้อมูล | HTML template, JSON response |
| **Controller** | Bridge — รับ input, เรียก Model, ส่งไป View | HTTP Handler |

### 2. MVC Flow
```
User Action → Controller → Model (update/query)
                        ↓
                      View ← Model data
                        ↓
                    Response ← User
```

### 3. Variants ของ MVC

| Pattern | ต่างจาก MVC ตรงไหน |
|---------|-------------------|
| **MVP (Model-View-Presenter)** | Presenter รับผิดชอบ View logic ทั้งหมด — ทดสอบได้มากกว่า |
| **MVVM (Model-View-ViewModel)** | ViewModel เป็น data binding — ใช้ใน Vue/React/WPF |
| **MVC (API mode)** | ไม่มี View จริง — Controller return JSON แทน |

### 4. ตัวอย่าง Go — MVC Web Application
- **Model:** `Post` struct + `PostModel` ที่ query DB
- **Controller:** `PostController` HTTP handlers (Index, Show, Create)
- **View:** Go HTML templates หรือ JSON marshal

### 5. MVC ใน Context ต่างๆ

| Context | Model | View | Controller |
|---------|-------|------|-----------|
| Web (classic) | DB entity | HTML template | HTTP handler |
| REST API | DB entity | JSON response | HTTP handler |
| Desktop | Data struct | UI widget | Event handler |

### 6. สรุป

- **Model:** รู้เรื่อง data rules — ไม่รู้ว่า UI เป็นยังไง
- **View:** รู้แค่วิธีแสดง data — ไม่มี business logic
- **Controller:** รู้ทั้งคู่ แต่ไม่ควรมี logic เยอะ — thin controller

---

## Code ตัวอย่างที่มีในไฟล์
- Go HTTP server ด้วย `net/http`
- HTML template rendering
- JSON API response
- Router setup (path → controller mapping)
