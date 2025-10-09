# 🔐 System Autentykacji - NextAuth.js

## Przegląd

Kompletny system autentykacji dla aplikacji Braian.rent, zabezpieczający dostęp do danych i filtrujący je per użytkownik.

## ✅ Zaimplementowane Funkcjonalności

### 1. **Schema Prisma - Hasło**

**Plik:** `prisma/schema.prisma`

```prisma
model User {
  id       String  @id @default(uuid())
  email    String  @unique
  password String  // Hashed password with bcrypt
  role     Role    @default(OWNER)
  name     String
  phone    String
  // ... relationships
}
```

**Migracja:** `20251009052259_add_password_to_user`

### 2. **Konfiguracja NextAuth**

**Plik:** `src/lib/auth.ts`

**Provider:** CredentialsProvider (email + hasło)

**Funkcjonalności:**

- ✅ Hashowanie haseł (bcrypt)
- ✅ Walidacja credentials
- ✅ JWT session strategy
- ✅ Custom callbacks (jwt, session)
- ✅ Logging (Winston)
- ✅ Error handling

**Konfiguracja:**

```typescript
session: {
  strategy: 'jwt', // JWT dla lepszego performance
}
pages: {
  signIn: '/auth/login',
  signOut: '/auth/logout',
  error: '/auth/error',
}
```

### 3. **API Routes**

#### A. **NextAuth Handler**

- **Path:** `/api/auth/[...nextauth]`
- **Methods:** GET, POST
- **Funkcje:** signIn, signOut, session, csrf

#### B. **Register Endpoint**

- **Path:** `POST /api/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "Jan Kowalski",
    "phone": "+48 123 456 789"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Jan Kowalski"
    }
  }
  ```

**Walidacja:**

- ✅ Wszystkie pola wymagane
- ✅ Minimum 8 znaków dla hasła
- ✅ Unikalny email
- ✅ Automatyczne hashowanie bcrypt

### 4. **UI Komponenty**

#### A. **LoginForm** (`src/components/auth/LoginForm.tsx`)

- Email + Password
- Error handling
- Loading state
- Redirect po sukcesie
- Link do rejestracji

#### B. **RegisterForm** (`src/components/auth/RegisterForm.tsx`)

- Pełny formularz rejestracji
- Walidacja hasła (min 8 znaków)
- Potwierdzenie hasła
- Error handling
- Loading state
- Link do logowania

#### C. **LogoutButton** (`src/components/auth/LogoutButton.tsx`)

- Prosty przycisk wylogowania
- Redirect do `/auth/login`
- Styled z Tailwind CSS

### 5. **Ochrona Routes (Middleware)**

**Plik:** `src/middleware.ts`

**Funkcjonalności:**

- ✅ Sprawdzanie sesji dla każdego requestu
- ✅ Redirect do `/auth/login` dla niezalogowanych
- ✅ Redirect do `/` dla zalogowanych na stronach auth
- ✅ Monitoring requestów (request ID, response time)

**Chronione Routes:**

- `/` - Dashboard (wymaga logowania)
- `/api/v1/*` - Wszystkie API endpoints (wymaga logowania)

**Publiczne Routes:**

- `/auth/login` - Strona logowania
- `/auth/register` - Strona rejestracji
- `/api/auth/*` - NextAuth endpoints
- `/api/health` - Health check

### 6. **Filtrowanie Danych per User**

**Plik:** `src/app/api/v1/properties/route.ts`

**Przed:**

```typescript
const properties = await prisma.property.findMany({
  // Wszystkie nieruchomości
});
```

**Po:**

```typescript
const session = await auth();

if (!session || !session.user?.id) {
  return NextResponse.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  );
}

const properties = await prisma.property.findMany({
  where: {
    ownerId: session.user.id, // Tylko nieruchomości zalogowanego
  },
});
```

**Korzyści:**

- ✅ Izolacja danych między użytkownikami
- ✅ Bezpieczeństwo
- ✅ GDPR compliance

### 7. **Session Management**

**Provider:** `src/components/providers/SessionProvider.tsx`

**Layout:** `src/app/layout.tsx`

```typescript
<SessionProvider>
  {children}
</SessionProvider>
```

**Hook:** `useSession()` w komponentach

```typescript
const { data: session } = useSession();

// session.user.id
// session.user.email
// session.user.name
// session.user.role
```

### 8. **TypeScript Types**

**Plik:** `src/types/next-auth.d.ts`

```typescript
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }
}
```

**Korzyści:**

- ✅ Type safety dla session
- ✅ Autocomplete w IDE
- ✅ Compile-time errors

## 🔄 Authentication Flow

### Rejestracja:

```
User → RegisterForm → POST /api/auth/register → bcrypt.hash()
→ prisma.user.create() → Success → Redirect to /auth/login
```

### Logowanie:

```
User → LoginForm → signIn('credentials') → authorize()
→ prisma.user.findUnique() → bcrypt.compare() → JWT token
→ Session created → Redirect to /
```

### Dostęp do Dashboard:

```
Request to / → Middleware → auth() → Check session
→ If logged in: Allow → If not: Redirect to /auth/login
```

### API Request:

```
GET /api/v1/properties → auth() → Check session
→ If valid: Filter by user.id → Return data
→ If not: 401 Unauthorized
```

## 📊 Security Features

| Feature          | Implemented | Description             |
| ---------------- | ----------- | ----------------------- |
| Password Hashing | ✅          | bcrypt z salt rounds 10 |
| JWT Tokens       | ✅          | Signed, HttpOnly        |
| Session Security | ✅          | Server-side validation  |
| CSRF Protection  | ✅          | NextAuth built-in       |
| Rate Limiting    | ⏳          | Przyszłość              |
| 2FA              | ⏳          | Przyszłość              |
| Password Reset   | ⏳          | Przyszłość              |

## 🧪 Testowanie

### 1. Rejestracja nowego użytkownika

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "name": "Test User",
    "phone": "+48 123 456 789"
  }'
```

### 2. Logowanie (przez UI)

1. Otwórz: `http://localhost:3000/auth/login`
2. Wprowadź email i hasło
3. Kliknij "Zaloguj się"
4. Powinieneś zostać przekierowany do `/`

### 3. Sprawdzenie sesji

```typescript
// W komponencie
const { data: session, status } = useSession();

console.log('Status:', status); // "loading" | "authenticated" | "unauthenticated"
console.log('User:', session?.user);
```

### 4. Test API z autentykacją

```bash
# Bez logowania (powinno być 401)
curl http://localhost:3000/api/v1/properties

# Z logowaniem (przez przeglądarkę z cookies)
# Otwórz DevTools → Network → Sprawdź request
```

## 🚨 Troubleshooting

### Problem: "NEXTAUTH_SECRET" is not set

**Rozwiązanie:**

```bash
# Generuj secret
openssl rand -base64 32

# Dodaj do .env
NEXTAUTH_SECRET="wygenerowany-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Problem: Middleware loop (zbyt dużo redirectów)

**Rozwiązanie:**

- Sprawdź `middleware.ts` config matcher
- Upewnij się, że `/api/auth/*` jest wyłączone
- Sprawdź czy `auth()` działa poprawnie

### Problem: Session jest null

**Rozwiązanie:**

```typescript
// Upewnij się, że SessionProvider jest w layout.tsx
// Sprawdź czy używasz "use client" w komponencie
// Sprawdź czy auth() zwraca sesję w API route
```

### Problem: Hasło nie działa po migracji

**Rozwiązanie:**

```sql
-- Istniejący użytkownicy mają temporary hash
-- Muszą zresetować hasło lub:

-- Wygeneruj nowy hash dla testowania
-- Hash dla "ChangeMe123!":
UPDATE "User"
SET password = '$2a$10$YourDefaultHashHere.ChangeThisInProduction'
WHERE email = 'user@example.com';
```

## 📝 Environment Variables

**Wymagane:**

```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..." # Minimum 32 znaki
NEXTAUTH_URL="http://localhost:3000"
```

**Opcjonalne:**

```bash
JWT_SECRET="..."
SESSION_SECRET="..."
```

## 🔗 Następne Kroki

1. **Password Reset Flow**
   - Endpoint do resetu hasła
   - Email z linkiem resetującym
   - Token expiration

2. **Email Verification**
   - Potwierdzenie email po rejestracji
   - Token verification
   - Resend email option

3. **OAuth Providers**
   - Google login
   - GitHub login
   - Apple login

4. **2FA (Two-Factor Authentication)**
   - TOTP (Google Authenticator)
   - SMS codes
   - Backup codes

5. **Session Management**
   - Lista aktywnych sesji
   - Wylogowanie ze wszystkich urządzeń
   - Device tracking

6. **Rate Limiting**
   - Limit login attempts
   - Account lockout
   - IP-based limiting

## 🔒 Best Practices

1. **Hasła:**
   - Minimum 8 znaków
   - Wymagaj wielkich/małych liter + cyfr
   - Sprawdź common passwords
   - Password strength meter

2. **Sesje:**
   - Krótki TTL dla JWT (1h)
   - Refresh token mechanism
   - Invalidate on logout

3. **Logging:**
   - Log wszystkie próby logowania
   - Log failed attempts
   - Security events (Sentry)

4. **Monitoring:**
   - Track suspicious activity
   - Alert on multiple failed logins
   - Monitor session duration

## ✅ Checklist Implementacji

- [x] Prisma schema z polem password
- [x] Migracja bazy danych
- [x] NextAuth konfiguracja
- [x] CredentialsProvider
- [x] Register endpoint
- [x] Login/Register UI
- [x] Logout button
- [x] Middleware protection
- [x] Session provider
- [x] Per-user data filtering
- [x] TypeScript types
- [x] Error handling
- [x] Logging
- [ ] Password reset
- [ ] Email verification
- [ ] OAuth providers
- [ ] 2FA
- [ ] Rate limiting
- [ ] Tests

## 📚 Dokumentacja

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Prisma Auth Guide](https://www.prisma.io/docs/guides/database/authentication)
- [bcrypt npm](https://www.npmjs.com/package/bcryptjs)
