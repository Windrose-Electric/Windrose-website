# Redline Change-Instructions — R155 / R156 Update Documents

> **Record control** — Prepared by: [blank — to be assigned] · Reviewed by: Lin Zou, Chief Architect · Approved by: Wen Han

**For** the entity transfer to Windrose Technology Antwerp NV on Swedish WVTA `e5*2018/858*00525`
**Revision** 00 (DRAFT) · **Date** 2026-06-29
**How to read:** each entry gives the **file**, the **location** to change, and the **before → after** text. "ADD" = insert new text; "REPLACE" = swap the quoted text. Placeholders in «angle brackets» are filled once officers/dates are confirmed.

> Scope note carried into every document: *The WVTA remains Swedish (Transportstyrelsen, e5). Only the manufacturer entity named on it (field 0.5) and the WMI (field 0.3 → YCB) change. The CSMS/SUMS technical content is unchanged; governance moves to Windrose Technology Antwerp NV.*

---

## R155 — Cybersecurity (CSMS)

### 1. WR-CSM — CSMS Management Manual (5A)
- **Location:** §Scope / Applicability clause; and the management representative clause.
- **ADD (scope):** "This management system applies to Windrose Technology Antwerp NV (Belgium), the manufacturer named in field 0.5 of WVTA e5*2018/858*00525. Production sites CHTC KINWIN (Nanjing) and Higer Bus (Suzhou) operate under this system. The system supports UN R155 vehicle approval E49*155R00/03*1037*00 and CSMS certificate CYPRUS*CERT*1032*00."
- **REPLACE:** "管理者代表由公司VP担任" → "The CSMS management representative is the CISO / CSMS Owner of Windrose Technology Antwerp NV «name». The Anhui engineering organisation executes lifecycle activities as a supplier under the Cybersecurity Interface Agreement."

### 2. WR-CSM-01 — Organisation Chart & Role-Assignment Matrix (5B)
- **Location:** "职责分配-领导层" (leadership-layer table) and the org chart.
- **ADD a leadership row:** Department/Post = "Windrose Technology Antwerp NV — CISO / CSMS Owner «name»"; Responsibility = "Overall accountability for the CSMS; signs management-review conclusions; single point of contact to the technical service and to Transportstyrelsen for cybersecurity; authorises EU field actions."
- **REPLACE the management-representative designation:** "由公司VP担任" → "held by the Antwerp NV CISO / CSMS Owner; the Anhui VP and department directors act as the executing (supplier) management layer."
- **ADD note to org chart:** show Windrose Technology Antwerp NV as the top governing entity, with the Anhui organisation and the two plants beneath it (dashed boundary retained for the plants).
- **Record control:** new revision A/2; preparer/reviewer/approver to be re-signed under the Antwerp entity «names» (currently 方进平 / 王文豪 / 陈皓利).

### 3. WR-CS&SUP-02 — Management-Review Control Procedure (5R) + Plan (5S) + Report (5T)
- **Location:** review-inputs / KPI list.
- **ADD inputs:** "EU-entity KPIs: monitoring feeds covered and mean-time-to-triage (WR-T0104-CSMS-007-EU); coordinated-disclosure metrics (WR-EU-CSMS-VDP-01); EU field-action count and completion rate (WR-EU-CSMS-RFA-01); status of the CSMS certificate re-issue to Antwerp NV."
- **ADD attendee:** the Antwerp NV CISO / CSMS Owner chairs or co-signs the review conclusions.

### 4. WR-CS&SUP-01 — Internal & External Audit Control Procedure (5K)
- **Location:** audit-programme / frequency clause.
- **ADD:** "An internal CSMS audit covering the Windrose Technology Antwerp NV governance scope is conducted 1–2× per year. A technical-service liaison clause provides for the TS provider (to be designated) to witness or conduct the external audit supporting the CSMS certificate re-issue and the Swedish WVTA update."

### 5. WR-QP-14 — Human-Resources Control Procedure (5AF)
- **Location:** competence/training-plan clause.
- **ADD:** "Onboarding for Windrose Technology Antwerp NV staff in CSMS roles. The annual cybersecurity training plan includes EU-specific content: GDPR obligations relevant to cyber/data handling, EU coordinated-disclosure practice, and authority-notification duties."

---

## R156 — Software Updates (SUMS)

### 6. WR-B05-SUMS-002 — After-Sales / User-Notification & Monitoring (13H) + checklist (13I)
- **Location:** roles & release-authorisation clause; monitoring clause.
- **ADD:** "For EU-registered vehicles, the Windrose Technology Antwerp NV SUMS Owner «name» holds the release-authorisation decision and confirms readiness before full EU rollout. EU-fleet monitoring and emergency response follow WR-EU-SUMS-MER-01; user notification follows WR-B05-SUMS-EU-02 (EN/FR/NL)."

### 7. Form F-01 — Vehicle Software Update Impact-Assessment / Campaign (WR-T0108-SUMS-001-01, 13K)
- **Location:** form header fields.
- **ADD fields:** "Belgian-entity approver (Antwerp NV SUMS Owner): «name / signature / date»" and a "Scope = EU fleet (Y/N)" column with the registration markets affected.

### 8. Form F-02 — Special-Update Application / Rollback (13M)
- **Location:** form header / sign-off.
- **ADD:** "EU-fleet scope row" and "Belgian-entity sign-off (Antwerp NV SUMS Owner)" alongside the existing approver.

### 9. RXSWIN Software-Identification-Code Ledger & format (WR-T0108-SUMS-003-07, 13V) + Type-Approval Ledger (F-04, 13S)
- **Location:** ledger header / identifier-format rule.
- **REPLACE the manufacturer identifier** in the RXSWIN format and the type-approval ledger to reference Windrose Technology Antwerp NV / WMI YCB.
- **ADD:** "The Antwerp NV SUMS Owner maintains these ledgers and notifies Transportstyrelsen of RXSWIN-affecting changes before type-approval-relevant updates are declared complete."

### 10. WR-CS&SUP-02 (SUMS review) — Plan (5U) + Report (5V)
- **ADD KPI inputs:** "OTA campaign success rate, failed/aborted installs, rollback events, % of EU fleet on the approved RXSWIN (WR-EU-SUMS-MER-01); status of the SUMS certificate re-issue (CYPRUS*CERT*1021*01) to Antwerp NV."

---

## Shared WVTA-level items (not R155/R156 system docs, but on the same critical path)
- **CoC template (COC-Windrose.doc)** — REPLACE issuer name → Windrose Technology Antwerp NV; lodge specimen signatures with Transportstyrelsen.
- **Information dossier (WDR-WH13-858-01)** — re-sign as Antwerp NV; update VIN/plate text (F7) and H1 OBD/RMI contact; cover all 50 Part III items.
- **ISO 9001 / CoP scope** — extend so Antwerp NV holds Conformity-of-Production oversight of both plants.

*DRAFT for internal review — confirm officer names, the proposed technical service, and dates before issuing.*
