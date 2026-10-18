# BMC-Track AI — Architectural & Design Decision Log (Brihanmumbai Municipal Corporation)

This log records key technical decisions, rationale, and trade-offs made during the development of BMC-Track AI for the Brihanmumbai Municipal Corporation (BMC / MCGM) across Mumbai's 19 administrative wards.

---

## [2026-10-18] Decision 1: Rule-Based Priority Scoring Formula
**Decided**: Use a deterministic rule-based scoring formula ($0 - 100$) combining category severity, pending duration, and local ward clustering density.
- **Formula**: $\text{Score} = \min(100, \text{SeverityWeight} + \text{PendingHoursFactor} + \text{WardClusterFactor})$
- **Category Weights**: Pothole Road Damage (40), Waterlogging / SWD Choke (38), Water Pipeline Leak (35), Public Toilet Choke (30), Garbage Overflow (25).
- **Why**: Machine learning for priority scoring was rejected. There is insufficient historical priority ground-truth data from municipal field operations. A transparent, auditable formula is more defensible to municipal commissioners, ward officers, and citizens than an uncalibrated black-box priority model.
- **Alternatives considered**: Trained regression model (rejected — no real labeled priority training dataset).

---

## [2026-10-18] Decision 2: Classifier Architecture & Bambaiya/Marathi/Hinglish Labeled Dataset
**Decided**: Implement `scikit-learn` `TfidfVectorizer` paired with `LogisticRegression` trained on a curated dataset of Bambaiya Hindi, Marathi, Hinglish, & English complaints across 5 core municipal categories in Mumbai.
- **Categories**:
  1. `pothole_road_damage` -> Roads & Traffic Dept
  2. `waterlogging_blocked_drain` -> Stormwater Drains (SWD) Dept
  3. `no_water_pipeline_leak` -> Hydraulic Engineer (Water Supply)
  4. `toilet_sanitation_choke` -> Public Health & Sanitation Dept
  5. `garbage_overflow` -> Solid Waste Management (SWM) Dept
- **Why**: Real public complaints across Mumbai are typed in conversational mixed Bambaiya Hindi-English (e.g., *"Colaba Causeway mein bada pothole hai bikes gir rahe hain"*, *"Hindmata Dadar underpass waterlogged"*). Heavy deep learning models (e.g. BERT/LLMs) require GPUs and high latency. TF-IDF + Logistic Regression executes in $<5\text{ms}$ with high interpretability and zero GPU dependency.
- **Validation**: Evaluated on an 80/20 held-out test split with exact accuracy (96.0%) and macro F1 score (96.0%) logged transparently.

---

## [2026-10-18] Decision 3: Synthetic Data Flagging & Honest Public Transparency
**Decided**: Include `is_synthetic` as a first-class boolean database column on `complaints` and `workers` tables, defaulting to `true` for demo seed data.
- **Why**: Passing off seed data as "live government feed data" is dishonest. By flagging synthetic data directly in the database schema, the public dashboard can display *"100% Demo Data Mode — BMC Mumbai 19 Wards"* with full credibility.

---

## [2026-10-18] Decision 4: Aesthetic & Theme Specification (No Blue, No Gradients)
**Decided**: Warm light aesthetic palette (`Warm Soft Linen #FAF9F5`, `Slate Charcoal #1F2923`, `Terracotta Red #C85A32`, `Forest Emerald #2D6A4F`, `Warm Amber #D97706`).
- **Why**: Standard tech demos overuse generic blue gradients and dark mode glassmorphism. A warm, earth-toned civic theme provides a realistic, professional, and accessible government interface suitable for field and administrative deployment.

---

## [2026-10-18] Decision 5: Duplicate Complaint Detection & Priority Escalation
**Decided**: Check for open duplicate complaints in the same ward & category when a citizen submits a report.
- **Why**: If multiple citizens report an underpass waterlogging in Dadar or a pothole on SV Road, creating 10 duplicate tickets clutters the queue. Merging reports into an existing open ticket and boosting its priority score (+15 points per duplicate report) ensures faster dispatch action without queue bloat.
