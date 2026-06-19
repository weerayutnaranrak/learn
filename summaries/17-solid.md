# 17 — SOLID Principles

**ไฟล์:** `17-solid.html` | **หมวด:** Design Principles & Patterns

## สิ่งที่จะได้เรียน

5 หลักการ OOP ที่ทำให้ code ยืดหยุ่น ทดสอบได้ และบำรุงรักษาง่าย — พร้อมตัวอย่าง Go แบบ before/after ทุกข้อ

---

## เนื้อหาหลัก

### 5 หลักการ SOLID

#### S — Single Responsibility Principle (SRP)
> คลาส/ฟังก์ชันควรมีเหตุผลในการเปลี่ยนแปลงเพียงอย่างเดียว

- **Before:** `UserService` ทำทั้ง business logic, send email, และ format report
- **After:** แยกเป็น `UserService`, `EmailService`, `ReportService`
- **ทดสอบ:** ถ้าเหตุผลเปลี่ยน class มีมากกว่า 1 → ผิด SRP

#### O — Open/Closed Principle (OCP)
> Open for extension, Closed for modification — เพิ่ม feature ได้โดยไม่แก้ code เดิม

- **Before:** `if type == "email" ... else if type == "sms"` — เพิ่ม type ต้องแก้ code เดิม
- **After:** `Notifier` interface — เพิ่ม `SlackNotifier` ใหม่โดยไม่แก้ส่วนอื่น
- **เครื่องมือ:** Interface + Dependency Injection

#### L — Liskov Substitution Principle (LSP)
> Subtype ต้องใช้แทน supertype ได้ โดยไม่เปลี่ยน correctness ของโปรแกรม

- **Before:** `Square` extend `Rectangle` แต่ `SetWidth` ของ Square เปลี่ยน Height ด้วย — ผิด behavior
- **After:** `Shape` interface แยก Square และ Rectangle อิสระ
- **ทดสอบ:** ถ้า subtype ต้อง override method แล้ว precondition เข้มกว่า → ผิด LSP

#### I — Interface Segregation Principle (ISP)
> Client ไม่ควรถูกบังคับ implement interface ที่ตัวเองไม่ใช้

- **Before:** `Animal` interface มี `Fly()`, `Swim()`, `Run()` — Dog ต้อง implement `Fly()`
- **After:** แยกเป็น `Flyer`, `Swimmer`, `Runner` — implement เฉพาะที่ใช้
- **หลักการ:** หลาย interface เล็กๆ ดีกว่า interface ใหญ่เดียว

#### D — Dependency Inversion Principle (DIP)
> High-level module ไม่ควร depend บน low-level module — ทั้งคู่ควร depend บน abstraction

- **Before:** `OrderService` import `MySQLOrderRepository` ตรงๆ
- **After:** `OrderService` depend บน `OrderRepository` interface — inject implementation เข้ามา
- **ผล:** เปลี่ยน DB ได้โดยไม่แก้ `OrderService`

### SOLID ทำงานร่วมกัน
- DIP → Inject dependencies → ทำให้ทำ OCP ได้ง่าย
- SRP → แยก concerns → ทำให้ทำ ISP ได้ดี
- LSP → ใช้ polymorphism ได้อย่างถูกต้อง

### SOLID กับ Architecture Patterns
- **Repository Pattern** → DIP (interface) + SRP (แยก data access)
- **Strategy Pattern** → OCP + DIP
- **Hexagonal Architecture** → DIP อย่างสุดขีด

### Quick Reference

| หลักการ | คำถามทดสอบ |
|---------|-----------|
| SRP | "class นี้มีกี่เหตุผลที่จะเปลี่ยน?" |
| OCP | "เพิ่ม feature ต้องแก้ code เดิมไหม?" |
| LSP | "แทน parent ด้วย child แล้ว break ไหม?" |
| ISP | "มี method ที่ implement แล้วไม่ใช้ไหม?" |
| DIP | "import concrete class ตรงๆ ไหม?" |

---

## Code ตัวอย่างที่มีในไฟล์
- Before/After code ทุกหลักการในภาษา Go
- Unit test ที่แสดงให้เห็นว่า SOLID ทำให้ test ง่ายขึ้น
