# Alak Oil and Gas Company Limited — Corporate Website Development Brief

Prepared by: Alak BD & Corporate Relationship AI  
Date: November 6, 2025

Project goal: Establish Alak Oil and Gas Company Limited as a professional, trusted, and globally recognized intermediary for verifiable crude oil and refined product transactions across international markets.

---

## I. Company identity & project objectives

### A. Company profile

| Detail | Information |
| --- | --- |
| Legal name | **Alak Oil and Gas Company Limited** |
| Registration number (RC) | **8867061** |
| Tax Identification Number (TIN) | **33567270-0001** |
| Established | 2018 |
| Head office | Gwarimpa Estate, Opposite H Medix, FCT Abuja, Nigeria |
| Commercial office | No. 5 Lekki First Two, Lagos, Nigeria |
| Core business | Connecting verifiable buyers and sellers of crude oil and refined products; facilitating cooperation with refineries and exporters globally. |
| Core values | Integrity, Trust, Professionalism, Partnership, Global Reach |

### B. Strategic objectives (the "Why")

- Credibility & trust — establish Alak as a legitimate, compliant, and professional market participant. The website must be the primary source of corporate verification.
- Lead generation & qualification — create secure, distinct channels for high-value corporate inquiries (Verified Buyers, Verified Sellers, Strategic Partners) and apply strict business logic to filter leads.
- Brand positioning — present a clear, efficient, and sophisticated online presence that signals reduced transactional risk and streamlined logistics.

---

## II. Design & aesthetic requirements

The visual direction must be corporate, serious and sophisticated. Avoid distracting animations and flashy elements. Prioritize clarity, hierarchy and whitespace.

### A. Color palette

Use deep, professional tones with clean white space for contrast.

| Name | Hex | Usage |
| --- | ---: | --- |
| Primary (Deep Navy) | `#0A1931` | Main backgrounds, headers, footers, and key accent blocks |
| Secondary (Corporate Blue) | `#1F4287` | Buttons, active nav links, hover states, feature icons |
| Accent (Refined Gold) | `#FFB74D` | Primary CTAs, highlights and section dividers (use sparingly) |
| Base / Text (light) | `#EBEBEB` | Primary text on dark backgrounds |
| Neutral background | `#FFFFFF` | Body backgrounds, forms, and content panels |

### B. Imagery & typography

- Use high-resolution, professional photography (modern refineries, large-scale tankers, executive meeting rooms). Avoid cliché oil-derrick stock imagery.
- Maintain a minimalist layout with ample whitespace.
- Typography: choose a modern sans-serif (e.g., Inter, Roboto) for legibility across devices.

### C. Frontend narrative & user experience

The site should convey Precision, Security and Global Reach:

- Precision (UI/UX): crisp alignment, clear hierarchy, subtle transitions (soft hover/fade), and prominent display of trust elements (RC/TIN) and contact CTAs.
- Security (visual cues): use the Deep Navy background for homepage and footer; consider subtle vector world-map overlays to imply global logistics without distraction.
- User journey: optimize conversion to the Corporate Inquiry Form; navigation should be minimal (max 5 main links) and mobile-first.
- Above-the-fold: use the Accent Gold (`#FFB74D`) sparingly to highlight the main CTA.

---

## III. Website structure & core features

### A. Core pages and modules

| Page | Content highlights | Lead / CTA |
| --- | --- | --- |
| Home | Headline: "Your Trusted Gateway to Verified Global Energy Transactions." High-impact banner (image or subtle video), short overview and core values. | CTAs: "Verify Credentials", "Begin Partnership Inquiry" |
| About | Corporate history, mission, values; executive bios (Kabiru Jibril — Executive Chief Officer; Aliyu Ahmad Sunusi — Managing Director) with photos. | Download: Corporate profile (PDF) |
| Services & Products | Explanation of intermediary role, transparency, and risk reduction. Product list: Crude (African/ME grades), PMS (Gasoline), AGO (Diesel), Jet Fuel (ATK). | "Inquire About Product Availability" |
| Compliance & Credentials | Highest-trust page. Prominently display RC and TIN and provide links/embed viewers for legal docs (Certificate of Incorporation, Anti-Corruption Policy). | Statement on KYC/AML and compliance |
| Contact | Full contact details for Abuja head office and Lagos commercial office; integrated Google Map for the head office. | Secure Corporate Inquiry Form |
| News & Insights (Blog) | Content hub for thought leadership; CMS-manageable posts; subscription CTA. | Subscribe for market updates |

### B. Corporate Inquiry Form (lead generation)

The form must be detailed and secure to filter low-quality leads.

- Inquiry type (dropdown): Verified Buyer, Verified Seller, Strategic Partner, General Inquiry
- Required fields: Full name, Job title, Company name, Country of registration, Company website, Product of interest, Estimated volume (BBLs/MT), Detailed message
- Security: implement reCAPTCHA v3 (or equivalent) and server-side validation
- Integration & logic:
   - Persist leads to Supabase PostgreSQL only after server-side validation (URL validation, numeric checks for volume, required fields)
   - Implement Supabase Row-Level Security (RLS) to protect lead data
   - Admin CMS dashboard should categorize leads (Buyer, Seller, Partner) and notify admins on high-value inquiries

---

## IV. Technical & performance requirements

| Category | Requirement | Priority |
| --- | --- | --- |
| Technical stack | Frontend: Next.js or React (SEO-friendly). Backend/DB/Auth/Storage: Supabase (Postgres). CMS: custom on Supabase. | Critical |
| Data & security | Use Supabase RLS for sensitive lead data; server-side validation and secure storage; restrict dashboard to authenticated admins. | Critical |
| Responsiveness | Mobile-first responsive design (mobile, tablet, desktop). | Critical |
| Performance | Target 90+ Google PageSpeed Insights (mobile & desktop) at launch. | Critical |
| Security & privacy | HTTPS (TLS), GDPR/CCPA/Nigerian data law considerations. | Critical |
| SEO & analytics | Clean URLs, sitemap, meta tags, Organization schema; implement GA4 and verify Search Console. | High |
| Internationalization | Structure site to allow future multi-language support (Arabic, French, etc.) without redesign. | Medium |

---

## V. Deliverables & next steps

1. Deliverables: final high-fidelity mockups, responsive front-end, integrated Supabase backend, functional custom CMS, technical documentation, and post-launch support plan.
2. Action for developer: prepare a proposal with the recommended stack (e.g., Next.js version), a phased timeline, and cost breakdown based on the requirements above.

---

Notes and assumptions

- This rewrite preserves all original content and clarifies structure, headings and tables for better readability and maintainability.
- If you want this converted to a design brief PDF or a structured JSON spec for engineering, I can generate that next.

