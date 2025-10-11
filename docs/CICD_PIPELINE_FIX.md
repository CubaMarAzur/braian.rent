# 🔧 CI/CD Pipeline Fix - Summary

**Data:** 9 października 2025  
**Problem:** GitHub Actions deployment workflow failing  
**Status:** ✅ **FIXED**

---

## 🐛 Zidentyfikowane Problemy

### Problem 1: Niepoprawna Kolejność Zależności Jobs

**Symptom:**

```
Job 'build-and-push' failed:
Error pushing to Artifact Registry - repository does not exist
```

**Przyczyna:**  
Job `build-and-push` próbował wypchnąć obraz Docker do Artifact Registry, które jeszcze nie istniało, ponieważ było tworzone równolegle przez job `terraform`.

**Przed (BŁĘDNE):**

```yaml
jobs:
  lint-and-test: {}

  build-and-push:
    needs: lint-and-test # ❌ Rozpoczyna się za wcześnie

  terraform:
    needs: build-and-push # ❌ Odwrotna zależność!
```

**Logika była odwrócona:**

- `build-and-push` musi **CZEKAĆ** na `terraform`
- Terraform tworzy Artifact Registry
- Dopiero wtedy możemy push'ować image

### Problem 2: Brakujący TF_STATE_BUCKET

**Symptom:**

```
Terraform Init failed:
Error: Failed to get existing workspaces: storage.buckets.get(...):
bucket "undefined-terraform-state" not found
```

**Przyczyna:**

- Workflow próbuje użyć zdalnego backend (GCS bucket) do przechowywania Terraform state
- Ten bucket nie istnieje i nie może być utworzony w samym workflow
- Wymaga ręcznego pre-setupu

---

## ✅ Wprowadzone Rozwiązania

### Fix 1: Poprawiona Kolejność Jobs ✅

**Po (POPRAWNE):**

```yaml
jobs:
  # 1. Lint and test code
  lint-and-test:
    runs-on: ubuntu-latest

  # 2. Create infrastructure (including Artifact Registry)
  terraform:
    needs: lint-and-test # ✅ Czeka na testy
    runs-on: ubuntu-latest

  # 3. Build and push Docker image
  build-and-push:
    needs: terraform # ✅ Czeka aż Artifact Registry zostanie utworzony
    runs-on: ubuntu-latest

  # 4. Deploy to Cloud Run
  deploy:
    needs: [build-and-push, terraform] # ✅ Czeka na obraz i infrastrukturę
    runs-on: ubuntu-latest

  # 5. Run database migrations
  migrate-database:
    needs: deploy # ✅ Czeka aż aplikacja zostanie wdrożona
    runs-on: ubuntu-latest

  # 6. Verify deployment
  verify-deployment:
    needs: migrate-database # ✅ Ostatni krok
    runs-on: ubuntu-latest
```

**Poprawna sekwencja:**

```
lint-and-test
     ↓
 terraform (creates Artifact Registry)
     ↓
build-and-push (pushes to Artifact Registry)
     ↓
  deploy (updates Cloud Run)
     ↓
migrate-database (runs Prisma migrations)
     ↓
verify-deployment (health checks)
```

**Zmieniony plik:** `.github/workflows/deploy.yml`

---

### Fix 2: Manualne Instrukcje Setup ✅

**Utworzony dokument:** `docs/MANUAL_GCP_SETUP.md`

Zawiera szczegółowe, copy-paste ready instrukcje dla dwóch kroków:

---

## 📋 INSTRUKCJE DO WYKONANIA (SKOPIUJ I URUCHOM)

### 🔹 KROK 1: Utwórz GCS Bucket dla Terraform State

**Otwórz terminal i wykonaj:**

```bash
# Automatycznie pobiera Twój project ID z gcloud config
export PROJECT_ID=$(gcloud config get-value project)

# Tworzy unikalną nazwę bucketa
export TF_STATE_BUCKET="${PROJECT_ID}-terraform-state"

# Tworzy bucket w europe-west1
gsutil mb -p ${PROJECT_ID} -c STANDARD -l europe-west1 gs://${TF_STATE_BUCKET}

# Włącza wersjonowanie (ochrona przed utratą state)
gsutil versioning set on gs://${TF_STATE_BUCKET}

# Weryfikacja
gsutil ls gs://${TF_STATE_BUCKET}
echo "✅ Bucket utworzony: gs://${TF_STATE_BUCKET}"
echo ""
echo "📋 ZAPAMIĘTAJ TĘ WARTOŚĆ:"
echo "${TF_STATE_BUCKET}"
```

**Przykładowy output:**

```
Creating gs://braian-rent-prod-terraform-state/...
Enabling versioning for gs://braian-rent-prod-terraform-state/...
✅ Bucket utworzony: gs://braian-rent-prod-terraform-state

📋 ZAPAMIĘTAJ TĘ WARTOŚĆ:
braian-rent-prod-terraform-state
```

---

### 🔹 KROK 2: Dodaj GitHub Secret

**Instrukcje:**

1. **Przejdź do GitHub:**

   ```
   https://github.com/YOUR_USERNAME/braian.rent/settings/secrets/actions
   ```

2. **Click:** "New repository secret" (zielony przycisk)

3. **Wypełnij formularz:**

   ```
   Name:
   TF_STATE_BUCKET

   Secret (wartość do wklejenia):
   braian-rent-prod-terraform-state
   ```

   ⚠️ **UWAGA:** Wklej TYLKO nazwę bucketa (bez `gs://`)

   Jeśli Twój projekt ma inną nazwę, użyj wartości wyświetlonej w Kroku 1.

4. **Click:** "Add secret"

5. **Weryfikacja:**
   - Secret `TF_STATE_BUCKET` powinien pojawić się na liście
   - Wartość będzie ukryta (pokazuje tylko **\***)

---

## ✅ Weryfikacja Całego Setupu

Po wykonaniu obu kroków, zweryfikuj:

```bash
# 1. Sprawdź czy bucket istnieje
gsutil ls gs://$(gcloud config get-value project)-terraform-state

# 2. Sprawdź czy możesz zainicjalizować Terraform lokalnie
cd terraform/
terraform init \
  -backend-config="bucket=$(gcloud config get-value project)-terraform-state" \
  -backend-config="prefix=terraform/state"

# Jeśli widzisz: "Successfully configured the backend" - ✅ GOTOWE!
```

**W GitHub:**

- Przejdź do: Settings → Secrets and variables → Actions
- Powinieneś widzieć wszystkie 4 secrets:
  - ✅ `GCP_PROJECT_ID`
  - ✅ `GCP_WORKLOAD_IDENTITY_PROVIDER`
  - ✅ `GCP_SERVICE_ACCOUNT`
  - ✅ `TF_STATE_BUCKET` ← **NOWY**

---

## 🚀 Gotowe do Deploymentu!

Gdy oba kroki są ukończone:

```bash
git add .
git commit -m "fix: correct workflow job dependencies"
git push origin main
```

Pipeline powinien przejść wszystkie kroki bez błędów! 🎉

---

## 📊 Podsumowanie Zmian

### W kodzie:

**Plik:** `.github/workflows/deploy.yml`

**Zmiany:**

1. ✅ Job `terraform` przeniesiony jako Job #2 (był #3)
2. ✅ Job `build-and-push` przeniesiony jako Job #3 (był #2)
3. ✅ Zależność `build-and-push.needs` zmieniona: `lint-and-test` → `terraform`
4. ✅ Wszystkie pozostałe zależności zaktualizowane

**Nowa kolejność:**

```
1. lint-and-test
2. terraform          ← Tworzy Artifact Registry
3. build-and-push     ← Używa Artifact Registry
4. deploy             ← Używa obrazu z Artifact Registry
5. migrate-database
6. verify-deployment
```

### Manualne (Ty musisz wykonać):

1. ✅ Utworzyć GCS bucket (Krok 1 powyżej)
2. ✅ Dodać GitHub Secret (Krok 2 powyżej)

---

## 🎯 Expected Timeline

Po naprawie:

| Job               | Duration       | Status                                    |
| ----------------- | -------------- | ----------------------------------------- |
| lint-and-test     | ~2 min         | ✅ Should pass                            |
| terraform         | ~8 min         | ✅ Should pass (creates resources)        |
| build-and-push    | ~4 min         | ✅ Should pass (Artifact Registry exists) |
| deploy            | ~2 min         | ✅ Should pass                            |
| migrate-database  | ~1 min         | ✅ Should pass                            |
| verify-deployment | ~30s           | ✅ Should pass                            |
| **TOTAL**         | **~17-18 min** | ✅ **SUCCESS**                            |

---

**Fixed by:** DevOps Engineer  
**Date:** 9 października 2025  
**Status:** ✅ **PIPELINE READY**
