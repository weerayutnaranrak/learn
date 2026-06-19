# 12 — Repository Pattern

**ไฟล์:** `12-repository.html` | **หมวด:** Design Principles & Patterns

## สิ่งที่จะได้เรียน

แยก Data Access Logic ออกจาก Business Logic — เปลี่ยน DB ได้โดยไม่แก้ business code, test ง่ายขึ้นมาก

---

## เนื้อหาหลัก

### 1. Repository Pattern คืออะไร?
- สร้าง abstraction layer ระหว่าง Business Logic และ Data Store
- Business Logic คุยกับ Interface — ไม่รู้ว่า DB ข้างหลังคืออะไร
- Named after "Repository" — ที่เก็บ domain objects

### 2. ประโยชน์หลัก

| ประโยชน์ | อธิบาย |
|---------|--------|
| **Testability** | Test business logic โดย inject `InMemoryRepository` ไม่ต้องมี DB จริง |
| **Flexibility** | เปลี่ยนจาก MySQL → PostgreSQL → MongoDB โดยแก้แค่ implementation |
| **Separation of Concerns** | Business logic ไม่รู้เรื่อง SQL, ORM, connection |
| **Reusability** | Repository เดียวใช้ได้กับ HTTP handler, CLI, Worker |

### 3. Before vs After

**Before (ไม่ใช้ Repository):**
```go
func (s *OrderService) CreateOrder(o Order) error {
    db.Exec("INSERT INTO orders ...") // ผูกกับ SQL ตรงๆ
}
```

**After (ใช้ Repository):**
```go
type OrderRepository interface {
    Save(ctx context.Context, o Order) error
    FindByID(ctx context.Context, id string) (Order, error)
}
// Service ไม่รู้ DB — inject repository เข้ามา
func NewOrderService(repo OrderRepository) *OrderService { ... }
```

### 4. Repository Variants

| Variant | เมื่อไหร่ใช้ |
|---------|------------|
| **Generic Repository** | `Repository[T any]` — ทุก entity ใช้ interface เดียว |
| **Specific Repository** | `OrderRepository`, `UserRepository` — method เฉพาะ entity |
| **Decorator Repository** | Wrap repository ด้วย cache, logging |

### 5. ตัวอย่าง Go Code
- `UserRepository` interface พร้อม CRUD methods
- `PostgresUserRepository` implementation
- `InMemoryUserRepository` สำหรับ test
- Decorator: `CachingUserRepository` wrap ด้วย Redis cache

### 6. Best Practices

**ควรทำ:**
- Return domain objects ไม่ใช่ DB rows
- ใช้ `context.Context` เสมอ (timeout, cancellation)
- Interface อยู่ใน domain layer ไม่ใช่ infrastructure

**ระวัง:**
- ห้าม leak SQL/ORM ออกมาใน interface
- อย่าสร้าง generic repository ที่ใหญ่เกินไป
- `Unit of Work` pattern เมื่อต้องการ transaction ข้าม repositories

---

## Code ตัวอย่างที่มีในไฟล์
- Interface definition + 2 implementations (Postgres, InMemory)
- Decorator pattern (Cache wrapper)
- Unit test ที่ inject InMemory repository
