# 🧪 Przewodnik Testowania Autentykacji

## Dane Testowe

Po wykonaniu `npx prisma db seed`, dostępni są następujący użytkownicy:

### 👨‍💼 Owner (Właściciel)

- **Email:** `marek.wlasciciel@example.com`
- **Hasło:** `TestPassword123!`
- **Rola:** OWNER
- **Nieruchomości:** 1 (ul. Poznańska 12/3, Warszawa)

### 👩‍💻 Tenant (Najemca)

- **Email:** `anna.najemca@example.com`
- **Hasło:** `TestPassword123!`
- **Rola:** TENANT
- **Nieruchomości:** 0 (jest najemcą, nie właścicielem)

## 📝 Scenariusze Testowe

### Scenariusz 1: Rejestracja nowego użytkownika

**Kroki:**

1. Otwórz: `http://localhost:3000/auth/register`
2. Wypełnij formularz:
   - Imię i nazwisko: Jan Testowy
   - Email: jan@test.com
   - Telefon: +48 111 222 333
   - Hasło: Testowe123!
   - Potwierdź hasło: Testowe123!
3. Kliknij "Zarejestruj się"
4. Powinieneś zostać przekierowany do `/auth/login`

**Weryfikacja:**

```bash
# Sprawdź w bazie
npx prisma studio
# Lub:
psql -d braian_dev -c "SELECT id, email, name, role FROM \"User\" WHERE email='jan@test.com';"
```

### Scenariusz 2: Logowanie jako Owner

**Kroki:**

1. Otwórz: `http://localhost:3000/auth/login`
2. Wprowadź dane:
   - Email: `marek.wlasciciel@example.com`
   - Hasło: `TestPassword123!`
3. Kliknij "Zaloguj się"
4. Powinieneś zostać przekierowany do `/`
5. Powinieneś zobaczyć:
   - "Zalogowany jako: Marek Właściciel"
   - Dashboard z nieruchomością "ul. Poznańska 12/3, Warszawa"
   - Dane najemcy "Anna Najemca"
   - Płatność 2500 zł
   - Dokumenty

### Scenariusz 3: Logowanie jako Tenant

**Kroki:**

1. Wyloguj się (kliknij "Wyloguj się")
2. Zaloguj jako: `anna.najemca@example.com` / `TestPassword123!`
3. Powinieneś zobaczyć:
   - "Zalogowany jako: Anna Najemca"
   - **"Brak nieruchomości do wyświetlenia"** (Anna jest najemcą, nie właścicielem)

**To jest prawidłowe zachowanie!** Anna nie ma własnych nieruchomości.

### Scenariusz 4: Test ochrony routes

**Test 1: Dostęp bez logowania**

1. Wyloguj się
2. Spróbuj wejść na: `http://localhost:3000/`
3. Powinieneś zostać przekierowany do `/auth/login?callbackUrl=/`

**Test 2: API bez autentykacji**

```bash
# Curl bez cookies (powinno być 401)
curl -i http://localhost:3000/api/v1/properties

# Response:
# HTTP/1.1 401 Unauthorized
# {"success":false,"error":"Unauthorized"}
```

**Test 3: Redirect zalogowanego użytkownika**

1. Zaloguj się
2. Spróbuj wejść na: `http://localhost:3000/auth/login`
3. Powinieneś zostać przekierowany do `/`

### Scenariusz 5: Test filtrowania danych

**Kroki:**

1. Zaloguj jako Marek (owner)
2. Sprawdź API w konsoli przeglądarki:

```javascript
// F12 → Console
fetch('/api/v1/properties')
  .then(r => r.json())
  .then(d => console.log('Properties:', d.data.length));
// Powinno być: 1
```

3. Wyloguj się i zaloguj jako Anna (tenant)
4. Powtórz sprawdzenie API:

```javascript
fetch('/api/v1/properties')
  .then(r => r.json())
  .then(d => console.log('Properties:', d.data.length));
// Powinno być: 0
```

### Scenariusz 6: Test error handling

**Test 1: Nieprawidłowe hasło**

1. Otwórz `/auth/login`
2. Email: `marek.wlasciciel@example.com`
3. Hasło: `ZłeHasło123!`
4. Powinieneś zobaczyć: "Nieprawidłowy email lub hasło"

**Test 2: Nieistniejący użytkownik**

1. Email: `nieistniejacy@example.com`
2. Hasło: `cokolwiek`
3. Powinieneś zobaczyć: "Nieprawidłowy email lub hasło"

**Test 3: Rejestracja z istniejącym emailem**

1. Otwórz `/auth/register`
2. Email: `marek.wlasciciel@example.com` (już istnieje)
3. Wypełnij resztę formularza
4. Powinieneś zobaczyć: "Użytkownik z tym adresem email już istnieje"

**Test 4: Hasło za krótkie**

1. Spróbuj zarejestrować z hasłem: `Test123`
2. Powinieneś zobaczyć: "Hasło musi mieć minimum 8 znaków"

**Test 5: Niezgodne hasła**

1. Hasło: `TestPass123!`
2. Potwierdź: `TestPass456!`
3. Powinieneś zobaczyć: "Hasła nie są identyczne"

## 🔍 Debugowanie

### Sprawdzenie sesji w konsoli

```javascript
// F12 → Console
import { useSession } from 'next-auth/react';

function DebugSession() {
  const { data, status } = useSession();
  console.log('Status:', status);
  console.log('Session:', data);
  return null;
}
```

### Sprawdzenie cookies

1. F12 → Application → Cookies
2. Szukaj: `next-auth.session-token`
3. Jeśli istnieje = zalogowany
4. Jeśli brak = niezalogowany

### Sprawdzenie JWT

```bash
# Zdekoduj JWT (bez weryfikacji)
# Skopiuj token z cookie
echo "YOUR_TOKEN_HERE" | base64 -d | jq '.'
```

### Logi serwera

```bash
# W terminalu z `npm run dev`
# Szukaj:
# - "User logged in successfully"
# - "Login attempt for non-existent user"
# - "Invalid password attempt"
# - "New user registered"
```

## 📊 Metryki Bezpieczeństwa

| Metryka             | Wartość                    |
| ------------------- | -------------------------- |
| Bcrypt Rounds       | 10                         |
| Password Min Length | 8 characters               |
| JWT Expiration      | 30 days (NextAuth default) |
| Session Strategy    | JWT (stateless)            |
| CSRF Protection     | ✅ Enabled                 |

## 🚀 Quick Start

```bash
# 1. Zresetuj bazę danych
npx prisma migrate reset --force

# 2. Seed z testowymi danymi
npx prisma db seed

# 3. Uruchom dev server
npm run dev

# 4. Otwórz przeglądarkę
open http://localhost:3000

# Zostaniesz przekierowany do /auth/login
# Użyj: marek.wlasciciel@example.com / TestPassword123!
```

## ⚠️ Uwagi

1. **Hasło testowe:** `TestPassword123!` dla wszystkich użytkowników z seed
2. **Anna (tenant)** nie zobaczy żadnych nieruchomości - to poprawne (nie jest właścicielem)
3. **Middleware** może być wolny w dev mode - to normalne
4. **Session** jest cached - wyloguj/zaloguj jeśli nie widzisz zmian

## ✅ Checklist Testów

- [ ] Rejestracja nowego użytkownika
- [ ] Logowanie z prawidłowymi danymi
- [ ] Logowanie z nieprawidłowymi danymi
- [ ] Wylogowanie
- [ ] Dostęp do dashboard tylko dla zalogowanych
- [ ] API zwraca 401 bez autentykacji
- [ ] Filtrowanie danych per user (Marek widzi 1, Anna widzi 0)
- [ ] Redirect z `/auth/*` dla zalogowanych
- [ ] Session persistence (odśwież stronę - nadal zalogowany)
- [ ] Przycisk wylogowania działa
