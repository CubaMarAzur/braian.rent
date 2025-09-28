# Kryteria Akceptacji (AC) dla Braian.rent – MVP Slim
# Wersja 2.1 (Udoskonalona)

Poniższy dokument definiuje kryteria akceptacji dla kluczowych funkcjonalności MVP. Scenariusze zostały zoptymalizowane pod kątem przejrzystości i testowalności.

---

## 1. Onboarding i zarządzanie Najemcą

### Scenariusz 1.1: Właściciel zaprasza nowego Najemcę przez e-mail
* **Given** jestem zalogowany jako Właściciel i zarządzam nieruchomością bez przypisanego najemcy.
* **When** w panelu nieruchomości wybiorę opcję "Zaproś najemcę", wpiszę adres e-mail osoby, która nie ma konta w systemie, i wyślę zaproszenie.
* **Then** system wyśle e-mail z unikalnym linkiem do rejestracji na podany adres.
* **And** po tym, jak zaproszona osoba pomyślnie się zarejestruje, zostanie automatycznie powiązana z moją nieruchomością, a ja zobaczę jej dane w panelu.

### Scenariusz 1.2: Właściciel przypisuje istniejącego Najemcę przez aplikację
* **Given** jestem zalogowany jako Właściciel, a Najemca, którego chcę dodać, ma już konto w systemie.
* **When** w panelu nieruchomości wybiorę opcję "Dodaj istniejącego najemcę", wyszukam go po adresie e-mail i wyślę zaproszenie.
* **Then** najemca otrzyma w aplikacji powiadomienie o zaproszeniu do umowy.
* **And** gdy najemca zaakceptuje zaproszenie, zostanie powiązany z moją nieruchomością, co będzie widoczne w moim panelu.

---

## 2. Zarządzanie Płatnościami

### Scenariusz 2.1: Właściciel tworzy nową należność
* **Given** jestem zalogowany jako Właściciel i zarządzam nieruchomością z aktywnym najemcą.
* **When** w sekcji płatności kliknę "Dodaj należność", wybiorę jej typ (np. "Czynsz najmu"), wpiszę kwotę oraz termin płatności.
* **Then** nowa należność ze statusem "Niezapłacona" pojawi się na liście płatności u mnie oraz w panelu najemcy.

### Scenariusz 2.2: Właściciel oznacza płatność jako w pełni opłaconą
* **Given** na liście płatności istnieje należność ze statusem "Niezapłacona".
* **When** wybiorę dla niej opcję "Oznacz jako zapłacone".
* **Then** status tej należności zmieni się na "Zapłacona", a data operacji zostanie zapisana.

### Scenariusz 2.3: Właściciel rejestruje niepełną wpłatę
* **Given** na liście płatności istnieje należność o wartości 2000 zł.
* **When** wybiorę dla niej opcję "Zarejestruj niepełną wpłatę" i wpiszę kwotę 1500 zł.
* **Then** status należności zmieni się na "Niepełna wpłata", a w szczegółach będzie widoczne, że wpłacono 1500 zł i pozostało 500 zł do zapłaty.

---

## 3. Dashboard Właściciela i Zarządzanie Nieruchomością

### Scenariusz 3.1: Widok dashboardu z danymi najemcy i płatności
* **Given** jestem zalogowany jako Właściciel.
* **When** na dashboardzie wybiorę nieruchomość, która jest obecnie wynajmowana.
* **Then** w panelu nieruchomości zobaczę sekcję z danymi najemcy: jego zdjęcie profilowe, wiek, numer telefonu i adres e-mail.
* **And** zobaczę ikonę umożliwiającą rozpoczęcie rozmowy na czacie.
* **And** zobaczę również status bieżącej płatności dla tej nieruchomości (np. "Oczekuje na wpłatę do 10.10.2025").

### Scenariusz 3.2: Statusy dokumentów na dashboardzie (czerwony/zielony)
* **Given** jestem na dashboardzie wynajmowanej nieruchomości.
* **And** do nieruchomości nie załączono jeszcze pliku z ubezpieczeniem, ale załączono plik z umową.
* **When** spojrzę na sekcję "Dokumenty".
* **Then** pozycja "Ubezpieczenie" będzie oznaczona kolorem **czerwonym**.
* **And** pozycja "Umowa" będzie oznaczona kolorem **zielonym**.

### Scenariusz 3.3: Dodawanie dokumentu i aktualizacja statusu
* **Given** jestem na dashboardzie, a status dokumentu "Ubezpieczenie" jest czerwony.
* **When** kliknę w pozycję "Ubezpieczenie", prześlę plik z polisą i wpiszę jej datę ważności.
* **Then** po powrocie na dashboard, status dokumentu "Ubezpieczenie" zmieni się na **zielony**.

### Scenariusz 3.4: Przełączanie ról w aplikacji
* **Given** jestem zalogowany jako użytkownik, który jest jednocześnie Właścicielem i Najemcą.
* **When** w menu profilu wybiorę opcję "Przełącz na profil Najemcy".
* **Then** interfejs aplikacji zmieni się na widok Najemcy, prezentując dane związane z nieruchomością, którą wynajmuję.

