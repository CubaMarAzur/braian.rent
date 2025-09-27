# Acceptance Criteria – Braian MVP Slim

## 1. Rejestracja i profil najemcy

### 1.1 Rejestracja
- Najemca może zarejestrować się przez e-mail, Google lub Facebook.
- Po rejestracji domyślnie przypisywana jest rola "TENANT".
- Nie jest wymagane zatwierdzanie profilu przez administratora.

### 1.2 Uzupełnianie profilu
- Profil musi zawierać: imię, wiek, zdjęcie, social media (np. LinkedIn), źródło dochodu.
- Po uzupełnieniu danych najemca jest widoczny w systemie.
- Profil najemcy jest publiczny i może być przeglądany przez właścicieli.

---

## 2. Dodawanie nieruchomości

### 2.1 Formularz nieruchomości
- Właściciel może dodać nieruchomość przez prosty formularz z podstawowymi danymi (adres, metraż, pokoje).
- Rozszerzone dane (zdjęcia, media, liczniki, opis) mogą być dodane później.

### 2.2 Publikacja ogłoszenia
- Po dodaniu nieruchomości, właściciel może wygenerować opis przez AI.
- Po zatwierdzeniu opisu przez właściciela i moderację systemu, ogłoszenie trafia do marketplace.

---

## 3. Połączenie najemca – właściciel

### 3.1 Aplikowanie do ogłoszenia
- Najemca może filtrować oferty i kliknąć "Zgłoś się", aby wyrazić zainteresowanie.
- Tylko zweryfikowany profil może aplikować.

### 3.2 Decyzja właściciela
- Właściciel widzi profil najemcy i może zaakceptować zgłoszenie.
- Po akceptacji rozpoczyna się komunikacja przez chat.

---

## 4. Komunikacja i chat

### 4.1 System wiadomości
- Komunikacja między najemcą a właścicielem odbywa się wyłącznie przez wbudowany chat.
- Chat działa w czasie rzeczywistym (Firestore).
- Braian odpowiada na pytania i moderuje zgłoszenia (LLM).

### 4.2 Zgłaszanie usterek
- Najemca zgłasza awarie przez chat.
- Bot wymusza podanie szczegółów: opis, zdjęcie, lokalizacja.

---

## 5. Umowy i dokumenty

### 5.1 Drafty umów
- Właściciel ma dostęp do gotowych szablonów umów.
- Drafty mogą być uzupełniane ręcznie w aplikacji (bez podpisu i OCR).

### 5.2 Widoczność dla najemcy
- Najemca widzi propozycję umowy w panelu i może ją pobrać.

### 5.3 Checklisty obowiązków
- Po akceptacji umowy, najemca widzi checklistę z obowiązkami (np. zgłoszenie do US, OC).

---

## 6. Liczniki i media

### 6.1 Przypisanie liczników
- Liczniki są przypisane do nieruchomoścy.

### 6.2 Wprowadzanie stanów
- Najemca ręcznie wprowadza stan liczników.
- Właściciel może zatwierdzić lub skorygować dane.

### 6.3 Brak przeliczania
- W MVP brak funkcji przeliczania opłat na podstawie zużycia.

---

## 7. Audyty

### 7.1 Ustawienie harmonogramu
- Właściciel może ustawić audyt co 2, 3, 4 lub 6 miesięcy.

### 7.2 Wypełnienie audytu przez najemcę
- Najemca otrzymuje checklistę, robi zdjęcia i dodaje opisy.
- Pliki są przesyłane do GCS.

---

## 8. Historia płatności

### 8.1 Rejestracja płatności
- Właściciel ręcznie oznacza płatności jako „opłacone”.

### 8.2 Widok dla najemcy
- Najemca widzi historię opłat.
- Brak funkcji "Zapłać" w MVP.

---

## 9. Uprawnienia i konta

### 9.1 Powiązanie kont
- Każda nieruchomość może mieć jednego właściciela.
- Konto najemcy jest powiązane z konkretną nieruchomością.
- W przyszłości możliwe dodanie współwłaściciela lub pełnomocnika.


