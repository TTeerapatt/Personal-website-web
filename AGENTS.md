<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Personal Website Web (Landing page)

แนวทางสำหรับ AI agent / คนที่มาแก้โค้ดหรือ prompt ต่อในโปรเจกต์นี้
อ่านไฟล์นี้ก่อนเปลี่ยน section, การเรียก API, i18n, หรือ theme

---

## 0) ภาพรวมระบบทั้งชุด

| โฟลเดอร์ | บทบาท |
|----------|--------|
| `Personal-website-web` | **โปรเจกต์นี้** — Landing page สาธารณะ |
| `Personal-website-admin` | Web admin (CMS) — จัดการคอนเทนต์ที่จะมาโชว์บนหน้านี้ |
| `Personal-website-api` | Backend API + PostgreSQL |

### หลักการผลิตภัณฑ์

1. **หน้าเดียวเท่านั้น** — เป็น landing page หน้าเดียว ไม่มี route อื่น การนำทางใช้ anchor (`#about`, `#projects`, …)
2. **คอนเทนต์ทั้งหมดมาจาก CMS** — ไม่ hardcode ข้อมูลส่วนตัว/ผลงานในโค้ด
3. **Section เปิด/ปิดจาก `site_settings.show_*`** — API ตัด section ที่ปิดออกจาก payload เลย
4. **รองรับ 2 ภาษา: ไทย + อังกฤษ** — ข้อความ UI อยู่ใน `app/messages/`, ข้อมูลคอนเทนต์ใช้คู่ `*_th` / `*_en`
5. **Responsive** — mobile / iPad / notebook / desktop
6. Theme: **ขาว + navy** (`--brand-primary: #0b1f3a`) ให้สอดคล้องกับ admin

โปรเจกต์นี้ **ไม่ใช่** CMS — อย่าเพิ่มฟอร์มแก้ข้อมูล, auth, หรือ mutate คอนเทนต์

---

## 1) ภาพรวมโปรเจกต์

- **ชื่อ:** `personal-website-web` (Next.js App Router, Next 16)
- **basePath:** `/personal-website`
- **Backend:** `NEXT_PUBLIC_BACKEND_URL` เช่น `http://localhost:3006/personal-website/api/`
  (ต้องมี prefix `/personal-website/api/` และปิดท้ายด้วย `/`)
- **พอร์ต Docker/Jenkins:** `3008` (api = `3006`, admin = `3007`)
- **ไม่มี auth** — เรียกเฉพาะ public endpoint เท่านั้น

### คำสั่ง

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

Dev URL: `http://localhost:3000/personal-website`
Docker URL: `http://localhost:3008/personal-website`

### Env

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3006/personal-website/api/
```

ดูตัวอย่างที่ `.env.example`

---

## 2) โครงสร้างโฟลเดอร์

```
Personal-website-web/
├── AGENTS.md
├── .env.example
└── app/
    ├── layout.tsx                  # font, metadata, NextIntlClientProvider, skip link
    ├── page.tsx                    # หน้าเดียวของเว็บ — โหลด content + ประกอบ section
    ├── loading.tsx                 # skeleton ระหว่าง server render
    ├── not-found.tsx               # redirect กลับ "/" (ไม่มีหน้า 404 แยก)
    ├── globals.css                 # tokens + reveal/animation + .rich-text
    ├── assets/                     # static import (logo)
    ├── i18n/request.ts             # เลือก locale จาก cookie
    ├── messages/{en,th}/main.json  # ข้อความ UI ทั้งหมด
    ├── types/content.ts            # type ของ payload จาก API
    ├── lib/
    │   ├── websiteContent.ts       # โหลด + normalize payload, คำนวณ section ที่จะโชว์
    │   ├── locale.ts               # SUPPORTED_LOCALES, cookie, pickLocalized()
    │   ├── localeActions.ts        # Server Action เซ็ต cookie ภาษา
    │   ├── formatDate.ts           # formatPeriod / calculateDuration
    │   ├── sanitizeHtml.ts         # กรอง rich text ก่อน render
    │   └── mediaUrl.ts             # resolve URL รูป / ลิงก์ภายนอก
    ├── services/
    │   ├── apiServices.ts          # axios instance
    │   ├── response-validator.ts
    │   └── main/mainAPI.ts         # getPublicWebsiteContent, trackWebsiteVisit
    └── components/
        ├── layout/                 # SiteHeader, SiteFooter, LocaleSwitcher, BackToTop, VisitTracker
        ├── sections/               # เฉพาะ *Section.tsx หลักของหน้า (1 ไฟล์ต่อ 1 section)
        └── ui/                     # ชิ้นส่วนที่ใช้ซ้ำ / ลูกของ section (SectionShell, SkillsMarquee, …)
```

---

## 3) Data flow (สำคัญ)

```
page.tsx (Server Component)
  └── loadWebsiteContent()          app/lib/websiteContent.ts
        └── mainAPI.getPublicWebsiteContent()
              └── GET {BACKEND}/public/content
```

- เรียก **endpoint เดียว** `GET /public/content` ได้ทุก section ในครั้งเดียว — อย่าไปเรียกแยกทีละ section
- `getVisibleSections()` เป็นตัวตัดสินว่า section ไหนโชว์: ต้อง `show_* = true` **และ** มีข้อมูลจริง
- ลำดับ section บนหน้า = `home` → `about` → `skills` → `projects` → `experiences` → `education` → `contact`
- ถ้าโหลดไม่ได้ → `page.tsx` แสดง `StateNotice` (ไม่ throw ออกไป error boundary)
- `POST /website-visits/track` ยิงจาก `VisitTracker` (client) ครั้งเดียวต่อ session

### ตอนเพิ่ม section ใหม่

1. ฝั่ง API: เพิ่มคอลัมน์ `show_<name>` ใน `site_settings` + migration + ใส่ใน `public_content.service.ts`
2. ฝั่งนี้: เพิ่ม type ใน `app/types/content.ts`
3. เพิ่ม `SectionId` + เงื่อนไขใน `getVisibleSections()`
4. สร้าง `app/components/sections/<Name>Section.tsx`
5. ต่อใน `app/page.tsx` ตามลำดับที่ต้องการ
6. เพิ่มข้อความใน `app/messages/en/main.json` **และ** `th/main.json` + key ใน namespace `nav`

---

## 4) Server / Client component

- **ค่าเริ่มต้นคือ Server Component** — landing page ต้องการ SEO และ first paint ที่เร็ว
- ใส่ `"use client"` เฉพาะที่ต้องมี interaction: `SiteHeader`, `BannerSection`, `ProjectsSection`,
  `TypewriterText`, `LocaleSwitcher`, `BackToTop`, `VisitTracker`, `CopyEmailButton`, `Reveal`
- **helper วันที่ใน `app/lib/formatDate.ts` ไม่ผูกกับ timezone ของ process** — `start_date` / `end_date`
  เป็น DATE ที่ node-postgres แปลงเป็น local midnight ของ *เครื่อง API* จึงต้องปัดเข้า UTC midnight
  ที่ใกล้ที่สุดเพื่อได้วันตามปฏิทินจริง ห้ามกลับไปอ่านด้วย `getMonth()` / `getDate()` แบบ local
  เพราะถ้า container ของ web กับ api ตั้ง TZ ต่างกัน เดือนจะเพี้ยนไป 1 (ดูคอมเมนต์ในไฟล์)
- component ที่ต้องมี state เริ่มต้นเหมือน server (เช่น `TypewriterText`) ให้ render ค่าเดิมในรอบแรกก่อน ค่อยเริ่ม animate

---

## 5) i18n

- Cookie: `personal_website_locale` (admin ใช้คนละตัวคือ `personal_website_admin_locale`)
- Default locale: `th`
- เปลี่ยนภาษาผ่าน Server Action `setLocaleAction()` + `router.refresh()` — **ห้าม** ทำ locale prefix ใน URL (จะกลายเป็นหลาย route)
- ข้อความ UI: `useTranslations()` (client) / `getTranslations()` (server)
- ข้อมูลคอนเทนต์: `pickLocalized(locale, x_th, x_en)` — มี fallback ไปอีกภาษาถ้าอันที่เลือกว่าง
- เพิ่ม key ใหม่ต้องใส่ทั้ง `en` และ `th`

---

## 6) UI / Theme

- CSS variables ใน `globals.css` — ใช้แบบ `bg-[var(--surface)]`, `text-[var(--text-primary)]` (ตามแนวเดียวกับ admin)
- Tailwind v4 (`@import "tailwindcss"` + `@theme inline`)
- `SectionShell` คุม heading + container + ระยะห่างของทุก section — อย่าเขียน padding เองซ้ำ
- สลับพื้นหลัง section ด้วย `tone="muted"` เพื่อให้แยกบล็อกกันออก
- `description_*` เป็น HTML จาก TipTap → render ผ่าน `<RichText />` (ผ่าน `sanitizeHtml()` แล้ว) และจัดสไตล์ด้วยคลาส `.rich-text`
- รูปจาก API ใช้ `<MediaFrame />` (เป็น `<img>` ธรรมดา) เพราะ origin ของ upload ไม่รู้ตอน build จึงตั้ง `next/image` remotePatterns ไม่ได้
- `next/image` ใช้กับ static asset ที่ import เข้ามาเท่านั้น (logo)
- Animation ตอน scroll ใช้ `<Reveal />`; สถานะซ่อนอยู่ใน CSS และมี `<noscript>` + `prefers-reduced-motion` กันเนื้อหาหาย

### Responsive

Breakpoint ที่ใช้: base (mobile) → `sm` 640 → `md` 768 (iPad) → `lg` 1024 (notebook) → `xl` 1280+ (desktop)
ทุก section ต้องทดสอบครบทั้ง 4 ช่วง

---

## 7) สิ่งที่ห้าม

- อย่าเพิ่ม route / หน้าใหม่ — เว็บนี้ต้องมีหน้าเดียว (ใช้ anchor หรือ modal แทน)
- อย่าเรียก endpoint ที่ต้องใช้ admin token หรือเก็บ token ไว้ฝั่งนี้
- อย่า mutate คอนเทนต์จากเว็บสาธารณะ (ยกเว้น `website-visits/track`)
- อย่า hardcode ข้อความคอนเทนต์ที่ควรมาจาก CMS
- อย่าใส่ `dangerouslySetInnerHTML` โดยไม่ผ่าน `sanitizeHtml()`
- อย่าเอา TipTap / SweetAlert / โค้ดฝั่ง admin กลับเข้ามา
- อย่ารีแฟกเตอร์กว้างเกินงาน
- อย่า commit / push นอกจากผู้ใช้ขอ

---

## 8) เช็กลิสต์ก่อนจบงาน

- [ ] ยังเป็นหน้าเดียว ไม่มี route เพิ่ม
- [ ] เคารพ `site_settings.show_*` ทุก section
- [ ] ข้อความใหม่มีทั้ง `th` และ `en`
- [ ] ใช้ได้ทั้ง mobile / iPad / notebook / desktop
- [ ] ไม่มี hydration mismatch (เช็ก console)
- [ ] `npm run typecheck` / `npm run lint` / `npm run build` ผ่าน

---

อัปเดตไฟล์นี้เมื่อเปลี่ยนโครงสร้าง section, data flow, หรือ convention การเชื่อม API
