# 🧪 Testing Guide - Braian.rent

## Przegląd

Kompleksowy przewodnik po testowaniu aplikacji Braian.rent z użyciem Vitest i React Testing Library.

## 🛠️ Stack Testowy

| Narzędzie                       | Przeznaczenie                  |
| ------------------------------- | ------------------------------ |
| **Vitest**                      | Test runner (szybszy niż Jest) |
| **React Testing Library**       | Testing React components       |
| **@testing-library/jest-dom**   | Custom matchers                |
| **@testing-library/user-event** | User interaction simulation    |
| **jsdom**                       | Browser environment simulation |

## 📁 Struktura Testów

```
src/
├── components/
│   └── dashboard/
│       ├── PaymentCard.tsx
│       ├── TenantCard.tsx
│       └── __tests__/
│           ├── PaymentCard.test.tsx    ✅
│           └── TenantCard.test.tsx     ✅
├── lib/
│   └── actions/
│       ├── properties.ts
│       └── __tests__/
│           └── properties.test.ts      ✅
└── ...
```

**Konwencja:**

- `__tests__/` folder obok testowanych plików
- Nazwa: `ComponentName.test.tsx` lub `fileName.test.ts`
- Co-location ułatwia nawigację

## 🚀 Uruchamianie Testów

```bash
# Watch mode (development)
npm test

# Run once (CI)
npm run test:run

# With coverage
npm run test:coverage

# UI mode (visual test runner)
npm run test:ui
```

## ✅ Przykładowe Testy

### 1. Component Test (PaymentCard)

```tsx
import { render, screen } from '@testing-library/react';
import PaymentCard from '../PaymentCard';

it('renders payment information correctly', () => {
  const mockPayment = {
    id: 'test-id',
    amountDue: 2500,
    dueDate: '2025-10-10T00:00:00.000Z',
    status: 'UNPAID',
  };

  render(<PaymentCard payment={mockPayment} />);

  expect(screen.getByText(/2.*500 zł/)).toBeInTheDocument();
  expect(screen.getByText('Nieopłacona')).toBeInTheDocument();
});
```

### 2. Server Action Test

```tsx
import { createProperty } from '../properties';
import { auth } from '@/lib/auth';

vi.mock('@/lib/auth');

it('requires authentication', async () => {
  vi.mocked(auth).mockResolvedValue(null);

  const formData = new FormData();
  const result = await createProperty(formData);

  expect(result.success).toBe(false);
  expect(result.error).toContain('zalogowany');
});
```

## 📊 Test Coverage

### Current Coverage

```
File                  | % Stmts | % Branch | % Funcs | % Lines
----------------------|---------|----------|---------|--------
PaymentCard.tsx       |   100   |    95    |   100   |   100
TenantCard.tsx        |   100   |    85    |   100   |   100
properties.ts (actions)|   45   |    40    |    50   |    45
```

**Target:** > 80% coverage dla business logic

### Generate Coverage Report

```bash
npm run test:coverage

# Open HTML report
open coverage/index.html
```

## 🎯 Testing Strategy

### Test Pyramid

```
     /\
    /E2E\ ← 5% (critical paths)
   /──────\
  /  INT   \ ← 15% (API + DB)
 /──────────\
/ UNIT TESTS \ ← 80% (components, utils)
───────────────
```

### What to Test?

✅ **DO test:**

- Component rendering (different props)
- User interactions (clicks, typing)
- Conditional logic (if/else, switches)
- Edge cases (empty, null, undefined)
- Utility functions (formatting, validation)
- Server Actions (authentication, validation)

❌ **DON'T test:**

- Implementation details
- Third-party libraries
- Trivial code (getters/setters)
- Styling (use visual regression instead)

## 🔧 Configuration

### vitest.config.ts

```typescript
export default defineConfig({
  test: {
    environment: 'jsdom', // Browser-like environment
    globals: true, // No need to import describe, it, expect
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

### vitest.setup.ts

```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => cleanup());
```

## 📝 Writing Good Tests

### AAA Pattern (Arrange, Act, Assert)

```tsx
it('validates postal code format', () => {
  // Arrange - Setup test data
  const formData = new FormData();
  formData.append('postalCode', 'invalid');

  // Act - Execute the code
  const result = validatePostalCode(formData.get('postalCode'));

  // Assert - Verify the result
  expect(result.valid).toBe(false);
  expect(result.error).toContain('format');
});
```

### Descriptive Test Names

```tsx
// ✅ GOOD - Says what it tests
it('redirects to login when user is not authenticated');

// ❌ BAD - Vague
it('works correctly');
it('test authentication');
```

### One Assertion per Test (mostly)

```tsx
// ✅ GOOD - Focused test
it('renders tenant name', () => {
  render(<TenantCard tenant={mockTenant} />);
  expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
});

it('renders tenant initials', () => {
  render(<TenantCard tenant={mockTenant} />);
  expect(screen.getByText('JK')).toBeInTheDocument();
});

// ⚠️ OK - Related assertions
it('renders payment details', () => {
  render(<PaymentCard payment={mockPayment} />);
  expect(screen.getByText(/2500 zł/)).toBeInTheDocument();
  expect(screen.getByText(/10.10.2025/)).toBeInTheDocument();
});
```

## 🎭 Mocking

### Mocking Modules

```tsx
// Mock external dependencies
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    property: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  })),
}));
```

### Mocking Functions

```tsx
import { auth } from '@/lib/auth';

// Mock return value
vi.mocked(auth).mockResolvedValue({
  user: { id: '123', name: 'Test' },
});

// Verify it was called
expect(auth).toHaveBeenCalled();
```

## 🔮 Future: Integration Tests

```tsx
// test/integration/api/properties.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/v1/properties/route';

it('GET /api/v1/properties returns user properties', async () => {
  const { req, res } = createMocks({
    method: 'GET',
    headers: {
      authorization: 'Bearer valid-token',
    },
  });

  await handler(req, res);

  expect(res._getStatusCode()).toBe(200);
  expect(res._getJSONData()).toHaveProperty('success', true);
});
```

## 🔮 Future: E2E Tests (Playwright)

```tsx
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can login and view dashboard', async ({ page }) => {
  await page.goto('/auth/login');

  await page.fill('input[name="email"]', 'marek@example.com');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/');
  await expect(page.getByText('Zalogowany jako')).toBeVisible();
});
```

## 🐛 Debugging Tests

### Failed Test

```bash
# Run single test file
npx vitest run src/components/dashboard/__tests__/PaymentCard.test.tsx

# Run with UI
npm run test:ui

# Verbose output
npx vitest --reporter=verbose
```

### In VS Code

1. Install Vitest extension
2. Click "Run Test" above each `it()` block
3. Debug with breakpoints

## 📊 CI/CD Integration

### GitHub Actions (already configured)

```yaml
# .github/workflows/ci.yml
- name: Run tests
  run: npm run test:run

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

## ✅ Checklist

**Setup:**

- [x] Vitest installed and configured
- [x] React Testing Library installed
- [x] jest-dom matchers configured
- [x] Test scripts in package.json
- [x] Example tests created

**Best Practices:**

- [x] AAA pattern
- [x] Descriptive test names
- [x] Proper mocking
- [x] Coverage reporting
- [ ] Integration tests (future)
- [ ] E2E tests (future)

## 🔗 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Best Practices](https://testingjavascript.com/)

---

**Status:** ✅ **TESTING INFRASTRUCTURE READY**

Podstawy testów są gotowe. Dodawaj nowe testy w miarę rozwijania funkcjonalności! 🧪
