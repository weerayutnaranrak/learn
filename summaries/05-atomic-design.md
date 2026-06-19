# 05 — Atomic Design

**ไฟล์:** `5-atomic.html` | **หมวด:** UI & Integration Patterns

## สิ่งที่จะได้เรียน

ออกแบบ UI Components จากเล็กไปใหญ่ — Atoms → Molecules → Organisms → Templates → Pages เหมือนสร้างโมเลกุลจากอะตอม

---

## เนื้อหาหลัก

### 1. Atomic Design คืออะไร?
- แนวคิดโดย Brad Frost สำหรับ Design Systems
- แบ่ง UI เป็น 5 ระดับตาม complexity
- ทำให้ UI consistent, reusable, ทดสอบได้

### 2. ทั้ง 5 ระดับ

| ระดับ | คำอธิบาย | ตัวอย่าง |
|-------|----------|---------|
| **⚛️ Atoms** | element เล็กที่สุด แบ่งต่อไม่ได้ | Button, Input, Label, Icon |
| **🧬 Molecules** | Atoms รวมกันเป็น unit ที่ทำงานได้ | SearchBar (Input + Button), FormField |
| **🦠 Organisms** | Molecules/Atoms รวมกันเป็น section | Header, ProductCard, NavigationMenu |
| **📐 Templates** | โครงสร้างหน้าโดยไม่มี real content | PageLayout, DashboardTemplate |
| **📄 Pages** | Templates + real content | ProductListPage, CheckoutPage |

### 3. Live Preview ที่มีในไฟล์
- แสดง HTML/CSS live ของแต่ละระดับ
- ตัวอย่าง E-Commerce: Button → ProductCard → ProductGrid → ShopPage

### 4. Atomic Design ใน Vue 3
- Atoms: `<BaseButton>`, `<BaseInput>`, `<BaseIcon>`
- Molecules: `<SearchBar>`, `<ProductPrice>`
- Organisms: `<ProductCard>`, `<AppHeader>`
- Pages: `<ProductListPage>`, `<CheckoutPage>`
- ใช้ `defineProps` + `defineEmits` ชัดเจน

### 5. Unit Testing — Atomic Design
- Test แต่ละระดับแยกกัน
- Atoms: test props, events, accessibility
- Molecules: test interaction ระหว่าง atoms
- Organisms: test business logic + state

### 6. ข้อดี
- **Consistency** — ใช้ components เดิม ไม่สร้างใหม่ทุกครั้ง
- **Reusability** — Atom เดียวใช้ได้ทั้ง app
- **Testability** — test ทีละระดับ
- **Documentation** — Storybook แสดง component catalog

---

## Code ตัวอย่างที่มีในไฟล์
- HTML/CSS live preview ทุกระดับ
- Vue 3 component ตัวอย่างทุกระดับ
- Unit test ด้วย Vitest + Vue Test Utils
