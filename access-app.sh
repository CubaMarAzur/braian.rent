#!/bin/bash

# Skrypt do dostępu do aplikacji Braian.rent z automatycznym tokenem
# Użycie: ./access-app.sh

echo "🔐 Pobieranie tokenu autoryzacyjnego..."
TOKEN=$(gcloud auth print-identity-token)

if [ $? -eq 0 ]; then
    echo "✅ Token pobrany pomyślnie"
    echo "🌐 Otwieranie aplikacji w przeglądarce..."
    
    # Otwórz w przeglądarce z tokenem (dla przeglądarek obsługujących)
    echo "URL: https://braian-rent-service-e7k4i7ftbq-ey.a.run.app"
    echo "Token: $TOKEN"
    echo ""
    echo "📋 Instrukcje:"
    echo "1. Zainstaluj rozszerzenie 'ModHeader' w przeglądarce"
    echo "2. Dodaj nagłówek: Authorization: Bearer $TOKEN"
    echo "3. Otwórz URL aplikacji"
    echo ""
    echo "🧪 Test curl:"
    curl -H "Authorization: Bearer $TOKEN" \
         https://braian-rent-service-e7k4i7ftbq-ey.a.run.app/api/health | jq .
else
    echo "❌ Błąd pobierania tokenu. Uruchom: gcloud auth login"
fi
