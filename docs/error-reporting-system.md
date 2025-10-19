# 🚨 Error Reporting System

Ten dokument opisuje automatyczny system raportowania błędów pipeline'u GitHub Actions.

## 🎯 Cel

System automatycznie:

- Tworzy GitHub Issues przy każdym failed pipeline
- Loguje błędy w `docs/pipeline-errors.md`
- Zapewnia pełną historię błędów w jednym miejscu
- Umożliwia szybką analizę i naprawę problemów

## 📋 Jak to działa

### 1. **Automatyczne wykrywanie błędów**

- Job `error-reporting` uruchamia się tylko gdy którykolwiek z głównych job'ów się nie powiedzie
- System identyfikuje które konkretnie job'y się nie powiodły

### 2. **Tworzenie GitHub Issues**

- Automatyczne tworzenie issue z pełnymi szczegółami błędu
- Strukturyzowane formatowanie z linkami do commitów i run'ów
- Automatyczne tagowanie: `bug`, `pipeline-failure`, `needs-investigation`

### 3. **Logowanie w pliku**

- Aktualizacja `docs/pipeline-errors.md` z nowym błędem
- Chronologiczna historia wszystkich błędów
- Łatwy dostęp do pełnych logów

## 🔧 Struktura GitHub Issue

Każde automatycznie utworzone issue zawiera:

```markdown
## 🚨 Pipeline Failure Report

### 📋 Basic Information

- Repository, Commit, Branch, Workflow
- Run ID, Triggered by, Failed Jobs

### 🔗 Links

- GitHub Actions Run
- Commit link

### ❌ Error Summary

- Szczegóły błędu
- Pełne logi

### 🏷️ Labels

- bug, pipeline-failure, needs-investigation

### 📝 Notes

- [ ] Error analyzed
- [ ] Root cause identified
- [ ] Fix implemented
- [ ] Pipeline passing
```

## 📁 Pliki systemu

- **`.github/workflows/deploy.yml`** - Główny workflow z job'em `error-reporting`
- **`docs/pipeline-errors.md`** - Historia błędów
- **`docs/error-reporting-system.md`** - Ta dokumentacja
- **`.github/scripts/create-error-issue.js`** - Skrypt do tworzenia issues (backup)

## 🚀 Korzyści

### Dla Ciebie:

- **"Push się nie powiódł"** → Ja analizuję issue z pełnymi logami
- Pełna historia błędów w jednym miejscu
- Automatyczne tagowanie i kategoryzacja

### Dla mnie:

- Dostęp do pełnych logów bez kopiowania
- Strukturyzowane informacje o błędach
- Historia problemów i ich rozwiązań
- Szybsza diagnoza i naprawa

## 📊 Przykład użycia

1. **Pipeline się nie powiedzie** → System automatycznie:
   - Tworzy issue: `🚨 Pipeline Failed: terraform (abc1234)`
   - Aktualizuje `docs/pipeline-errors.md`
   - Taguje issue odpowiednimi labelami

2. **Ty piszesz**: "Push się nie powiódł"

3. **Ja analizuję**:
   - Sprawdzam najnowsze issue z tagiem `pipeline-failure`
   - Czytam pełne logi z GitHub Actions
   - Identyfikuję przyczynę błędu
   - Implementuję fix

4. **Rezultat**: Szybsza naprawa bez kopiowania logów!

## 🔄 Workflow naprawy błędów

```mermaid
graph TD
    A[Pipeline Fails] --> B[Auto Create Issue]
    B --> C[Update Error Log]
    C --> D[User: "Push się nie powiódł"]
    D --> E[AI: Analyze Issue]
    E --> F[AI: Identify Root Cause]
    F --> G[AI: Implement Fix]
    G --> H[Pipeline Passes]
    H --> I[Close Issue]
```

## 🏷️ Labely

- **`bug`** - Ogólny błąd
- **`pipeline-failure`** - Błąd pipeline'u
- **`needs-investigation`** - Wymaga analizy
- **`terraform`** - Błąd związany z Terraform
- **`docker`** - Błąd związany z Docker
- **`typescript`** - Błąd TypeScript
- **`eslint`** - Błąd ESLint

## 📈 Metryki

System umożliwia śledzenie:

- Częstotliwość błędów
- Najczęstsze przyczyny
- Czas naprawy
- Trendy jakości kodu

---

_System został zaimplementowany w commit `c1ad918` i jest aktywny od teraz._
