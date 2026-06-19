# 08 — Client-Server Pattern

**ไฟล์:** `8-client-server.html` | **หมวด:** Distributed & Communication Patterns

## สิ่งที่จะได้เรียน

รากฐานของระบบ networked ทุกประเภท — Client (ผู้ขอ) และ Server (ผู้ให้บริการ) สื่อสารกันผ่าน protocol

---

## เนื้อหาหลัก

### 1. Client-Server คืออะไร?
- Client ส่ง request → Server ประมวลผล → ส่ง response กลับ
- รากฐานของ Web, API, Database, Email ทุกระบบ
- แบ่งหน้าที่ชัด: Client = UI/Logic, Server = Data/Processing

### 2. ประเภทของ Client

| ประเภท | คำอธิบาย |
|--------|----------|
| **Thin Client** | ทำน้อย — แค่ render ข้อมูลจาก server (Browser แบบ old-school) |
| **Fat/Rich Client** | มี logic ของตัวเอง — Desktop app, SPA, Mobile |
| **API Client** | เรียก API เพื่อรับข้อมูล — Backend service, Mobile app |

### 3. ประเภทของ Server

| ประเภท | หน้าที่ |
|--------|---------|
| **Web Server** | Serve static files, HTML (Nginx, Apache) |
| **Application Server** | Business logic, API (Go, Node, Java) |
| **Database Server** | Persist data (PostgreSQL, MySQL) |
| **Cache Server** | In-memory fast storage (Redis) |

### 4. Protocols ที่ใช้

| Protocol | ใช้กับ |
|----------|--------|
| **HTTP/HTTPS** | REST API, Web — Request/Response |
| **WebSocket** | Real-time chat, live update — Bi-directional |
| **gRPC** | Service-to-service — Binary, fast, schema-first |
| **TCP/UDP** | Low-level (games, streaming, DNS) |

### 5. Multi-Tier Client-Server
```
Browser → Load Balancer → App Server → Cache (Redis)
                                    → DB (PostgreSQL)
                                    → Message Queue
```

### 6. ตัวอย่าง Go — HTTP Server & Client
- Go HTTP server ด้วย `net/http`
- Go HTTP client ด้วย `http.Client`
- WebSocket server ด้วย `gorilla/websocket`
- gRPC server + client ด้วย `google.golang.org/grpc`

### 7. สรุป Patterns

| Pattern | เหมาะกับ |
|---------|---------|
| **HTTP/REST** | Stateless API, public endpoints |
| **WebSocket** | Live feed, chat, gaming |
| **gRPC** | Internal microservice communication |

---

## Code ตัวอย่างที่มีในไฟล์
- HTTP server + middleware (logging, CORS)
- HTTP client พร้อม retry และ timeout
- WebSocket echo server
- gRPC basic example
