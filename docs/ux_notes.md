# Notatki UX i Ścieżki Użytkownika (User Flows)
# Wersja 1.0

Ten dokument opisuje kluczowe założenia User Experience oraz główne podróże użytkownika (User Journeys) w aplikacji Braian.rent w wersji MVP Slim.

## 1. Uproszczone Persony

Aby projektować z myślą o użytkowniku, posługujemy się dwiema uproszczonymi personami:

* **Właściciel "Marek":** Mężczyzna w wieku 35-50 lat, posiada 1-3 mieszkania na wynajem, które traktuje jako inwestycję. Jest obeznany z technologią, ale ceni swój czas. Jego głównym celem jest porządek w dokumentach, terminowe płatności i bezproblemowa komunikacja z najemcami. Chce mieć poczucie kontroli i bezpieczeństwa.

* **Najemca "Anna":** Kobieta w wieku 25-35 lat, pracuje jako specjalistka w dużej firmie. Oczekuje, że procesy związane z wynajmem będą cyfrowe, proste i transparentne. Chce mieć łatwy dostęp do swojej umowy, historii płatności i szybki kanał komunikacji w razie awarii.

## 2. Kluczowe Założenia i Standardy UX

Poniższe zasady stanowią fundament doświadczenia użytkownika w aplikacji:

* **Szybkość i Responsywność:** Interfejs musi być szybki. Podczas ładowania danych dynamicznych (np. na dashboardzie) stosujemy **szkielety interfejsu (Skeleton Loaders)**, aby unikać "skakania" treści i dawać poczucie natychmiastowego działania.

* **Zapamiętywanie Kontekstu:** Aplikacja powinna minimalizować liczbę kliknięć. Kluczowe wybory, takie jak ostatnio przeglądana nieruchomość na dashboardzie Właściciela, są **zapamiętywane (State Persistence)** między sesjami.

* **Ciągła Informacja Zwrotna:** Każda ważna akcja użytkownika (np. zmiana roli, wysłanie zaproszenia) jest potwierdzana subtelnym, nietrwałym komunikatem (tzw. **"Toast Notification"**), np. "Pomyślnie przełączono profil".

* **Powiadomienia "w Kontekście":** W MVP powiadomienia są subtelne. Nowa wiadomość na czacie jest sygnalizowana przez **wskaźnik (badge)** na ikonie wiadomości, który pojawia się w czasie rzeczywistym (dzięki **Firestore listener**). Dodatkowo, jeśli użytkownik jest w innej karcie przeglądarki, **favicona** aplikacji również pokazuje wskaźnik.

* **Dostępność (Accessibility):** Wszystkie kluczowe elementy nawigacyjne (menu, przełączniki) muszą być w pełni obsługiwane za pomocą klawiatury.

## 3. Główne Ścieżki Użytkownika (User Flows)

### Ścieżka 1: Pełny Onboarding (Właściciel + Najemca)

1.  **[Właściciel Marek]** loguje się po raz pierwszy. Widzi pusty dashboard z wyraźnym wezwaniem do działania: "Dodaj swoją pierwszą nieruchomość".
2.  Marek klika przycisk, wypełnia prosty formularz (adres, miasto etc.) i dodaje nieruchomość "Poznańska".
3.  Zostaje przeniesiony na dashboard tej nieruchomości. Widzi status "Nie wynajęta" i przycisk "Zaproś najemcę".
4.  Klika przycisk, wpisuje adres e-mail **[Najemcy Anny]** i wysyła zaproszenie. W systemie tworzona jest nowa "Umowa (Lease)" w stanie oczekującym.
5.  **[System]** wysyła e-mail z linkiem do rejestracji do Anny.
6.  **[Najemca Anna]** klika w link. Przechodzi proces rejestracji: podaje e-mail, hasło, a następnie **weryfikuje numer telefonu kodem SMS**.
7.  Po weryfikacji, system pyta o rolę. Anna wybiera "Jestem najemcą" i uzupełnia podstawowe dane profilowe.
8.  Po zalogowaniu Anna od razu widzi swój dashboard, na którym czeka na nią prośba o akceptację umowy dla nieruchomości "Poznańska".
9.  Anna akceptuje umowę.
10. **[Właściciel Marek]** przy następnym odświeżeniu swojego dashboardu dla nieruchomości "Poznańska" widzi, że jej status zmienił się na "Wynajęta", a w panelu najemcy widnieją dane Anny.

### Ścieżka 2: Cykl Życia Płatności

1.  **[Właściciel Marek]** na dashboardzie nieruchomości "Poznańska" wchodzi w sekcję "Płatności".
2.  Klika "Dodaj należność", wybiera typ "Czynsz najmu", wpisuje kwotę 2000 zł i termin płatności.
3.  **[Najemca Anna]** loguje się do aplikacji i na swoim dashboardzie widzi nową pozycję w historii płatności: "Czynsz najmu, 2000 zł, do zapłaty do...", ze statusem "Niezapłacona".
4.  Anna wykonuje przelew poza aplikacją.
5.  **[Właściciel Marek]** po otrzymaniu przelewu, wchodzi w płatności i odznacza należność jako "Zapłacona".
6.  **[Najemca Anna]** przy następnym logowaniu widzi, że status płatności zmienił się na "Zapłacona". Otrzymuje o tym również powiadomienie e-mail.

### Ścieżka 3: Codzienna Interakcja z Dashboardem (Właściciel)

1.  **[Właściciel Marek]** loguje się do aplikacji.
2.  Aplikacja automatycznie ustawia slider na ostatnio zarządzaną przez niego nieruchomość ("Poznańska").
3.  Marek widzi, że dokument "Ubezpieczenie" świeci się na czerwono. Klika, uploaduje plik z polisą i podaje datę ważności. Status dokumentu zmienia się na zielony.
4.  Marek widzi kropkę (badge) na ikonie wiadomości. Klika ją, wchodzi do czatu i odpisuje Annie na jej pytanie. Kropka znika.
5.  Marek chce sprawdzić, jak wygląda jego profil jako najemcy w innej nieruchomości. Klika na swój awatar w rogu, wybiera "Przełącz na profil Najemcy" i interfejs się zmienia.
