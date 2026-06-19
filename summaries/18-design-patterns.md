# 18 — Design Patterns (Gang of Four)

**ไฟล์:** `18-design-patterns.html` | **หมวด:** Design Principles & Patterns

## สิ่งที่จะได้เรียน

6 patterns จาก Gang of Four ที่ใช้บ่อยที่สุด — Factory, Builder, Decorator, Strategy, Observer, Chain of Responsibility พร้อม Go code

---

## เนื้อหาหลัก

### ภาพรวม 3 กลุ่ม

| กลุ่ม | Focus | Patterns ในไฟล์ |
|------|-------|----------------|
| **Creational** | สร้าง objects | Factory Method, Builder |
| **Structural** | จัด structure | Decorator |
| **Behavioral** | การทำงานร่วมกัน | Strategy, Observer, Chain of Responsibility |

---

### 1. Factory Method (Creational)
- สร้าง object โดยไม่ระบุ concrete class ตรงๆ
- **ใช้เมื่อ:** ต้องสร้าง object แบบต่างๆ ตาม condition
```go
type Notifier interface { Send(msg string) error }
func NewNotifier(t string) Notifier {
    switch t {
    case "email": return &EmailNotifier{}
    case "sms":   return &SMSNotifier{}
    }
}
```

### 2. Builder (Creational)
- สร้าง complex object ทีละ step — chain method calls
- **ใช้เมื่อ:** Object มี optional fields เยอะ, constructor ใหญ่เกินไป
```go
query := NewQueryBuilder().
    Table("orders").
    Where("status", "pending").
    OrderBy("created_at", "DESC").
    Limit(10).
    Build()
```

### 3. Decorator (Structural)
- เพิ่ม behavior ให้ object โดยไม่แก้ class เดิม — wrap ซ้ำได้
- **ใช้เมื่อ:** ต้องการเพิ่ม feature ให้ object แบบ dynamic (logging, caching, retry)
```go
// Cache wrapper ครอบ repository เดิม
type CachingRepo struct { inner Repo; cache Cache }
func (c *CachingRepo) Find(id string) (User, error) {
    if v, ok := c.cache.Get(id); ok { return v, nil }
    u, err := c.inner.Find(id)
    c.cache.Set(id, u)
    return u, err
}
```

### 4. Strategy (Behavioral)
- กำหนด family of algorithms, encapsulate แต่ละตัว, แลกเปลี่ยนได้
- **ใช้เมื่อ:** มีหลาย algorithm ที่ทำงานแบบเดียวกัน แต่ implement ต่างกัน
```go
type SortStrategy interface { Sort(data []int) []int }
type Sorter struct { strategy SortStrategy }
func (s *Sorter) SetStrategy(st SortStrategy) { s.strategy = st }
// Runtime: s.SetStrategy(&QuickSort{}) หรือ &MergeSort{}
```

### 5. Observer (Behavioral)
- Object หนึ่ง (Subject) แจ้ง observers ทุกตัวเมื่อ state เปลี่ยน
- **ใช้เมื่อ:** Event-driven system, UI data binding, Domain Events
```go
type EventBus struct { listeners map[string][]func(Event) }
func (eb *EventBus) Subscribe(event string, fn func(Event)) { ... }
func (eb *EventBus) Publish(e Event) { // notify all listeners }
```

### 6. Chain of Responsibility (Behavioral)
- ส่ง request ผ่าน chain of handlers — แต่ละตัวตัดสินใจ handle หรือส่งต่อ
- **ใช้เมื่อ:** HTTP middleware, validation pipeline, approval workflow
```go
type Handler interface { Handle(req *Request) *Response }
type AuthMiddleware struct { next Handler }
func (a *AuthMiddleware) Handle(req *Request) *Response {
    if !isAuthenticated(req) { return Unauthorized() }
    return a.next.Handle(req)  // ส่งต่อถ้าผ่าน
}
```

### Pattern กับ SOLID
- **Factory:** OCP — เพิ่ม type ใหม่ไม่ต้องแก้ factory logic
- **Strategy:** OCP + DIP — algorithm ทั้งหมด depend บน interface
- **Decorator:** OCP — เพิ่ม feature โดยไม่แก้ code เดิม
- **Observer:** SRP — Subject ไม่ต้องรู้จัก observer แต่ละตัว

---

## Code ตัวอย่างที่มีในไฟล์
- ทุก pattern มี before/after code ใน Go
- Real-world scenario สำหรับแต่ละ pattern
- Unit test แสดงการใช้งาน
