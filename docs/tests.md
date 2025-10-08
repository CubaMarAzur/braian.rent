# Plan Testów i Jakości Aplikacji

# Wersja 1.1 (Udoskonalona)

Ten dokument opisuje kompleksową strategię zapewnienia jakości (QA) dla aplikacji Braian.rent. Celem jest nie tylko weryfikacja funkcjonalności, ale także zapewnienie wydajności, bezpieczeństwa i dostępności produktu.

## 1. Filozofia Testowania

Naszym celem jest budowanie z **pewnością i spokojem**. Automatyzacja jest fundamentem naszego procesu, pozwalającym na szybkie iteracje i wdrażanie zmian przy minimalnym ryzyku regresji. Testy traktujemy jako integralną część procesu deweloperskiego, a nie jako osobny etap.

## 2. Piramida Testów Funkcjonalnych

Strategia testów funkcjonalnych opiera się na klasycznej piramidzie.

### Poziom 1: Testy Jednostkowe (Unit Tests)

- **Cel:** Weryfikacja najmniejszych, izolowanych fragmentów logiki biznesowej i komponentów UI.
- **Technologia:** **Vitest**.
- **Zakres:** ~70% pokrycia kodu. Testujemy wszystkie kluczowe funkcje (kalkulacje, walidacje, transformacje danych) oraz warianty renderowania komponentów.

### Poziom 2: Testy Integracyjne (Integration Tests)

- **Cel:** Weryfikacja współpracy kilku modułów, w szczególności interakcji komponentów frontendowych z API.
- **Technologia:** **Vitest** + **Mock Service Worker (MSW)**.
- **Zakres:** Testowanie pełnych formularzy, interakcji z zamockowanym API, przepływu danych między komponentami.

### Poziom 3: Testy End-to-End (E2E)

- **Cel:** Automatyzacja pełnych scenariuszy użytkownika w realnej przeglądarce, testując całą aplikację od frontendu po bazę danych.
- **Technologia:** **Playwright**.
- **Środowisko:** Testy E2E będą uruchamiane na dedykowanym środowisku `staging`, które jest wierną kopią środowiska produkcyjnego i jest zasilane danymi testowymi.

## 3. Priorytetowe Scenariusze E2E dla MVP

Następujące ścieżki z `ux_notes.md` muszą być w 100% pokryte stabilnymi testami E2E:

1.  **Onboarding Najemcy:** Od zaproszenia e-mail, przez rejestrację z weryfikacją SMS, aż po akceptację umowy.
2.  **Cykl Życia Płatności:** Stworzenie należności przez Właściciela, oznaczenie jej jako opłaconej i weryfikacja statusu po stronie Najemcy.
3.  **Zarządzanie Dokumentami:** Upload dokumentu, weryfikacja zmiany statusu na dashboardzie (z czerwonego na zielony).
4.  **Komunikacja na Czacie:** Wysłanie i otrzymanie wiadomości w czasie rzeczywistym.
5.  **Przełączanie Ról:** Poprawna zmiana kontekstu aplikacji dla użytkownika będącego jednocześnie Właścicielem i Najemcą.

## 4. Dodatkowe Wymiary Testowania (Poza Piramidą)

Oprócz testów funkcjonalnych, będziemy zwracać uwagę na kluczowe aspekty niefunkcjonalne.

### Testy Wydajności

- **Cel:** Upewnienie się, że aplikacja działa szybko i responsywnie.
- **Metoda w MVP:** Na tym etapie skupimy się na monitoringu. Będziemy używać narzędzi (np. Google Lighthouse, PageSpeed Insights) do regularnego audytu kluczowych widoków (dashboard, lista nieruchomości) i optymalizacji czasu ładowania.

### Testy Bezpieczeństwa

- **Cel:** Zapewnienie ochrony danych użytkowników i odporności na podstawowe ataki.
- **Metoda w MVP:**
  - Regularne skanowanie zależności w projekcie w poszukiwaniu podatności.
  - Code review ze szczególnym uwzględnieniem podstawowych zasad bezpieczeństwa (walidacja danych wejściowych, autoryzacja dostępu do zasobów - np. czy właściciel A może zobaczyć dane właściciela B).
  - Przestrzeganie zaleceń OWASP Top 10.

### Testy Dostępności (Accessibility, a11y)

- **Cel:** Zapewnienie, że aplikacja jest używalna dla osób z niepełnosprawnościami.
- **Metoda w MVP:**
  - Użycie automatycznych narzędzi (np. `axe`) w trakcie developmentu do wykrywania podstawowych problemów.
  - Ręczne testy nawigacji za pomocą klawiatury dla kluczowych ścieżek.

## 5. Proces i Zarządzanie Jakością

### Zarządzanie Danymi Testowymi

- **Strategia:** Stworzymy dedykowane skrypty (`seed scripts`), które będą zasilać naszą deweloperską i stagingową bazę danych spójnym zestawem danych testowych (np. użytkownicy "Marek" i "Anna", 3 nieruchomości, kilka umów i płatności). Zapewni to powtarzalność testów.

### Zarządzanie Defektami (Błędami)

- **Narzędzie:** **GitHub Issues**.
- **Proces:** Każdy znaleziony błąd jest zgłaszany jako nowe "Issue" z opisem, krokami do reprodukcji i oczekiwanym rezultatem. Błąd przechodzi przez cykl życia: `New` -> `In Progress` -> `Ready for Review` -> `Done`.

### Ciągła Integracja (CI/CD)

- **Narzędzie:** **GitHub Actions**.
- **Proces:** Każdy Pull Request do głównej gałęzi `main` musi pomyślnie przejść wszystkie testy automatyczne (jednostkowe, integracyjne). Testy E2E będą uruchamiane automatycznie po wdrożeniu na środowisko `staging`.
