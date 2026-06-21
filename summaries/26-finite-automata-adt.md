# 26 — Finite Automata & ADTs (Data Clumps Mapping)

## Overview

Topic #26 in the Design Principles & Patterns category.
**Accent color:** `#f59e0b` → `#d97706` (amber)
**Language:** Bilingual EN/TH — `<body class="lang-th">`, toggle via `i18n.js`
**Code language:** Go (default) + TypeScript (toggle via `data-lang="go"` / `data-lang="ts"`)

Core idea: any domain object with a lifecycle is already a Finite State Machine. Drawing the FSM explicitly first, then encoding each state as a type variant, eliminates the Data Clumps code smell and makes illegal states unrepresentable at compile time.

---

## Key Concepts

| Concept | คำอธิบาย |
|---------|----------|
| Finite State Machine (FSM) | แบบจำลองที่มี States (Q), Alphabet (Σ), δ: Q×Σ→Q, start state q₀, accept states F |
| Deterministic Finite Automaton (DFA) | FSM ที่ทุก (state, event) pair มี next state แค่หนึ่งเดียว |
| Data Clumps | Code smell: field/parameter 3 ตัวขึ้นไปที่ปรากฏด้วยกันแต่ไม่มี named type |
| Product Type | AND — struct ที่ทุก field present พร้อมกัน, cardinality = n × m |
| Sum Type | OR — discriminated union ที่มีแค่ variant เดียวที่ active, cardinality = n + m |
| Cardinality argument | `bool × bool × bool` = 8 combinations แต่มีแค่ 3 valid → Sum type = 0 invalid |
| Option[T] | Pattern สำหรับ nullable sentinel: `None \| Some(T)` แทน `*T` |
| Make illegal states unrepresentable | ถ้า type system ไม่อนุญาต state ที่ invalid → ไม่ต้องมี runtime guard |

---

## Sections

- **#fsm** — Formal definition (Q, Σ, δ, q₀, F), animated SVG traffic light DFA, key property: deterministic
- **#clumps** — Data Clumps smell (3 patterns: loose params, boolean flags, nullable sentinel), why it hurts
- **#adt** — Brief refresher: Product vs Sum type, cardinality table (3 booleans = 8 combos vs Sum type = 3)
- **#mapping** — Recipe (3 patterns with Go+TS before/after):
  - Pattern A: co-occurring fields → Product Type (`DateRange`, `Guest`)
  - Pattern B: boolean flag explosion → Sum Type / enum
  - Pattern C: nullable sentinel → `Option[T]`
- **#encode** — 4-step FSM encoding recipe + animated SVG Order lifecycle FSM + Go/TS code
- **#example** — Full TCP connection FSM: naive string-state (runtime bugs) vs typed state (compile-time safety)
- **#summary** — When to use/skip, quick-reference table (Smell → Pattern → ADT encoding), prev/next links

---

## Data Clump Patterns

| Smell | Pattern | ADT Encoding |
|-------|---------|--------------|
| Co-occurring parameters | Extract into named type | `struct { A, B, C }` — Product Type |
| Boolean flag explosion | Replace with enum | `type S = A \| B \| C` — Sum Type |
| Nullable sentinel (`nil`) | Wrap in `Option[T]` | `None \| Some(T)` — Sum Type |
| Invalid state combinations | Design as FSM first | One type per state + transition functions |

---

## Code Examples

- `DateRange` / `Guest` product types replacing clumped parameters
- `AccountStatus` const iota replacing `isActive, isSuspended, isDeleted` booleans
- `Option[T any]` generic wrapper replacing ambiguous `*T` pointers
- Order lifecycle FSM: `PendingOrder`, `ConfirmedOrder`, `ShippedOrder`, `DeliveredOrder`, `CancelledOrder` — each as own struct with transition methods
- TCP connection FSM: `Closed`, `Connecting`, `Established`, `Closing` — naive string version vs typed version

---

## Related Topics

- **Topic 25 — Functional Programming**: full ADT syntax, pattern matching, IO Monad (Scala)
- **Topic 01 — DDD**: Value Objects and Aggregates as product types
- **Topic 13 — CQRS**: Event Sourcing — state as sequence of events (FSM + event log)
