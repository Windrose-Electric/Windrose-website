# Information Document — EU 2017/2400 Annex II (VECTO)

**Doc. No:** WDR-(EU)2017/2400-01  **Update Date:** 01/07/2026
**Amends:** WDR-(EU)2017/2400-00 (Ext.00, 10/03/2026)

> ⚠️ INTERNAL DRAFT — do not deploy. Mirror of the Google Drive amendment
> under "EU Entity Transfer — Drafts (Antwerp NV) / Amendments".

---

## Windrose Technology Antwerp NV — APPLICATION FOR APPROVAL

| Field | | Value |
|---|---|---|
| Application Case | : | Heavy Lorry |
| Subject | : | Uniform descriptions concerning the approval of the system Licence with regards to determination of the CO₂ emissions and fuel consumption of heavy-duty vehicles |
| Legal basis | : | Regulation (EU) No. 2017/2400 |

## RECORD OF CONTROL

| Role | Name | Date |
|---|---|---|
| Prepared by | [ ] | |
| Reviewed by | Lin Zou — Chief Architect | |
| Approved by | Wen Han | |

## REASON FOR APPLICATION

| Version | Date | Reason for application |
|---|---|---|
| Ext.00 | 10/03/2026 | New Approval |
| **Ext.01** | **01/07/2026** | **Amendment — change of vehicle manufacturer of record from Anhui Windrose Holdings Co., Ltd to Windrose Technology Antwerp NV (WMI YCB). No change to vehicle technical configuration, component input data, or simulated CO₂/energy-consumption results.** |

> **Nature of this amendment.** This revision changes only the administrative identity of the manufacturer responsible to the approval authority (Section I, item 1) and the associated WMI/VIN allocation (Appendix 4). The VECTO input data, component certified values, simulation methodology, and output results are unchanged and carry forward from Ext.00. Under **Option ② (change of entity + WMI, WVTA processed by RDW / NL e4)** this amended Information Document is submitted for re-declaration. Under **Option ① (WMI change only, WVTA remaining Swedish / e5)** only Appendix 4 (VIN/WMI) changes and Section I item 1 is updated to the new entity name; the approval carries forward.

---

# INFORMATION DOCUMENT

## SECTION I

| # | Field | | Value |
|---|---|---|---|
| 1. | Name and address of vehicle manufacturer: | : | **Name: Windrose Technology Antwerp NV**<br>**Address: [Antwerp registered address — to be inserted], Belgium** |
| 2. | Assembly plants for which the processes referred to in point 1 of Annex II of Regulation (EU) 2017/2400 have been set up with a view to the operation of the simulation tool: | : | Name: CHTC KINWIN (NANJING) AUTOMOBILE CO., LTD.<br>Address: No.97, New Energy Avenue, Lishui Economic Development Zone, Nanjing, Jiangsu Province, China |
| 3. | Application case covered: | : | Heavy Lorry |
| 4. | Name and address of the manufacturer's representative (if any) | : | NA |

## SECTION II

| # | Field | | Value |
|---|---|---|---|
| 1. | Additional information | | |
| 1.1. | Data and process flow handling description (e.g. flow chart) | : | See ANNEX 1 (unchanged from Ext.00) |
| 1.2. | Description of quality management process | : | Departments within Windrose and assembly plants are managed according to ISO 9001. |
| 1.3. | Additional quality management certificates (if any) | : | See ANNEX 2 |
| 1.4. | Description of simulation tool data sourcing, handling and storage | : | See ANNEX 3 (unchanged from Ext.00) |
| 1.5. | Additional documents (if any) | : | See APPENDIX 1 – 4 |

## LIST OF ANNEX

| ANNEX | Title | Status |
|---|---|---|
| 1 | Data and process flow handling description | Unchanged from Ext.00 |
| 2 | Additional quality management certificates | Re-issue under Antwerp NV ISO 9001 scope |
| 3 | Description of simulation tool data sourcing, handling and storage | Unchanged from Ext.00 |

## APPENDIX LIST

| APPENDIX | Title | Status |
|---|---|---|
| 1 | VECTO Control Procedure (WR-QP-16) | Unchanged (procedure remains valid; re-approval optional) |
| 2 | Engineering Change Request Form | Unchanged |
| 3 | Training Document and Record | Unchanged |
| 4 | VIN Composition | **AMENDED — WMI updated from LH5 to YCB; remainder of VIN scheme unchanged** |

---

## ANNEX 3 — Description of simulation tool data sourcing, handling and storage
*(Carried forward verbatim from Ext.00 — no change.)*

**3.1 Data Sourcing.** The Vehicle Integration Department collects parameters in accordance with the input requirements of the VECTO tool. The Chassis Department, Electrical and Electronic Department, and Electric Drive and Control Department sort out the vehicle design parameters and form a detailed data list. For component characteristic parameters (e.g. drive-motor power/torque curves, tyre rolling-resistance coefficient), certified or measured values are given priority; where none exist, regulation formulas or reference standard values may be used, with the basis noted in the data list.

**3.2 Data Handling.** Component data are imported to VECTO in XML and hash-verified/encrypted via the Hashing Tool; component and vehicle data are integrated into an XML work file and run in VECTO Multistep. Output includes energy consumption and mileage (actual charging mileage / equivalent all-electric range / zero-emission mileage).

**3.3 Data storage.** PLM system deployed as a protected database storing input and simulation-output data, ensuring traceability of files.

---

### Amendment checklist (Option ②, RDW / NL e4)
- [ ] Insert Antwerp NV registered Belgian address (Section I, item 1)
- [ ] Re-issue Annex 2 with Antwerp NV ISO 9001 certificate
- [ ] Update Appendix 4 VIN scheme: WMI LH5 → YCB (pending NBN release)
- [ ] Confirm CHTC Kinwin Nanjing assembly-plant relationship remains contractually valid under the new entity
- [ ] Re-sign Record of Control (Prepared / Reviewed / Approved)
- [ ] Submit to RDW with the updated CoC and dossier
