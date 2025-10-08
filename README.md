# Braian.rent — Autonomiczny Agent Najmu

**Braian.rent** to aplikacja do zarządzania najmem, która pozwala właścicielom mieszkań samodzielnie i profesjonalnie prowadzić proces wynajmu — bez pośredników, z pomocą AI i automatyzacji.

---

## Cel Projektu

Uregulowanie rynku najmu w Polsce poprzez budowanie świadomości dobrych praktyk, weryfikację obu stron i automatyzację kluczowych procesów.

---

## Zakres MVP Slim

- Rejestracja/logowanie (Właściciel, Najemca)
- Dodanie nieruchomości i zaproszenie najemcy
- Dashboard w formie checklisty
- Prosty czat i ręczne zarządzanie płatnościami
- Upload kluczowych dokumentów (bez OCR)

---

## Kluczowe Technologie

| Warstwa         | Technologia                |
| --------------- | -------------------------- |
| Frontend        | Next.js + Tailwind CSS     |
| Backend         | Next.js API Routes (REST)  |
| Baza Danych     | PostgreSQL (Cloud SQL)     |
| Zadania w Tle   | Pub/Sub + Cloud Run Jobs   |
| Czat (Realtime) | Firestore                  |
| Storage         | Google Cloud Storage       |
| CI/CD & Infra   | GitHub Actions + Terraform |

---

## Getting Started (Uruchomienie lokalne)

To jest projekt [Next.js](https://nextjs.org) stworzony za pomocą [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Najpierw, uruchom serwer deweloperski:

```bash
npm run dev
```
