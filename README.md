# Software Design & Architecture Patterns

สื่อการเรียนการสอน Software Architecture & Design Patterns ภาษาไทย พร้อมภาพ diagram และตัวอย่าง code ภาษา Go

> **อ่าน summaries ก่อน:** ดูสรุปทุกหัวข้อได้ที่ [`summaries/`](summaries/README.md)

## หัวข้อทั้งหมด (25 หัวข้อ)

### 🏛️ Design Principles & Patterns

| # | หัวข้อ | Key Concepts | ไฟล์ | สรุป |
|---|--------|-------------|------|------|
| 18 | Design Patterns (GoF) | Factory, Builder, Decorator, Strategy, Observer, Chain of Responsibility | `18-design-patterns.html` | [📄](summaries/18-design-patterns.md) |
| 17 | SOLID Principles | SRP, OCP, LSP, ISP, DIP | `17-solid.html` | [📄](summaries/17-solid.md) |
| 16 | Clean & Onion Architecture | Dependency Rule, inward deps, Domain core | `16-clean-onion.html` | [📄](summaries/16-clean-onion.md) |
| 01 | Domain Driven Design (DDD) | Entity, Value Object, Aggregate, Bounded Context | `1-ddd.html` | [📄](summaries/01-ddd.md) |
| 02 | Repository Pattern | Interface abstraction, Testability, Fake/Mock | `12-repository.html` | [📄](summaries/12-repository.md) |
| 03 | CQRS | Command/Query separation, Projection, Event Sourcing | `13-cqrs.html` | [📄](summaries/13-cqrs.md) |
| 04 | HTDP | Design Recipe 6 ขั้นตอน, Examples First | `6-htdp.html` | [📄](summaries/06-htdp.md) |
| 19 | Testing Patterns | Test Pyramid, TDD, Stub/Mock/Fake/Spy, Table-driven | `19-testing.html` | [📄](summaries/19-testing.md) |
| 25 | Functional Programming (7 Levels) | Pure Functions, HOFs, ADTs, IO Monad, Type Classes, Scala 3 | `25-functional-programming.html` | [📄](summaries/25-functional-programming.md) |

### 🏗️ Architecture Styles

| # | หัวข้อ | Key Concepts | ไฟล์ | สรุป |
|---|--------|-------------|------|------|
| 05 | Layered / N-Tier Architecture | Presentation → Business → Data Access | `7-layered.html` | [📄](summaries/07-layered.md) |
| 06 | Hexagonal Architecture | Ports & Adapters, Driving/Driven sides | `2-hexagonal.html` | [📄](summaries/02-hexagonal.md) |
| 07 | MVC Pattern | Model, View, Controller + MVP/MVVM | `10-mvc.html` | [📄](summaries/10-mvc.md) |
| 08 | Service-Oriented Architecture (SOA) | ESB, Service Contracts, Orchestration | `11-soa.html` | [📄](summaries/11-soa.md) |

### ⚡ Go Concurrency Patterns

| # | หัวข้อ | Key Concepts | ไฟล์ | สรุป |
|---|--------|-------------|------|------|
| 20 | Go Concurrency Patterns | Worker Pool, Pipeline, Fan-out/Fan-in, Semaphore, Context | `20-concurrency.html` | [📄](summaries/20-concurrency.md) |

### ☁️ Distributed & Communication Patterns

| # | หัวข้อ | Key Concepts | ไฟล์ | สรุป |
|---|--------|-------------|------|------|
| 09 | Client-Server Pattern | HTTP, WebSocket, gRPC, Thin/Fat client | `8-client-server.html` | [📄](summaries/08-client-server.md) |
| 10 | Microservice Architecture | API Gateway, Circuit Breaker, Service Mesh | `9-microservice.html` | [📄](summaries/09-microservice.md) |
| 11 | Event Driven Design | Publisher/Subscriber, Event Bus, Event Sourcing | `3-event-driven.html` | [📄](summaries/03-event-driven.md) |
| 12 | Peer-to-Peer (P2P) | DHT, Gossip Protocol, WebRTC | `14-p2p.html` | [📄](summaries/14-p2p.md) |
| 21 | Saga Pattern | Choreography, Orchestration, Outbox Pattern | `21-saga.html` | [📄](summaries/21-saga.md) |
| 14 | BFF Architecture | Backend per client, aggregate, over/under-fetching | `4-bff.html` | [📄](summaries/04-bff.md) |

### ☸️ Infrastructure & Orchestration

| # | หัวข้อ | Key Concepts | ไฟล์ | สรุป |
|---|--------|-------------|------|------|
| 15 | Kubernetes (K8s) | Pod/Deploy/Service, HPA, Helm, ArgoCD, RBAC | `15-k8s.html` | [📄](summaries/15-kubernetes.md) |
| 22 | Observability | Logs (slog), Metrics (Prometheus), Traces (OpenTelemetry) | `22-observability.html` | [📄](summaries/22-observability.md) |
| 23 | Kong Gateway | Service/Route/Plugin/Consumer, decK, KIC | `23-kong-gateway.html` | [📄](summaries/23-kong-gateway.md) |

### 🎨 UI & Integration Patterns

| # | หัวข้อ | Key Concepts | ไฟล์ | สรุป |
|---|--------|-------------|------|------|
| 13 | Atomic Design | Atoms → Molecules → Organisms → Templates → Pages | `5-atomic.html` | [📄](summaries/05-atomic-design.md) |

### 🌱 Process & Delivery

| # | หัวข้อ | Key Concepts | ไฟล์ | สรุป |
|---|--------|-------------|------|------|
| 24 | Agile & Scrum (EN/TH) | Manifesto, Roles, Artifacts, 5 Events, Story Points, Burndown | `24-agile-scrum.html` | [📄](summaries/24-agile-scrum.md) |

---

## การใช้งาน

เปิด `index.html` ในเบราว์เซอร์ได้เลย — ไม่ต้องติดตั้งอะไร ไม่มี build step

```bash
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

## โครงสร้าง Repository

```
/
├── index.html              ← หน้าหลัก (card grid ทุกหัวข้อ)
├── 1-ddd.html              ← หน้า topic แต่ละหัวข้อ
├── ...
├── 23-kong-gateway.html
├── common.css              ← shared styles สำหรับ code block controls
├── common.js               ← copy / collapse / language toggle buttons
├── summaries/              ← สรุปทุกหัวข้อ ภาษา Markdown
│   ├── README.md           ← index ของ summaries
│   ├── 01-ddd.md
│   └── ...
├── CLAUDE.md               ← guidance สำหรับ Claude Code
└── README.md               ← ไฟล์นี้
```

## Tech Stack

- **ภาษา:** HTML, CSS, JavaScript (vanilla)
- **Syntax Highlighting:** [highlight.js](https://highlightjs.org/) v11.9 (CDN)
- **Code examples:** Go เป็นหลัก (บางหัวข้อมี TypeScript toggle)
- **ไม่มี:** framework, build tool, package manager
