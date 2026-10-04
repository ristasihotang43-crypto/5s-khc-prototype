# 5S Industrial Monitoring System — Plant Operations Platform

A production-grade, tactile mobile and desktop web application for factory floor 5S auditing, visual inspection documentation (Before & After), real-time line progress tracking, and supervisor management.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during clarification and will govern the implementation:

- **Confirmed Decision 1 (Accounts & Persistence)**: Preloaded realistic factory accounts (Operator Rista NIP 10293, Supervisor NIP 99001) with persistent client-side storage (IndexedDB / LocalStorage) guaranteeing offline resilience, photo retention, and zero configuration hurdle.
- **Confirmed Decision 2 (Camera & Photo Upload)**: Dual-mode documentation supporting direct live device camera stream (`getUserMedia` with real-time video viewfinder and snapshot capture) as well as native file picker upload for photo gallery selection.
- **Confirmed Decision 3 (Admin Capabilities)**: Full in-app Master Data Management panel for Supervisor/Admin to dynamically add, edit, reorder, or deactivate Areas, Lines, and Position checklists.
- **Testing & Verification Feature**: A dedicated date-simulation control on the top navigation bar allowing users to jump between days (e.g. today vs tomorrow) to verify the automatic daily reset and historical log preservation in real time.

---

## 1. Overview & Core Concept

- **What It Does**: Digitizes the daily 5S (Seiri, Seiton, Seiso, Seiketsu, Shitsuke) inspection cycle across production areas (Depallitizer, Filling Lines A–G, Assembling Lines A–G). Operators audit positions, take verified Before/After condition photos, record time and shift, and submit inspections. Once submitted, positions lock for the day while previous records remain queryable in the audit history.
- **Target Audience / Persona**:
  - *Shop Floor Operators*: Using rugged smartphones, tablets, or mounted touchscreen terminals in industrial environments with gloves or single-handed thumb operation.
  - *Plant Supervisors & Quality Managers*: Reviewing daily line compliance percentages, auditing Before/After photo evidence, and adjusting line inspection checklists.
- **Key Value**: Replaces paper checksheets, eliminates delayed reporting, enforces photographic verification of 5S corrective actions, and prevents duplicate submissions.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Login & Session Initializer**:
   - Clean industrial portal with plant branding, company header, NIP/NIK and password inputs (or email toggle).
   - Quick-demo account switcher buttons for rapid evaluation (Operator Rista vs Quality Supervisor).
2. **Dashboard & Area Selection**:
   - High-contrast banner with operator identity, current shift, and active date.
   - Plant-wide 5S progress summary (Completed vs Remaining vs Total, visual multi-segment progress bar).
   - Touch-optimized Area cards:
     - **DEPALLITIZER**: Direct access to 5 inspection stations.
     - **FILLING**: Grid of Lines A through G with individual completion ratios (e.g., `5/8 CHECK`).
     - **ASSEMBLING**: Grid of Lines A through G with line progress status.
3. **Position Inspection & Form**:
   - Tapping an uncontrolled position opens the full-screen touch inspection sheet.
   - Pre-filled timestamp and date, tactile segmented shift selector (Shift 1 / 2 / 3).
   - Side-by-side Before & After documentation zones:
     - Direct "Buka Kamera" button launching an interactive live viewfinder with switchable camera lenses and shutter trigger.
     - "Upload Galeri" file picker fallback.
     - Image compression and thumbnail inspection preview with retake option.
   - Bottom primary action: "SUBMIT MONITORING" with validation guarding against empty photos.
   - Confirmation dialog modal ("Apakah Anda yakin ingin menyelesaikan monitoring posisi ini?").
4. **Instant Completion & Read-Only Audit**:
   - Upon submission, position turns gray with checkmark indicator (`✓ SUDAH DIKONTROL`).
   - Tapping a completed position opens a read-only audit drawer displaying the operator name, exact timestamp, shift, and high-resolution Before & After comparative view.
5. **Supervisor & History Audit**:
   - Comprehensive filter bar (Date range, Area, Line, Posisi, Shift, Operator search).
   - Interactive Before vs After comparison viewer.
   - Master data configuration drawer to add or modify lines and positions per area.

### Visual Identity & Theme

- **Aesthetic Direction**: Functional Industrial Minimalist — clean, high-contrast, designed for factory floor readability and glare resistance.
- **Color Palette & Discipline (60-30-10)**:
  - *60% Neutral Canvas*: Slate canvas (`#f8fafc` / `#0f172a`), crisp white card surfaces (`#ffffff`), hairline borders (`#e2e8f0`).
  - *30% Structural Industrial Surfaces*: Deep Navy header and structural navigation (`#0f172a` / `#1e293b`), muted industrial steel tones.
  - *10% Action & State Accents*: Industrial Cobalt Blue (`#2563eb`) for primary action buttons and active positions; Factory Emerald (`#16a34a`) for completed checks and success indicators; Neutral Slate Gray (`#94a3b8` / `#64748b`) for locked completed items.
- **Typography & Ergonomics**:
  - Crisp modern sans (`Plus Jakarta Sans` / system clean sans) paired with tabular numerals (`font-mono tabular-nums`) for exact time, NIP, and completion counters.
  - Generous touch targets ($\ge 48$px height) with full-width bottom mobile action bars and zero-pill clean typographic metadata.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Storage Architecture & Photo Handling**:
  - *Chosen Approach*: Client-side IndexedDB persistence with automatic in-memory caching and base64 canvas-compressed images.
  - *Why*: Photos captured on factory floor tablets can easily exceed 5MB each, which exceeds standard 5MB `localStorage` limits. IndexedDB handles tens of megabytes of compressed photo data reliably without network drops or backend dependencies.
  - *Alternatives Considered*: Plain LocalStorage (causes QuotaExceededError with photos) or external cloud storage (requires cloud credentials and internet uplink, failing offline shop-floor tests).
- **Decision 2: Daily Reset Engine (Date-Keyed State)**:
  - *Chosen Approach*: Status is computed dynamically by matching the active session date with records indexed by `date_key + area_id + line_id + position_id`.
  - *Why*: Non-destructive. Moving to a new day naturally leaves all positions uncompleted without deleting historical records from previous shifts or dates.
- **Decision 3: Dual Camera & Image Compression**:
  - *Chosen Approach*: Built-in HTML5 Canvas stream capture with client-side downscaling (max 1024px, 0.75 JPEG quality) plus standard `<input type="file" accept="image/*" capture="environment">`.
  - *Why*: Instant photo capture without leaving the app on tablets, while ensuring compatibility with desktop webcams and existing photo galleries.

---

## 4. Technical Architecture & Data Strategy

### System Architecture & Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                      App State & Storage Core                   │
│         (IndexedDB / LocalStorage State + Seed Factory Data)    │
└────────────────────────────────┬────────────────────────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
┌──────────────────┐                           ┌──────────────────┐
│   Auth Context   │                           │  5S Core Context │
│ - Current User   │                           │ - Active Date    │
│ - Role & NIP     │                           │ - Inspections    │
│ - Shift Selector │                           │ - Master Catalog │
└────────┬─────────┘                           └────────┬─────────┘
         │                                              │
         ▼                                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Top Industrial Bar & Date Switcher            │
│       [Brand Wordmark] ── [Nav Links / Shift] ── [User/Sim Date]│
└────────────────────────────────┬────────────────────────────────┘
                                 │
       ┌─────────────────────────┼─────────────────────────┐
       ▼                         ▼                         ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  Dashboard   │         │  Monitoring  │         │ History Log  │
│ - Shift Stat │         │ - Depallitizer│        │ - Filters    │
│ - Line Cards │         │ - Filling A-G│         │ - Photo Zoom │
│ - Visual Bar │         │ - Assembling │         │ - Export CSV │
└──────────────┘         └───────┬──────┘         └──────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       ┌───────────────────┐           ┌───────────────────┐
       │ Uncontrolled Item │           │  Controlled Item  │
       │ -> Inspection Form│           │ -> Read-only Card │
       │ -> Live Camera/Up │           │ -> Before / After │
       │ -> Submit & Lock  │           │ -> Operator/Time  │
       └───────────────────┘           └───────────────────┘
```

### Data Model Entities

- **User**: `id`, `employee_id` (NIP/NIK), `name`, `email`, `role` (`'operator'` | `'supervisor'`), `password`.
- **Area**: `id` (`'depallitizer'` | `'filling'` | `'assembling'`), `name`, `has_lines` (boolean).
- **Line**: `id` (e.g. `'filling-a'`), `area_id`, `name` (`'LINE A'`), `order`.
- **Position**: `id`, `area_id`, `line_id` (optional for single-line areas), `name`, `order`, `active`.
- **MonitoringRecord**: `id`, `date` (`YYYY-MM-DD`), `time` (`HH:MM`), `shift` (`'SHIFT 1'` | `'SHIFT 2'` | `'SHIFT 3'`), `area_id`, `line_id`, `position_id`, `user_id`, `operator_name`, `operator_nip`, `before_photo`, `after_photo`, `created_at`.

### Verification Plan
- Build and compile verification via `compile_applet`.
- Verify responsive layout across mobile breakpoint (375px–430px) and desktop workstation (1440px).
- Verify interactive flows: login, area navigation, position inspection with camera/file photo uploads, submission validation and confirmation modal, locked state display, date switching simulation for automatic daily reset, and supervisor master data management.
