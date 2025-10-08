# Runbook Operacyjny Aplikacji Braian.rent

# Wersja 1.1

## 1. Wprowadzenie

Ten dokument jest centralnym źródłem wiedzy na temat operacji, wdrożeń i utrzymania aplikacji Braian.rent. Jest to obowiązkowa lektura dla każdego dewelopera dołączającego do projektu.

**Filozofia Operacyjna:**

- **Automate Everything:** Wszystkie powtarzalne zadania muszą być zautomatyzowane.
- **Infrastructure as Code (IaC):** Infrastruktura jest w 100% definiowana w kodzie (Terraform). Ręczne zmiany w konsoli GCP są niedozwolone.
- **You Build It, You Run It:** Zespół deweloperski jest odpowiedzialny za cały cykl życia aplikacji, od kodu po działanie na produkcji.

## 2. Onboarding Nowego Dewelopera

Każdy nowy członek zespołu musi przejść przez poniższe kroki, aby skonfigurować lokalne środowisko deweloperskie.

1.  **Klonowanie Repozytorium:** `git clone git@github.com:CubaMarAzur/braian.rent.git`
2.  **Instalacja Narzędzi:** Upewnij się, że masz zainstalowane `nvm` (dla zarządzania wersją Node.js) i `Docker` (dla lokalnej bazy danych).
3.  **Instalacja Zależności:** W głównym folderze projektu uruchom `npm install`.
4.  **Konfiguracja Zmiennych Środowiskowych:**
    - Skopiuj plik `.env.example` do nowego pliku `.env`: `cp .env.example .env`.
    - Uzupełnij plik `.env` o niezbędne wartości, w szczególności `DATABASE_URL` dla lokalnej bazy danych.
5.  **Uruchomienie Lokalnej Bazy Danych:** W głównym folderze projektu znajduje się plik `docker-compose.yml`. Uruchom bazę danych w tle za pomocą komendy: `docker-compose up -d`.
6.  **Uruchomienie Migracji Bazy Danych:** Aby stworzyć wszystkie tabele w lokalnej bazie, użyj komendy Prisma: `npx prisma migrate dev`.
7.  **Uruchomienie Aplikacji:** Uruchom serwer deweloperski: `npm run dev`. Aplikacja powinna być dostępna pod adresem `http://localhost:3000`.

## 3. Środowiska (Environments)

- **`local`:** Środowisko deweloperskie na komputerze każdego programisty.
- **`staging`:** Środowisko testowe, które jest wierną kopią produkcji. Wszystkie zmiany są wdrażane tutaj przed wdrożeniem na produkcję. Na tym środowisku uruchamiane są testy E2E.
- **`production`:** Środowisko, z którego korzystają końcowi użytkownicy.

## 4. Proces Wdrożenia (Deployment)

Wdrożenia są w pełni zautomatyzowane i oparte o strategię Git Flow.

1.  Praca odbywa się na gałęziach `feature/*`.
2.  Gotowa funkcja trafia do `main` poprzez **Pull Request (PR)**.
3.  **Warunki scalenia PR:**
    - Zatwierdzenie przez co najmniej jednego innego dewelopera (Code Review).
    - Pomyślne przejście wszystkich testów w procesie CI (GitHub Actions).
    - Tytuł PR musi być zgodny ze standardem Conventional Commits.
4.  Scalenie z `main` automatycznie uruchamia pipeline CD, który wdraża zmiany na środowisko **produkcyjne**.

## 5. Zarządzanie Migracjami Bazy Danych

Zmiany w schemacie bazy danych (`schema.prisma`) to operacje wysokiego ryzyka i muszą być przeprowadzane z najwyższą ostrożnością.

1.  **Tworzenie Migracji:** Nową migrację tworzymy **lokalnie** za pomocą komendy `npx prisma migrate dev --name nazwa-zmiany`.
2.  **Code Review:** Wygenerowany plik migracji jest częścią Pull Requesta i podlega standardowemu procesowi review.
3.  **Aplikowanie Migracji:** Prisma automatycznie aplikuje migracje na produkcyjnej bazie danych w trakcie procesu wdrożenia.
4.  **Zasada:** Wszystkie migracje muszą być **kompatybilne wstecz (backward-compatible)**. Unikamy zmian, które mogłyby zepsuć działanie starej wersji aplikacji, zanim nowa zostanie w pełni wdrożona (np. usuwanie kolumn).

## 6. Procedury Awaryjne (Rollback)

W przypadku krytycznego błędu na produkcji:

- **Preferowana Metoda:** Użycie opcji **"Revert"** na GitHubie dla PR, który wprowadził błąd, a następnie wdrożenie nowej wersji.
- **Szybka Metoda:** Ręczne wdrożenie poprzedniej, stabilnej rewizji w panelu **Google Cloud Run**.

## 7. Monitoring, Logowanie i Alerty

- **Błędy Aplikacji:** **Sentry** jest naszym głównym narzędziem do śledzenia wyjątków w czasie rzeczywistym.
- **Logi Systemowe:** **Google Cloud Logging** agreguje logi z Cloud Run, Cloud SQL i innych usług GCP.
- **Dostępność (Uptime):** **Google Cloud Monitoring (Uptime Checks)** monitoruje endpoint `/api/v1/health` i wysyła alert w przypadku braku odpowiedzi.

## 8. Zarządzanie Sekretami

Sekrety są zarządzane wyłącznie przez **Google Secret Manager**. Procedura dodawania nowego sekretu jest opisana w dokumencie `security.md`.
