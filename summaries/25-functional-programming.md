# 25 — Functional Programming (7 Levels — De Goes)

## Overview

สื่อการสอน Functional Programming ตาม FP Ladder 7 ระดับของ John A. De Goes ครอบคลุมตั้งแต่ฟังก์ชัน pure พื้นฐานไปจนถึง Type Classes พร้อมตัวอย่าง Scala 3 ในทุกระดับ สองภาษา EN/TH

**Accent color:** `#7c3aed` → `#a78bfa` (purple)

---

## Key Concepts

| Concept | คำอธิบาย |
|---------|----------|
| **Determinism** | ฟังก์ชัน pure: input เดิม → output เดิมเสมอ |
| **Immutability** | `val` แทน `var` ไม่มี race condition |
| **Higher-Order Functions** | ส่งฟังก์ชันเป็น argument, `map`/`filter`/`fold`/`flatMap` |
| **Currying** | Function returning function — partial application |
| **ADTs** | Product types (`case class`) + Sum types (`enum`) |
| **IO Monad** | Blueprint strategy — lazy description, execute at the edge |
| **Type Classes** | Ad-hoc polymorphism: `trait` + `given` + `using` |

---

## Sections

- **Code Review** — 5 ปัญหาใน imperative RSS Processor
- **4 Pillars** — Determinism, Typing, Declarative, Total Error Handling
- **7 Levels Overview** — บันได De Goes ครบทั้ง 7 ขั้น
- **Level 1** — Functions & Immutability + code example
- **Level 2** — HOFs, Currying, Extension Methods + exercises
- **Level 3** — ADTs, Pattern Matching, Smart Vending Machine exercise
- **Level 4** — IO Monad, Clean/Dirty Room, 3 Superpowers
- **Level 5** — Type Classes (3 components, real-world examples)

---

## Language

Bilingual EN/TH — Thai สำหรับอธิบาย concept, English สำหรับ code และ technical terms
