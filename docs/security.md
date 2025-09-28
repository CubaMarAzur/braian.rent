# Strategia Bezpieczeństwa Aplikacji Braian.rent
# Wersja 1.1 (Udoskonalona)

## 1. Wprowadzenie i Filozofia

Ten dokument określa kompleksową strategię bezpieczeństwa dla platformy Braian.rent. Naszym nadrzędnym celem jest ochrona danych naszych użytkowników i zapewnienie integralności oraz dostępności usługi.

**Nasza filozofia bezpieczeństwa:**
* **Security by Design:** Bezpieczeństwo jest wbudowane w architekturę, a nie dodawane na końcu.
* **Defense in Depth:** Stosujemy wielowarstwowe zabezpieczenia.
* **Principle of Least Privilege:** Każdy element systemu (użytkownik, serwis) ma minimalne uprawnienia niezbędne do działania.
* **Zero Trust:** Nie ufamy żadnemu ruchowi sieciowemu domyślnie, nawet wewnątrz naszej prywatnej sieci.

## 2. Model Zagrożeń (Threat Model)

* **Kluczowe Aktywa do Ochrony:**
    * **Dane Osobowe (PII):** Dane Właścicieli i Najemców (imiona, e-maile, telefony).
    * **Dane Finansowe:** Dane o płatnościach, w przyszłości dane bankowe.
    * **Dokumenty:** Umowy najmu, polisy, protokoły.
* **Główne Zagrożenia:**
    * **Nieautoryzowany Dostęp do Danych:** Przejęcie konta, wyciek danych z bazy.
    * **Manipulacja Danymi:** Zmiana kwot płatności, modyfikacja umów.
    * **Ataki Denial of Service (DoS):** Próby zablokowania dostępności aplikacji dla użytkowników.

## 3. Uwierzytelnianie i Autoryzacja (AuthN / AuthZ)

### Uwierzytelnianie
* **Metody:** E-mail/hasło oraz OAuth 2.0 (Google/Facebook).
* **Hasła:** Hashowane przy użyciu **Argon2**.
* **Sesje:** Zarządzane przez krótkotrwałe **JWT** i Refresh Tokens.
* **Wzmocnienie (Hardening):**
    * **Rate Limiting:** Endpointy `/login` i `/password-reset` muszą mieć zaimplementowany mechanizm ograniczający liczbę prób w danym czasie, aby chronić przed atakami brute-force.
    * **MFA (na roadmapie):** W przyszłości planowane jest wdrożenie Multi-Factor Authentication jako opcji dla użytkowników.

### Autoryzacja
* **RBAC:** Ścisłe rozdzielenie ról na `OWNER` i `TENANT`.
* **Resource-Based:** Każde zapytanie do API musi weryfikować, czy uwierzytelniony użytkownik jest właścicielem zasobu, o który prosi. Ta logika musi znajdować się w centralnym miejscu w warstwie API (np. middleware).

## 4. Bezpieczeństwo Danych i Aplikacji

* **Szyfrowanie:**
    * **W Tranzycie:** Wymuszony TLS 1.3 dla całej komunikacji (end-to-end).
    * **W Spoczynku:** Domyślne szyfrowanie zapewniane przez GCP dla Cloud SQL i GCS.
* **Zarządzanie Sekretami:** Wyłącznie **Google Secret Manager** dla środowisk produkcyjnych i stagingowych.
* **Bezpieczeństwo API:**
    * **Walidacja Danych Wejściowych:** Rygorystyczna walidacja po stronie serwera dla wszystkich danych przychodzących od klienta za pomocą `zod`.
    * **Polityka CORS:** Cross-Origin Resource Sharing będzie restrykcyjnie skonfigurowany, aby akceptować żądania tylko z domeny naszej aplikacji frontendowej.
    * **Nagłówki Bezpieczeństwa HTTP:** Aplikacja musi serwować odpowiednie nagłówki (CSP, HSTS, X-Content-Type-Options) w celu ochrony przed atakami na poziomie przeglądarki.

## 5. Bezpieczeństwo Infrastruktury

* **Cloud Run & Jobs:** Uruchamiane z dedykowanymi kontami serwisowymi (Service Accounts) o minimalnych, niezbędnych uprawnieniach IAM.
* **Cloud SQL:** Dostęp wyłącznie przez **Private IP** z użyciem **Serverless VPC Connector**. Regularne, automatyczne backupy i włączony Point-in-Time Recovery (PITR).
* **Google Cloud Storage:** Buckety są **prywatne**. Dostęp publiczny jest zablokowany na poziomie organizacji. Dostęp do plików odbywa się wyłącznie przez generowane przez backend, krótkotrwałe **Signed URLs**.

## 6. Logowanie, Monitoring i Reagowanie na Incydenty

Bezpieczeństwo to również zdolność do wykrywania i reagowania na incydenty.

* **Logowanie Bezpieczeństwa:** Musimy logować wszystkie kluczowe zdarzenia związane z bezpieczeństwem:
    * Udane i nieudane próby logowania (z adresem IP).
    * Zmiany hasła i adresu e-mail.
    * Zmiany uprawnień.
    * Dostęp do szczególnie wrażliwych danych.
* **Monitoring i Alerty:** Należy skonfigurować automatyczne alerty (np. w Google Cloud Logging) dla podejrzanych zdarzeń, takich jak:
    * Wielokrotne, nieudane próby logowania z jednego adresu IP.
    * Próby dostępu do zasobów bez uprawnień.
* **Plan Reagowania na Incydenty (Uproszczony):** W przypadku podejrzenia incydentu bezpieczeństwa, postępujemy wg kroków:
    1.  **Izolacja:** Ograniczenie wpływu incydentu (np. zablokowanie konta, rotacja kluczy).
    2.  **Analiza:** Zrozumienie, co się stało, jaki był zasięg i przyczyna.
    3.  **Działania Naprawcze:** Usunięcie luki bezpieczeństwa.
    4.  **Komunikacja:** Poinformowanie poszkodowanych użytkowników i odpowiednich organów (zgodnie z RODO) w wymaganym czasie.
    5.  **Post-Mortem:** Analiza po incydencje, aby wyciągnąć wnioski i ulepszyć system.

## 7. Zgodność z RODO (GDPR)

* **Podstawy Prawne:** Wszystkie operacje przetwarzania danych muszą mieć jasno zdefiniowaną podstawę prawną.
* **Prawa Użytkownika:** Aplikacja musi zapewniać mechanizmy do realizacji praw użytkowników (dostęp do danych, sprostowanie, usunięcie, przenoszenie).
* **Polityki Retencji:** Należy zdefiniować i wdrożyć polityki automatycznego usuwania danych, które nie są już niezbędne.
