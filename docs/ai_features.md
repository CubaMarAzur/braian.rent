# Plan Strategiczny Funkcji AI w Braian.rent

# Wersja 1.1 (Udoskonalona)

## 1. Wizja i Filozofia AI

Sztuczna Inteligencja w Braian.rent jest kluczowym filarem strategii produktu. Naszym celem jest stworzenie **Asystenta AI**, który działa jako cyfrowy, kompetentny zarządca nieruchomości.

**Filozofia naszego AI:**

- **Wsparcie, nie Zastępstwo:** AI ma wspierać i automatyzować, ale ostateczna decyzja zawsze należy do użytkownika.
- **Kontekst jest Królem:** Każda interakcja AI musi być głęboko osadzona w kontekście danych użytkownika (nieruchomości, umów, płatności), aby dostarczać precyzyjne i trafne odpowiedzi.
- **Proaktywność i Przewidywanie:** System ma nie tylko reagować, ale także przewidywać potrzeby i informować o nich z wyprzedzeniem (np. zbliżający się koniec umowy).
- **Bezpieczeństwo i Etyka:** Działamy z pełnym poszanowaniem prywatności, transparentności i uczciwości algorytmicznej.

## 2. Architektura i Moduły AI

### Moduł 1: Asystent Konwersacyjny (oparty o RAG)

Ten moduł stanowi serce naszego "know-how". Przekształca statyczne procedury w dynamicznego, interaktywnego asystenta.

- **Cel:** Natychmiastowe dostarczanie użytkownikom sprawdzonych rozwiązań i prowadzenie ich przez złożone procesy.
- **Architektura:** Zastosujemy model **Retrieval-Augmented Generation (RAG)**.
  1.  **Baza Wiedzy (Knowledge Base):** Twoje procedury (z PDF-ów) zostaną przekształcone w wektorową bazę danych.
  2.  **Zapytanie Użytkownika:** Gdy użytkownik wpisuje problem na czacie, system najpierw przeszukuje bazę wiedzy w poszukiwaniu najbardziej relevantnych procedur.
  3.  **Wzbogacone Zapytanie (Augmented Prompt):** Znalezione procedury są dołączane do zapytania użytkownika i wysyłane do modelu językowego (LLM).
  4.  **Odpowiedź:** LLM generuje odpowiedź, która jest ściśle oparta na Twoim "know-how", a nie na swojej ogólnej wiedzy.
- **Przykład Zastosowania (Wymiana wodomierzy):**
  1.  **Właściciel pyta:** "Co mam zrobić, jak w budynku wymieniają wodomierze?"
  2.  **Asystent AI (RAG):** "Zgodnie z procedurą, powinieneś wykonać następujące kroki: 1. Poinformuj najemców o planowanej dacie. 2. Po wymianie poproś ich o zdjęcie protokołu. 3. Prześlij zdjęcie protokołu tutaj, a ja odczytam z niego nowe stany liczników i numer seryjny, aby zaktualizować system. Czy chcesz, żebym przygotował teraz szablon wiadomości do najemców?"
- **Proponowana Technologia:** Wektorowa baza danych (np. Pinecone, ChromaDB), Model Językowy (LLM) via API (np. Gemini API, GPT API).

### Moduł 2: Przetwarzanie Dokumentów (Inteligentny OCR)

- **Cel:** Pełna automatyzacja ekstrakcji danych ze skanów i zdjęć dokumentów.
- **Przepływ Pracy (Workflow):**
  1.  **Upload:** Użytkownik przesyła plik (PDF/JPG).
  2.  **OCR:** System wysyła plik do usługi OCR, która zamienia obraz na tekst.
  3.  **Ekstrakcja i Klasyfikacja (AI):** Model AI analizuje surowy tekst, identyfikuje typ dokumentu (faktura, umowa, protokół) i wyciąga z niego kluczowe dane (daty, kwoty, numery liczników, dane stron).
  4.  **Walidacja i Sugestia:** System prezentuje użytkownikowi wyciągnięte dane z prośbą o potwierdzenie, np. "Czy chcesz utworzyć płatność za media na kwotę 123,45 zł z terminem płatności na 15.11.2025 na podstawie tej faktury?"
- **Proponowana Technologia:** Google Cloud Vision API (dla OCR), niestandardowe zapytania do LLM (dla ekstrakcji i klasyfikacji).

### Moduł 3: Scoring i Weryfikacja Najemcy

- **Cel:** Dostarczenie Właścicielowi wielowymiarowej oceny ryzyka związanego z potencjalnym najemcą.
- **Podejście Iteracyjne:** Zaczniemy od prostego modelu, który będziemy stopniowo wzbogacać o nowe źródła danych.
  - **Etap 1 (prosty scoring):** Ocena oparta na danych z profilu Braian.rent (kompletność danych, historia w aplikacji).
  - **Etap 2 (weryfikacja premium):** Płatna integracja z dostawcami usług weryfikacji tożsamości i analizy finansowej (Open Banking / PSD2), która dostarczy twardych danych o wiarygodności.
- **Proponowana Technologia:** Własny model statystyczny, API dostawców usług finansowych.

## 3. Etyka i Bezpieczeństwo AI

- **Prywatność Danych:** Stosujemy zasadę minimalizacji danych. Do zewnętrznych modeli AI wysyłane są tylko niezbędne, w miarę możliwości zanonimizowane informacje.
- **Bezstronność i Sprawiedliwość (Bias & Fairness):** Model scoringu najemcy będzie regularnie audytowany pod kątem potencjalnych uprzedzeń (bias), aby zapewnić, że jego oceny są sprawiedliwe i oparte wyłącznie na obiektywnych, zdefiniowanych kryteriach.
- **Przejrzystość:** Sugestie AI (np. wygenerowany opis nieruchomości) będą zawsze wyraźnie oznaczone. W przypadku scoringu, Właściciel otrzyma informację, jakie czynniki wpłynęły na ocenę.
- **Kontrola Użytkownika ("Human in the Loop"):** AI jest narzędziem wspomagającym. Wszystkie istotne akcje (np. wysłanie umowy, utworzenie płatności, akceptacja najemcy) muszą być ostatecznie zatwierdzone przez człowieka.

## 4. Techniczna Roadmapa Wdrożenia AI

Implementacja będzie zgodna z główną roadmapą produktu, z uwzględnieniem następujących zależności technicznych.

- **Wersja v1.1: Inteligentne Treści**
  - **Funkcje:** Generator Opisu, Asynchroniczne OCR.
  - **Wymagania Techniczne:** Uruchomienie i skonfigurowanie infrastruktury dla Cloud Run Jobs, integracja z API Google Vision i wybranym LLM.
- **Wersja v1.2: Bezpieczeństwo i Media**
  - **Funkcje:** Scoring Najemcy (etap 1).
  - **Wymagania Techniczne:** Zbudowanie mechanizmu do zbierania i analizy danych z profili użytkowników.
- **Wersja v1.3 i dalsze: Pełna Automatyzacja**
  - **Funkcje:** Asystent Konwersacyjny (RAG), Scoring Najemcy (etap 2).
  - **Wymagania Techniczne:** Wdrożenie wektorowej bazy danych, integracja z dostawcami usług finansowych (API bankowe).
