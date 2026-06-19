# 06 — HTDP (How to Design Programs)

**ไฟล์:** `6-htdp.html` | **หมวด:** Design Principles & Patterns

## สิ่งที่จะได้เรียน

วิธีคิดและออกแบบโปรแกรมอย่างเป็นระบบด้วย Design Recipe 6 ขั้นตอน — คิดก่อน code เสมอ

---

## เนื้อหาหลัก

### 1. HTDP คืออะไร?
- หลักการจากหนังสือ "How to Design Programs" (Felleisen et al.)
- แก้ปัญหา "นักพัฒนา code ก่อนคิด" — เขียน code ก่อน understand problem
- ใช้ **Design Recipe** เป็น systematic approach

### 2. Design Recipe 6 ขั้นตอน

| Step | ชื่อ | ทำอะไร |
|------|------|---------|
| 1 | **Data Definition** | กำหนดโครงสร้างข้อมูล — type, struct, enum |
| 2 | **Signature + Purpose** | ลายเซ็น function + อธิบาย 1 บรรทัดว่าทำอะไร |
| 3 | **Examples** | เขียนตัวอย่าง input/output ก่อน code |
| 4 | **Template** | โครงสร้าง function ตาม data type (if/switch/loop) |
| 5 | **Body** | เขียน code จริงใน template |
| 6 | **Tests** | test จาก examples ที่กำหนดใน step 3 |

### 3. ตัวอย่างที่ 1 — Grade System
```
Step 1: type Grade = "A" | "B" | "C" | "D" | "F"
Step 2: func scoreToGrade(score int) Grade
Step 3: scoreToGrade(95) → "A", scoreToGrade(55) → "F"
Step 4: if score >= 80 ... else if ...
Step 5: เขียน body ตาม template
Step 6: TestScoreToGrade(t)
```

### 4. ตัวอย่างที่ 2 — Shopping Cart
- Data Definition: `CartItem`, `Cart` struct
- Signature: `func calculateTotal(cart Cart) Money`
- Examples: empty cart → 0, 2 items → sum
- Template: range over items
- Body + Tests

### 5. Key Principles

| หลักการ | ความหมาย |
|---------|----------|
| **Think Before Code** | Design Recipe บังคับคิดก่อน type |
| **Examples First** | เขียนตัวอย่างก่อน implement — เหมือน TDD |
| **Data Drives Design** | Structure ของ data กำหนด structure ของ code |
| **Small, Composable Functions** | แต่ละ function ทำ 1 อย่าง |
| **Explicit Contracts** | Signature ชัดเจน ไม่ ambiguous |
| **Tests as Specification** | Test บอก spec ของ function |

### 6. ความสัมพันธ์กับ TDD
- HTDP ≈ TDD แต่เน้น design มากกว่า
- Step 3 (Examples) = Red phase ของ TDD
- Step 6 (Tests) = Green + Refactor

---

## Code ตัวอย่างที่มีในไฟล์
- Grade system ครบทั้ง 6 steps ใน Go
- Shopping cart ครบทั้ง 6 steps
- Table-driven tests จาก examples
