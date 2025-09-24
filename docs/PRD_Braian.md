# PRD — Braian (MVP Slim)
**Wersja:** 0.1  
**Właściciel dokumentu:** Jakub Mazur  
**Status:** Draft

## 1. Streszczenie
**Braian** to aplikacja dla właścicieli mieszkań, którzy chcą samodzielnie zarządzać najmem w sposób tańszy, prostszy i bezpieczny. MVP skupia się na podstawowych funkcjach niezbędnych do rozpoczęcia działania, bez integracji płatności, OCR ani AI.

## 2. Cel biznesowy
- Ograniczyć koszty zarządzania najmem o ~80% względem firm zewnętrznych.
- Umożliwić właścicielowi przeprowadzenie najmu samodzielnie i zgodnie z dobrymi praktykami.
- W przyszłości zautomatyzować działania dzięki AI, ale MVP musi być lekkie, szybkie i bezpieczne.

## 3. Użytkownicy
- **Owner (właściciel):** dodaje mieszkanie, przechowuje dokumenty, komunikuje się z najemcą.
- **Tenant (najemca):** loguje się, przegląda umowę, ma dostęp do historii płatności i prostego czatu.

## 4. Zakres MVP (Faza 0 – MVP Slim)
- Rejestracja/logowanie użytkownika.
- Ręczne dodanie nieruchomości (formularz).
- Upload dokumentów PDF/JPG (przechowywanie w GCS).
- Prosty dashboard właściciela (2–3 metryki).
- Podgląd umowy najmu dla najemcy (plik PDF).
- Historia płatności (na razie statyczna).
- Prosty czat między najemcą a właścicielem (Firestore realtime).
- Kolejki zadań (Pub/Sub + Cloud Run Jobs) od dnia 1 – backend przyjmuje tylko lekkie requesty (202 Accepted).
- Monitoring i logowanie: Sentry, PostHog, Cloud Logging.
## 5. Zakres poza MVP (v1.1+)
- **v1.1:** OCR (Vision API), generator opisu ogłoszenia (AI).
- **v1.2:** rozliczenia mediów, scoring najemcy, publikacja ogłoszeń.
- **v1.3:** analiza zdjęć (Cloudinary), promocje ofert, podpis PZO.
- **v1.4:** automatyczne checklisty audytu, analiza dokumentów.

## 6. Kluczowe ścieżki MVP
1. Owner zakłada konto → dodaje nieruchomość → uploaduje dokumenty → widzi dane w dashboardzie.
2. Tenant loguje się → przegląda przypisaną umowę → może napisać wiadomość do właściciela.
3. Owner przegląda wiadomości (Firestore realtime) → odpowiada najemcy.

## 7. Architektura techniczna (zgodna ze specyfikacją)
- Frontend: Next.js (App Router, TypeScript, Tailwind, shadcn/ui).
- Backend: Cloud Run stateless, API w Next.js API Routes.
- Baza danych: Cloud SQL Postgres (Private IP, PITR, Secret Manager).
- Storage: GCS z Signed URLs.
- Komunikacja realtime: Firestore (tylko wiadomości).
- Kolejki i asynchroniczne joby: Pub/Sub + Cloud Run Jobs (od razu).
- CI/CD: GitHub Actions + gcloud deploy.
- Infrastruktura: Terraform (Cloud SQL, GCS, Firestore, Pub/Sub, VPC Connector, Secret Manager).

## 8. Model danych (Prisma – zakres MVP)
- `users` (id, email, role, created_at)
- `properties` (id, owner_id, address, size, rooms, etc.)
- `property_photos` (id, property_id, url, is_primary)
- `documents` (id, owner_id, file_url, type, status)
- `threads` + `messages` (FireStore realtime, z metadanymi w PG)
- `leases` (id, property_id, tenant_id, rent_amount, status)
- `payments` (statyczne w MVP, logika w v1.1+)

## 9. Zakres integracji (tylko niezbędne)
- GCS (przechowywanie plików)
- Firestore (czat realtime)
- Cloud SQL (dane główne)
- Secret Manager (sekrety produkcyjne)
- Monitoring: Sentry, PostHog, Cloud Logging
- Brak płatności, brak OCR, brak AI – tylko struktura gotowa na przyszłość

## 10. Ryzyka
- Nadmierne rozbudowanie MVP → MVP Slim ma ograniczony, zdefiniowany zakres.
- Przeciążenie backendu → zabezpieczone kolejkowaniem i ograniczeniem requestów do 202 Accepted.
- Koszty AI w przyszłości (Vision API, Cloudinary) → limitowane przez feature flags i limit jobów.
- Opóźnienia w komunikacji → rozwiązane poprzez Firestore (realtime) i separację metadanych w PG.

## 11. Roadmapa funkcjonalna (zgodna z dokumentem technicznym)
- **Etap 0 (Core):** repo, Auth.js, Cloud Run, Cloud SQL, GCS, Terraform, logging.
- **Etap 1 (Owner):** dodanie nieruchomości, upload dokumentów, dashboard, makiety.
- **Etap 2 (Tenant):** dostęp do umowy (plik), historia płatności (statyczna), czat.
- **Etap 3 (Komunikacja):** chat Firestore + OneSignal push.
- **MVP Launch**
- **v1.1:** OCR (Vision), AI ogłoszenia, kolejki z obsługą retry i idempotencji.

## 12. Decyzje nieodwracalne (ADR)
- Architektura oparta na Cloud Run (bez VM, bez stateful komponentów).
- Firestore jako silnik realtime komunikacji (prosty front, natychmiastowe wiadomości).
- Pub/Sub + Cloud Run Jobs jako baza do OCR/AI/powiadomień w przyszłości.
- Podział danych między Firestore (wiadomości) a Postgres (metadane, sortowanie).

