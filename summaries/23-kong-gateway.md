# 23 — Kong Gateway

**ไฟล์:** `23-kong-gateway.html` | **หมวด:** Infrastructure & Orchestration

## สิ่งที่จะได้เรียน

API Gateway ระดับ Production บน Nginx/OpenResty — Service, Route, Plugin, Consumer, Upstream, decK, Kong Ingress Controller

---

## เนื้อหาหลัก

### 1. Kong Gateway คืออะไร?
- API Gateway open-source สร้างบน **Nginx + OpenResty (Lua)**
- "ประตู" กลางระหว่าง clients กับ upstream services
- จัดการ cross-cutting concerns ทั้งหมดในที่เดียว — auth, rate limiting, logging

### 2. Kong ทำอะไรให้เราได้

| Feature | คำอธิบาย |
|---------|----------|
| **Authentication** | JWT, API Key, OAuth 2.0, Basic Auth, mTLS |
| **Rate Limiting** | จำกัด req/s ต่อ consumer/IP — ป้องกัน abuse |
| **Load Balancing** | Upstream targets หลายตัว + health check |
| **Observability** | Log ทุก request, Prometheus metrics, OpenTelemetry |
| **Transformation** | แก้ header/body ก่อนส่งไป upstream |
| **Security** | IP restriction, Bot detection, CORS |
| **Custom Plugins** | Lua หรือ Go PDK |

### 3. Ports สำคัญ

| Port | หน้าที่ |
|------|---------|
| **:8000** | HTTP Proxy — รับ traffic จาก client |
| **:8443** | HTTPS Proxy |
| **:8001** | Admin API — **ห้าม expose ออก public!** |
| **:8002** | Kong Manager (Web UI) |

### 4. Core Concepts (5 Building Blocks)

| Object | คำอธิบาย |
|--------|----------|
| **Service** | ตัวแทน upstream backend (host, port, path) |
| **Route** | กำหนดว่า request แบบไหน match → ส่งไป Service ไหน |
| **Plugin** | เพิ่ม functionality — ติดได้ที่ Global/Service/Route/Consumer |
| **Consumer** | ตัวแทน "ผู้เรียกใช้" API — เก็บ credentials, rate limit เฉพาะตัว |
| **Upstream/Target** | กลุ่ม backend servers สำหรับ load balance |

**Request Flow:**
```
Request → Route match → Plugins run → Service → Upstream → Target
```

### 5. Plugin Ecosystem (18 plugins ในไฟล์)

**Authentication:** JWT, Key Auth, OAuth 2.0
**Traffic Control:** Rate Limiting, Request Size Limiting, Proxy Cache
**Transformation:** Request Transformer, Response Transformer, CORS
**Logging:** File Log, HTTP Log, Prometheus
**Security:** IP Restriction, Bot Detection, mTLS
**Tracing:** OpenTelemetry
**Validation:** Request Validation
**Extensibility:** Custom Plugin (Go/Lua)

### 6. Deployment Modes

| Mode | คำอธิบาย | เหมาะกับ |
|------|----------|---------|
| **DB Mode** | Config ใน PostgreSQL — เปลี่ยน runtime ได้ | Traditional, มี Admin UI |
| **DB-less** | Config ใน YAML file — ไม่มี DB | K8s, GitOps, immutable |
| **Hybrid** | CP มี DB, DP stateless — CP/DP แยก | Multi-region, Enterprise |

### 7. decK — Declarative Config (แนะนำสำหรับ Production)
```bash
deck sync --kong-addr http://localhost:8001 --state kong.yaml
deck diff   # dry-run ดูก่อน
deck dump   # export config ปัจจุบัน
```

**kong.yaml structure:**
- `services` + nested `routes` + nested `plugins`
- `consumers` + credentials
- Global `plugins`
- ใช้ env var สำหรับ secrets: `"${JWT_SECRET}"`

### 8. Kong Ingress Controller (KIC) — K8s

```yaml
# KongPlugin CRD
apiVersion: configuration.konghq.com/v1
kind: KongPlugin
metadata:
  name: rate-limit
plugin: rate-limiting
config:
  minute: 100

# Ingress ใช้ annotation
metadata:
  annotations:
    konghq.com/plugins: "jwt-auth,rate-limit"
```

- ติดตั้งด้วย Helm: `helm install kong kong/ingress`
- **KongPlugin** — plugin ระดับ namespace
- **KongClusterPlugin** — plugin ระดับ cluster (แนะนำสำหรับ global plugins)
- **KongConsumer** — consumer ใน K8s

### 9. Go Service หลัง Kong
- Kong inject `X-Consumer-Id`, `X-Consumer-Username`, `X-Request-Id` headers
- Service ไม่ต้องทำ auth — Kong ทำให้
- Log ด้วย header เหล่านี้เพื่อ correlation

### 10. Custom Go Plugin (Kong PDK)
```go
// github.com/Kong/go-pdk
func (c *Config) Access(kong *pdk.PDK) {
    kong.Request.SetHeader("X-Team", c.TeamName)
}
func main() {
    server.StartServer(New, "1.0.0", 1000)
}
```

### 11. Admin API Cheatsheet (ย่อ)
```bash
# Service
curl -X POST :8001/services -d name=svc -d url=http://backend:8080
# Route
curl -X POST :8001/services/svc/routes -d "paths[]=/api/v1"
# Plugin บน service
curl -X POST :8001/services/svc/plugins -d name=rate-limiting -d config.minute=100
# Consumer
curl -X POST :8001/consumers -d username=app1
curl -X POST :8001/consumers/app1/jwt -d algorithm=HS256 -d secret=mysecret
```

### 12. Kong vs คู่แข่ง

| | Kong | Nginx | AWS API GW | Traefik |
|--|------|-------|-----------|---------|
| Plugin Ecosystem | ⭐⭐⭐ 60+ | manual | limited | middleware |
| Declarative Config | decK | limited | CDK/SAM | YAML |
| K8s Native (CRDs) | ✅ KIC | Ingress only | ❌ | ✅ |
| Custom Plugin (Go) | ✅ Go PDK | ❌ C only | ❌ | ✅ |
| Self-hosted OSS | ✅ | ✅ | ❌ | ✅ |

---

## Code ตัวอย่างที่มีในไฟล์
- Docker Compose (Kong + PostgreSQL)
- kong.yaml declarative config เต็ม
- Admin API commands ครบทุก object
- Kubernetes CRDs (KongPlugin, KongConsumer, Ingress)
- Go service ที่ใช้ Kong headers
- Custom Go Plugin ด้วย Kong PDK
