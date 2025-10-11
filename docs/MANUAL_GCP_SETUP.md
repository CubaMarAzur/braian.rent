# 🔧 Manualna Konfiguracja GCP - Wymagane Jednorazowo

## 🎯 Cel

Ten dokument zawiera kroki, które **musisz wykonać ręcznie** przed pierwszym uruchomieniem GitHub Actions CI/CD pipeline. Są to jednorazowe operacje setupowe, których automatyzacja nie może wykonać za Ciebie.

---

## ⚠️ Wymagania Wstępne

Przed rozpoczęciem upewnij się, że:

- ✅ Masz zainstalowane `gcloud` CLI
- ✅ Jesteś zalogowany: `gcloud auth login`
- ✅ Masz uprawnienia Owner/Editor w projekcie GCP

---

## 📦 Krok 1: Utworzenie GCS Bucket dla Terraform State

**Dlaczego to jest potrzebne?**  
Terraform musi przechowywać swój stan (state) w zdalnej lokalizacji, aby GitHub Actions mogło z niego korzystać. Bez tego bucketa, Terraform Init nie zadziała.

### Komendy do wykonania:

```bash
# 1. Ustaw swoją zmienną PROJECT_ID (automatycznie pobiera z gcloud config)
export PROJECT_ID=$(gcloud config get-value project)

# 2. Ustaw nazwę bucketa (używamy project ID dla unikalności)
export TF_STATE_BUCKET="${PROJECT_ID}-terraform-state"

# 3. Utwórz bucket w tym samym regionie co aplikacja
gsutil mb -p ${PROJECT_ID} -c STANDARD -l europe-west1 gs://${TF_STATE_BUCKET}

# 4. Włącz wersjonowanie (protection against accidental deletion)
gsutil versioning set on gs://${TF_STATE_BUCKET}

# 5. Ustaw lifecycle policy (optional - keeps last 5 versions)
cat > lifecycle.json <<EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {
          "numNewerVersions": 5,
          "isLive": false
        }
      }
    ]
  }
}
EOF

gsutil lifecycle set lifecycle.json gs://${TF_STATE_BUCKET}
rm lifecycle.json

# 6. Weryfikacja
gsutil ls gs://${TF_STATE_BUCKET}
echo "✅ Bucket created: gs://${TF_STATE_BUCKET}"
echo ""
echo "📋 Zapamiętaj tę wartość dla następnego kroku:"
echo "${TF_STATE_BUCKET}"
```

**Oczekiwany output:**

```
Creating gs://braian-rent-prod-terraform-state/...
Enabling versioning for gs://braian-rent-prod-terraform-state/...
✅ Bucket created: gs://braian-rent-prod-terraform-state

📋 Zapamiętaj tę wartość dla następnego kroku:
braian-rent-prod-terraform-state
```

---

## 🔐 Krok 2: Dodanie GitHub Secret - TF_STATE_BUCKET

**Dlaczego to jest potrzebne?**  
GitHub Actions workflow potrzebuje znać nazwę bucketa, aby Terraform mógł z niego korzystać.

### Instrukcje krok po kroku:

1. **Przejdź do swojego repozytorium GitHub:**

   ```
   https://github.com/YOUR_USERNAME/braian.rent
   ```

2. **Nawiguj do Settings:**
   - Click: **Settings** (górny tab)
   - W lewym menu click: **Secrets and variables** → **Actions**

3. **Dodaj nowy secret:**
   - Click: **New repository secret** (zielony przycisk)

4. **Wypełnij formularz:**

   ```
   Name:  TF_STATE_BUCKET

   Secret: [WKLEJ WARTOŚĆ Z KROKU 1]
   ```

   **Przykład wartości do wklejenia:**

   ```
   braian-rent-prod-terraform-state
   ```

   ⚠️ **WAŻNE:** Wklej TYLKO nazwę bucketa (bez `gs://`)

5. **Zapisz:**
   - Click: **Add secret**

6. **Weryfikacja:**
   - Secret powinien pojawić się na liście
   - Wartość będzie zasłonięta (**\***)

---

## ✅ Weryfikacja Setupu

Po wykonaniu powyższych kroków, sprawdź:

### 1. Bucket istnieje:

```bash
gsutil ls -L gs://$(gcloud config get-value project)-terraform-state
```

**Oczekiwany output:**

```
gs://braian-rent-prod-terraform-state/:
    Storage class:          STANDARD
    Location type:          region
    Location constraint:    EUROPE-WEST1
    Versioning enabled:     True
```

### 2. GitHub Secret dodany:

Sprawdź w GitHub:

- Repository → Settings → Secrets and variables → Actions
- Powinieneś widzieć: `TF_STATE_BUCKET`

### 3. Test Terraform Init (lokalnie):

```bash
cd terraform/

# To powinno zadziałać (lokalnie z gcloud auth)
terraform init \
  -backend-config="bucket=$(gcloud config get-value project)-terraform-state" \
  -backend-config="prefix=terraform/state"
```

**Oczekiwany output:**

```
Initializing the backend...
Successfully configured the backend "gcs"!
```

---

## 🚀 Co Dalej?

Po wykonaniu tych dwóch kroków:

1. ✅ Bucket GCS utworzony
2. ✅ GitHub Secret `TF_STATE_BUCKET` dodany

**Możesz teraz uruchomić pipeline:**

```bash
git add .
git commit -m "fix: correct workflow dependencies and add setup docs"
git push origin main
```

GitHub Actions workflow automatycznie:

1. ✅ Lint & Test
2. ✅ Terraform Init (używa TF_STATE_BUCKET)
3. ✅ Terraform Apply
4. ✅ Build & Push Docker
5. ✅ Deploy to Cloud Run
6. ✅ Run Migrations
7. ✅ Verify Deployment

---

## 🆘 Troubleshooting

### Problem: "Permission denied" podczas tworzenia bucketa

**Rozwiązanie:**

```bash
# Sprawdź czy masz wystarczające uprawnienia
gcloud projects get-iam-policy $(gcloud config get-value project) \
  --flatten="bindings[].members" \
  --filter="bindings.members:user:$(gcloud config get-value account)"

# Jeśli nie masz roles/owner lub roles/storage.admin, poproś admina o przyznanie
```

### Problem: Bucket już istnieje (inny projekt)

**Rozwiązanie:**

```bash
# Użyj innej nazwy z dodatkowym suffixem
export TF_STATE_BUCKET="${PROJECT_ID}-terraform-state-v2"
gsutil mb -p ${PROJECT_ID} -c STANDARD -l europe-west1 gs://${TF_STATE_BUCKET}

# Pamiętaj aby użyć tej samej nazwy w GitHub Secret!
```

### Problem: GitHub Secret nie działa

**Weryfikacja:**

```bash
# Sprawdź czy secret jest poprawnie dodany
# GitHub → Settings → Secrets and variables → Actions
# TF_STATE_BUCKET powinien być na liście

# Sprawdź nazwę - musi być DOKŁADNIE: TF_STATE_BUCKET
# Sprawdź wartość - bez gs://, tylko nazwa: project-id-terraform-state
```

---

## 📋 Checklist

Przed pierwszym deploymentem, upewnij się że:

- [ ] Wykonałeś wszystkie komendy z Kroku 1 (GCS bucket)
- [ ] Bucket widoczny: `gsutil ls gs://YOUR-BUCKET`
- [ ] Versioning włączone
- [ ] Dodałeś GitHub Secret `TF_STATE_BUCKET`
- [ ] Secret ma poprawną wartość (nazwa bucketa)
- [ ] Masz pozostałe wymagane secrets:
  - [ ] `GCP_PROJECT_ID`
  - [ ] `GCP_WORKLOAD_IDENTITY_PROVIDER`
  - [ ] `GCP_SERVICE_ACCOUNT`

**Jeśli wszystkie checkboxy zaznaczone:** ✅ **Jesteś gotowy do deploymentu!**

---

## 📚 Powiązane Dokumenty

- [Terraform Deployment Guide](./terraform_deployment_guide.md) - Pełny przewodnik Terraform
- [CI/CD Implementation](./cicd_implementation.md) - GitHub Actions details
- [QUICK_START.md](../QUICK_START.md) - Quick start guide

---

**Status po wykonaniu tych kroków:** 🟢 **READY FOR FIRST DEPLOYMENT**
