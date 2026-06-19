# 19 — Testing Patterns

**ไฟล์:** `19-testing.html` | **หมวด:** Design Principles & Patterns

## สิ่งที่จะได้เรียน

Test Pyramid, TDD, Test Doubles (Stub/Mock/Fake/Spy), Table-driven Tests และ Integration Tests ใน Go

---

## เนื้อหาหลัก

### 1. Test Pyramid

```
        /\
       /E2E\         น้อย + ช้า + แพง
      /──────\
     /Integration\   ปานกลาง
    /──────────────\
   /   Unit Tests   \ เยอะ + เร็ว + ถูก
  /──────────────────\
```

- **Unit Tests:** test function/method เดียว ไม่ depend ภายนอก
- **Integration Tests:** test หลาย component ทำงานร่วมกัน (รวม DB, HTTP)
- **E2E Tests:** test ทั้ง system จาก user perspective

### 2. Test Doubles

| ประเภท | คำอธิบาย | ใช้เมื่อ |
|--------|----------|---------|
| **Stub** | Return hardcoded value — ไม่สนว่าถูกเรียกยังไง | ต้องการ dependency return ค่าที่กำหนด |
| **Mock** | Verify ว่าถูกเรียกถูกต้อง (method, args, จำนวนครั้ง) | ต้องการ assert interaction |
| **Fake** | Lightweight implementation จริง (InMemoryDB) | ต้องการ behavior จริงแต่ไม่ต้องการ external |
| **Spy** | Record calls แล้วส่งต่อของจริง | ต้องการ observe โดยไม่เปลี่ยน behavior |

### 3. Table-driven Tests (Go idiom)
```go
tests := []struct {
    name  string
    input int
    want  string
}{
    {"passing", 85, "B"},
    {"failing", 40, "F"},
}
for _, tt := range tests {
    t.Run(tt.name, func(t *testing.T) {
        got := grade(tt.input)
        if got != tt.want { t.Errorf(...) }
    })
}
```
- Go standard idiom — ใช้ทุกที่ใน standard library
- เพิ่ม test case ง่าย ไม่ต้องเขียน function ใหม่

### 4. TDD — Test Driven Development

**Red → Green → Refactor:**
1. **Red:** เขียน test ที่ fail ก่อน
2. **Green:** เขียน code minimal ที่สุดให้ test pass
3. **Refactor:** ปรับปรุง code โดยไม่ให้ test fail

**ประโยชน์:**
- Design ดีขึ้น — ต้อง think interface ก่อน implementation
- Test เป็น documentation ที่ live
- Refactor กล้าขึ้น — มี safety net

### 5. Integration Tests
- Test handler + service + DB ทำงานร่วมกัน
- ใน Go ใช้ `testcontainers-go` spin up PostgreSQL จริงใน Docker
- `httptest.NewRecorder()` สำหรับ test HTTP handlers
- `t.Cleanup()` สำหรับ cleanup resources

### 6. Quick Reference

| สถานการณ์ | ใช้อะไร |
|----------|---------|
| Test business logic | Unit test + Fake repository |
| Test HTTP handler | `httptest` + Mock service |
| Test DB queries | Integration test + real DB |
| Test multiple cases | Table-driven tests |
| Verify call count | Mock |
| Fast in-memory behavior | Fake |

---

## Code ตัวอย่างที่มีในไฟล์
- Table-driven tests ใน Go
- Mock implementation สำหรับ `UserRepository`
- Fake InMemory repository
- Integration test ด้วย `httptest`
- TDD cycle แสดง Red/Green/Refactor
