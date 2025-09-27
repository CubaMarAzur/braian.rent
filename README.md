# Braian.rent — MVP Slim

**Braian.rent** to aplikacja do zarządzania najmem, która pozwala właścicielom mieszkań samodzielnie i profesjonalnie prowadzić proces wynajmu — bez pośredników, z pomocą AI i automatyzacji.

---

## Cel projektu

Uregulowanie rynku najmu w Polsce poprzez:

- Budowanie świadomości dobrych praktyk
- Weryfikację najemców i właścicieli
- Automatyzację checklist, audytów i płatności
- Asystenta AI (Braian) prowadzącego właściciela krok po kroku

---

## Zakres MVP Slim

- Rejestracja/logowanie właściciela i najemcy (social login)
- Dodanie nieruchomości przez właściciela
- Checklisty najmu i audytów
- Chat AI pomiędzy właścicielem a najemcą (LLM)
- Historia płatności (bez integracji Stripe)
- Upload dokumentów (PDF/JPG) bez OCR
- Panel właściciela z podglądem nieruchomości i najemców

---

## Stack technologiczny

| Warstwa         | Technologia                  |
|-----------------|------------------------------|
| Frontend        | Next.js + Tailwind + shadcn  |
| Backend         | Next.js API Routes (REST)    |
| Baza danych     | PostgreSQL (Cloud SQL)       |
| Asynchroniczność| Pub/Sub + Cloud Run Jobs     |
| Chat            | Firestore (realtime)         |
| Storage         | Google Cloud Storage         |
| CI/CD           | GitHub Actions + Terraform   |

---

## Struktura repo

\`\`\`bash
braian.rent/
│
├── README.md                  # Ogólny opis projektu (biznes + tech)
├── .gitignore
├── .env.example               # Przykładowy plik zmiennych środowiskowych
│
├── docs/                  📚 Dokumentacja produktu
│   ├── PRD_Braian.md          # Product Requirements Document
│   ├── AC_Braian.md           # Acceptance Criteria (user stories, GWT)
│   ├── roadmap.md             # Roadmapa rozwoju (MVP → v1.1 → v1.3)
│   ├── ux_notes.md            # Notatki UX, mockupy, flowy
│   ├── ai_features.md         # Plan funkcji AI (chatbot, OCR, scoring)
│   ├── data_model.md          # Model danych (Prisma/SQL)
│   ├── infra.md               # Architektura chmurowa (GCP, Terraform)
│   └── tests.md               # Plan testów (unit, e2e, API)
│
├── apps/                      # Frontend + backend jako monorepo (Next.js)
│   ├── web/                   # Frontend PWA (Next.js, App Router)
│   └── api/                   # API Routes (Next.js REST)
│
├── jobs/                      # Cloud Run Jobs do OCR, AI, maili
│   ├── generate_description/
│   └── process_audit/
│
├── terraform/                 # IaC: infrastruktura GCP
│   ├── main.tf
│   ├── outputs.tf
│   └── variables.tf
│
├── .github/                   # GitHub Actions
│   └── workflows/
│       └── deploy.yml
│
└── public/                    # Publiczne zasoby, np. favicon, ogłoszenia
\`\`\`
EOF

