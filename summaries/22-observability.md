# 22 — Observability

**ไฟล์:** `22-observability.html` | **หมวด:** Infrastructure & Orchestration

## สิ่งที่จะได้เรียน

3 Pillars — Logs, Metrics, Traces — รู้ว่าระบบเป็นอย่างไรโดยไม่ต้องเดา พร้อม Golden Signals

---

## เนื้อหาหลัก

### 1. 3 Pillars of Observability

| Pillar | คำถามที่ตอบ | เครื่องมือ |
|--------|-----------|-----------|
| **📄 Logs** | "WHAT happened?" — รายละเอียดเหตุการณ์ | slog, Loki, ELK |
| **📊 Metrics** | "HOW MUCH?" — ตัวเลขสรุปต่อเนื่อง | Prometheus, Grafana |
| **🔗 Traces** | "WHERE slow?" — ติดตาม request ข้าม services | OpenTelemetry, Jaeger, Tempo |

**ตัวอย่างว่าใช้อะไรเมื่อไหร่:**
- Logs → "ทำไม order #123 ถึงล้มเหลว?"
- Metrics → "error rate ชั่วโมงนี้เป็นเท่าไหร่?"
- Traces → "request ช้า — ช้าที่ service ไหน?"

### 2. Structured Logging (Go 1.21+ slog)

**Unstructured (ผิดหลักการ):**
```go
log.Printf("[ERROR] Order %s failed for user %s: %v", orderID, userID, err)
// grep ยาก — machine parse ไม่ได้
```

**Structured (ถูกหลักการ):**
```go
slog.Error("order failed",
    "order_id", orderID,
    "user_id", userID,
    "error", err,
)
// Output: {"level":"ERROR","order_id":"ord-123","user_id":"u-456","error":"..."}
```

- JSON output — query ด้วย Loki/CloudWatch ได้ทันที
- ใช้ `slog.NewJSONHandler` ใน production
- เพิ่ม `request_id`, `trace_id` ทุก log

### 3. Metrics — Prometheus

**4 Metric Types:**

| Type | ใช้กับ |
|------|--------|
| **Counter** | นับขึ้นอย่างเดียว (total requests, errors) |
| **Gauge** | ขึ้นลงได้ (memory usage, active connections) |
| **Histogram** | Distribution (request duration, response size) |
| **Summary** | เหมือน Histogram แต่ compute quantile บน client |

**ใน Go:**
```go
httpRequests := prometheus.NewCounterVec(
    prometheus.CounterOpts{Name: "http_requests_total"},
    []string{"method", "path", "status"},
)
httpRequests.WithLabelValues("GET", "/api/orders", "200").Inc()
```

### 4. Distributed Tracing — OpenTelemetry

```
Browser → Kong Gateway → Order Service → Payment Service → DB
   span1      span2            span3           span4       span5
   └────────────── trace_id: abc123 ──────────────────────────┘
```

- **Trace:** ตัวแทน request เดียวข้ามหลาย services
- **Span:** หน่วยงานเดียว (1 function call, 1 DB query)
- **Context Propagation:** ส่ง `traceparent` header ต่อกัน

**ใน Go:**
```go
ctx, span := tracer.Start(ctx, "process-order")
defer span.End()
span.SetAttributes(attribute.String("order.id", orderID))
```

### 5. Golden Signals (Google SRE)

| Signal | Metric | Alert เมื่อ |
|--------|--------|------------|
| **Latency** | p99 response time | > 500ms |
| **Traffic** | requests/second | sudden drop |
| **Errors** | error rate % | > 1% |
| **Saturation** | CPU/Memory % | > 80% |

### 6. Stack แนะนำ

| Layer | Tool |
|-------|------|
| Logs | `slog` → Loki → Grafana |
| Metrics | Prometheus → Grafana |
| Traces | OpenTelemetry → Tempo → Grafana |
| Alerting | AlertManager → PagerDuty/Slack |

---

## Code ตัวอย่างที่มีในไฟล์
- `slog` JSON handler setup ใน Go
- Prometheus Counter/Histogram registration + middleware
- OpenTelemetry tracer setup + span creation
- HTTP middleware ที่ inject request_id + log + trace
