# 20 — Go Concurrency Patterns

**ไฟล์:** `20-concurrency.html` | **หมวด:** Go Concurrency Patterns

## สิ่งที่จะได้เรียน

Worker Pool, Pipeline, Fan-out/Fan-in, Semaphore, Context Cancellation — ใช้ Goroutine + Channel อย่างปลอดภัยไม่ leak

---

## เนื้อหาหลัก

### ภาพรวม Patterns

| Pattern | ปัญหาที่แก้ |
|---------|------------|
| **Worker Pool** | จำกัดจำนวน goroutines ไม่ให้ระบบ overload |
| **Pipeline** | ประมวลผลข้อมูลเป็นขั้นตอน แต่ละ stage ทำงานพร้อมกัน |
| **Fan-out / Fan-in** | กระจายงานและรวมผลลัพธ์กลับ |
| **Semaphore** | ควบคุมจำนวน concurrent operations (เช่น DB connections) |
| **Context Cancellation** | หยุดงานที่กำลังทำอยู่เมื่อ timeout หรือ cancel |

---

### 1. Worker Pool
```go
jobs := make(chan Job, 100)
results := make(chan Result, 100)

// Start N workers
for i := 0; i < numWorkers; i++ {
    go func() {
        for job := range jobs {
            results <- process(job)
        }
    }()
}
// Send jobs, close channel when done
// Collect results
```
- **เหมาะกับ:** Image processing, bulk email, API scraping
- ป้องกัน goroutine explosion

### 2. Pipeline
```
Stage 1 (generate) → chan → Stage 2 (process) → chan → Stage 3 (sink)
```
- แต่ละ stage รัน goroutine ของตัวเอง
- ส่งข้อมูลผ่าน channels
- ใช้ `done` channel สำหรับ cancellation

### 3. Fan-out / Fan-in
```
              ┌─ Worker 1 ─┐
Input chan ───┤─ Worker 2 ─├──► Merged output chan
              └─ Worker 3 ─┘
```
- **Fan-out:** กระจาย input ไปหลาย goroutines
- **Fan-in:** รวม outputs จากหลาย channels เป็น 1
- ใช้ `sync.WaitGroup` + merge goroutine

### 4. Semaphore
```go
sem := make(chan struct{}, maxConcurrent)
sem <- struct{}{}  // acquire
defer func() { <-sem }()  // release
```
- ใช้ buffered channel เป็น semaphore
- จำกัด concurrent DB connections, API calls
- หรือใช้ `golang.org/x/sync/semaphore`

### 5. Context Cancellation
```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

select {
case result := <-doWork(ctx):
    // use result
case <-ctx.Done():
    return ctx.Err()  // timeout หรือ cancelled
}
```
- ส่ง `ctx` ให้ทุก function ที่ทำงาน async
- `context.WithTimeout` — หมดเวลาอัตโนมัติ
- `context.WithCancel` — cancel ด้วยมือ

### 6. Quick Reference — Common Mistakes

| ผิด | ถูก |
|-----|-----|
| Goroutine leak — start goroutine แล้วไม่ stop | ใช้ done channel หรือ context |
| Race condition — read/write shared variable ไม่ sync | ใช้ `sync.Mutex` หรือ channel |
| Deadlock — goroutine รอกัน circular | ตรวจ channel send/receive balance |
| Close channel สองครั้ง | ปิดครั้งเดียว จาก producer เท่านั้น |

---

## Code ตัวอย่างที่มีในไฟล์
- Worker Pool พร้อม graceful shutdown
- 3-stage Pipeline
- Fan-out/Fan-in merge function
- Semaphore ด้วย buffered channel
- Context timeout + cancellation propagation
