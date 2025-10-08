openapi: 3.0.0
info:
title: "Braian.rent API"
description: "API dla aplikacji Braian.rent. Architektura API w wersji 1, gotowa na skalowanie i przyszły rozwój."
version: "1.0.0"
servers:

- url: "/api/v1"
  description: "API Wersja 1"

# Definicje tagów dla lepszej organizacji

tags:

- name: Auth
  description: "Operacje związane z uwierzytelnianiem i autoryzacją"
- name: Properties
  description: "Zarządzanie nieruchomościami przez właściciela"
- name: Leases
  description: "Zarządzanie umowami najmu"
- name: Payments
  description: "Zarządzanie płatnościami"
- name: Documents & Uploads
  description: "Obsługa przesyłania i zarządzania plikami"
- name: Tenant (Me)
  description: "Endpointy dla zalogowanego najemcy"
- name: Async Jobs
  description: "Zarządzanie zadaniami w tle"

paths:

# --- Auth ---

/auth/register:
post:
tags: [Auth]
summary: "Zarejestruj nowego użytkownika"
requestBody: { $ref: '#/components/requestBodies/RegisterInput' }
responses:
'201': { $ref: '#/components/responses/AuthResponse' }
'400': { $ref: '#/components/responses/BadRequest' }
/auth/login:
post:
tags: [Auth]
summary: "Zaloguj użytkownika"
requestBody: { $ref: '#/components/requestBodies/LoginInput' }
responses:
'200': { $ref: '#/components/responses/AuthResponse' }
'401': { $ref: '#/components/responses/Unauthorized' }

# --- Properties ---

/properties:
get:
tags: [Properties]
summary: "Pobierz listę nieruchomości właściciela (z paginacją)"
security: [ { "bearerAuth": [] } ]
parameters: - { name: limit, in: query, schema: { type: integer, default: 20 } } - { name: offset, in: query, schema: { type: integer, default: 0 } }
responses:
'200':
description: "Lista nieruchomości"
content:
application/json:
schema:
type: object
properties:
totalCount: { type: integer }
items:
type: array
items:
$ref: '#/components/schemas/PropertySummaryOutput'
post:
tags: [Properties]
summary: "Stwórz nową nieruchomość"
security: [ { "bearerAuth": [] } ]
requestBody: { $ref: '#/components/requestBodies/PropertyInput' }
responses:
'201':
description: "Nieruchomość utworzona"
content:
application/json:
schema:
$ref: '#/components/schemas/PropertyOutput'

/properties/{propertyId}:
get:
tags: [Properties]
summary: "Pobierz szczegóły jednej nieruchomości"
security: [ { "bearerAuth": [] } ]
parameters: - name: propertyId
in: path
required: true
schema: { type: string, format: cuid }
responses:
'200':
description: "Szczegóły nieruchomości"
content:
application/json:
schema:
$ref: '#/components/schemas/PropertyDetailedOutput'
'404': { $ref: '#/components/responses/NotFound' }

# --- Leases ---

/properties/{propertyId}/leases:
post:
tags: [Leases]
summary: "Stwórz umowę najmu i zaproś najemcę"
security: [ { "bearerAuth": [] } ]
parameters: - name: propertyId
in: path
required: true
schema: { type: string, format: cuid }
requestBody: { $ref: '#/components/requestBodies/LeaseInput' }
responses:
'201':
description: "Umowa utworzona, zaproszenie wysłane"
content:
application/json:
schema:
$ref: '#/components/schemas/LeaseOutput'

# --- Payments ---

/leases/{leaseId}/payments:
get:
tags: [Payments]
summary: "Pobierz płatności dla danej umowy (z paginacją)"
security: [ { "bearerAuth": [] } ]
parameters: - name: leaseId
in: path
required: true
schema: { type: string, format: cuid } - { name: limit, in: query, schema: { type: integer, default: 20 } } - { name: offset, in: query, schema: { type: integer, default: 0 } }
responses:
'200':
description: "Lista płatności"
content:
application/json:
schema:
type: object
properties:
totalCount: { type: integer }
items:
type: array
items:
$ref: '#/components/schemas/PaymentOutput'

/payments:
post:
tags: [Payments]
summary: "Stwórz nową należność"
security: [ { "bearerAuth": [] } ]
requestBody: { $ref: '#/components/requestBodies/PaymentInput' }
responses:
'201':
description: "Należność utworzona"
content:
application/json:
schema:
$ref: '#/components/schemas/PaymentOutput'

/payments/{paymentId}:
patch:
tags: [Payments]
summary: "Zaktualizuj status płatności"
security: [ { "bearerAuth": [] } ]
parameters: - name: paymentId
in: path
required: true
schema: { type: string, format: cuid }
requestBody: { $ref: '#/components/requestBodies/UpdatePaymentInput' }
responses:
'200':
description: "Płatność zaktualizowana"
content:
application/json:
schema:
$ref: '#/components/schemas/PaymentOutput'

# --- Documents & Uploads ---

/uploads/signed-url:
post:
tags: [Documents & Uploads]
summary: "Wygeneruj bezpieczny adres URL do uploadu pliku"
security: [ { "bearerAuth": [] } ]
requestBody: { $ref: '#/components/requestBodies/SignedUrlInput' }
responses:
'200':
description: "Adres URL wygenerowany"
content:
application/json:
schema:
type: object
properties: { uploadUrl: { type: string, format: uri } }

/properties/{propertyId}/documents:
post:
tags: [Documents & Uploads]
summary: "Zapisz informację o załadowanym dokumencie"
security: [ { "bearerAuth": [] } ]
parameters: - name: propertyId
in: path
required: true
schema: { type: string, format: cuid }
requestBody: { $ref: '#/components/requestBodies/DocumentInput' }
responses:
'201':
description: "Dokument zapisany w bazie"
content:
application/json:
schema:
$ref: '#/components/schemas/DocumentOutput'

# --- Tenant (Me) ---

/me/leases:
get:
tags: [Tenant (Me)]
summary: "Pobierz listę umów najmu zalogowanego najemcy"
security: [ { "bearerAuth": [] } ]
responses:
'200':
description: "Lista umów najmu"
content:
application/json:
schema:
type: array
items:
$ref: '#/components/schemas/LeaseOutput'

# --- Async Jobs ---

/jobs/{jobId}:
get:
tags: [Async Jobs]
summary: "Sprawdź status zadania asynchronicznego"
security: [ { "bearerAuth": [] } ]
parameters: - name: jobId
in: path
required: true
schema: { type: string }
responses:
'200':
description: "Status zadania"
content:
application/json:
schema:
type: object
properties:
id: { type: string }
status: { type: string, enum: [PENDING, PROCESSING, COMPLETED, FAILED] }
resultUrl: { type: string, format: uri, nullable: true }

components:
securitySchemes: { bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT } }

# --- Standardowe odpowiedzi ---

responses:
Unauthorized:
description: "Błąd autoryzacji (brak lub nieważny token JWT)"
content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } }
NotFound:
description: "Nie znaleziono zasobu"
content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } }
BadRequest:
description: "Niepoprawne dane wejściowe"
content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } }
AuthResponse:
description: "Odpowiedź z danymi użytkownika i tokenem JWT"
content:
application/json:
schema:
type: object
properties:
user: { $ref: '#/components/schemas/UserOutput' }
token: { type: string }

# --- Ciała zapytań ---

requestBodies:
RegisterInput:
required: true
content: { application/json: { schema: { $ref: '#/components/schemas/RegisterInput' } } }
LoginInput:
required: true
content: { application/json: { schema: { $ref: '#/components/schemas/LoginInput' } } }
PropertyInput:
required: true
content: { application/json: { schema: { $ref: '#/components/schemas/PropertyInput' } } }
LeaseInput:
required: true
content: { application/json: { schema: { $ref: '#/components/schemas/LeaseInput' } } }
PaymentInput:
required: true
content: { application/json: { schema: { $ref: '#/components/schemas/PaymentInput' } } }
UpdatePaymentInput:
required: true
content: { application/json: { schema: { $ref: '#/components/schemas/UpdatePaymentInput' } } }
SignedUrlInput:
required: true
content: { application/json: { schema: { $ref: '#/components/schemas/SignedUrlInput' } } }
DocumentInput:
required: true
content: { application/json: { schema: { $ref: '#/components/schemas/DocumentInput' } } }

# --- Schematy Danych ---

schemas:
Error:
type: object
properties:
message: { type: string, example: "Nie znaleziono zasobu o podanym ID." }

    # Schematy Wejściowe (Input)
    RegisterInput:
      type: object
      required: [email, password, role]
      properties:
        email: { type: string, format: email, example: "test@example.com" }
        password: { type: string, format: password, example: "S3cur3P@ssw0rd!" }
        role: { type: string, enum: [OWNER, TENANT] }
    LoginInput:
      type: object
      properties:
        email: { type: string, format: email, example: "test@example.com" }
        password: { type: string, format: password, example: "S3cur3P@ssw0rd!" }
    PropertyInput:
      type: object
      properties:
        address: { type: string, example: "ul. Poznańska 12/3" }
        city: { type: string, example: "Warszawa" }
        postalCode: { type: string, example: "00-680" }
    LeaseInput:
      type: object
      properties:
        tenantEmail: { type: string, format: email }
        startDate: { type: string, format: date-time }
        endDate: { type: string, format: date-time }
        rentAmount: { type: number, example: 2500.00 }
    PaymentInput:
      type: object
      properties:
        leaseId: { type: string, format: cuid }
        amountDue: { type: number, example: 2500.00 }
        dueDate: { type: string, format: date-time }
        type: { type: string, enum: [RENT, ADMIN_FEE, UTILITIES, DEPOSIT, OTHER] }
        description: { type: string, nullable: true }
    UpdatePaymentInput:
      type: object
      properties:
        status: { type: string, enum: [PARTIALLY_PAID, PAID] }
        amountPaid: { type: number, example: 1500.00 }
    SignedUrlInput:
      type: object
      properties:
        fileName: { type: string, example: "umowa_najmu_2025.pdf" }
        contentType: { type: string, example: "application/pdf" }
    DocumentInput:
      type: object
      properties:
        fileUrl: { type: string, format: uri }
        type: { type: string, enum: [LEASE_AGREEMENT, INSURANCE, HANDOVER_PROTOCOL] }
        expiresAt: { type: string, format: date-time, nullable: true }

    # Schematy Wyjściowe (Output)
    UserOutput:
      type: object
      properties:
        id: { type: string, format: cuid }
        email: { type: string, format: email }
        role: { type: string, enum: [OWNER, TENANT] }
    PropertyOutput:
      type: object
      properties:
        id: { type: string, format: cuid }
        address: { type: string }
        city: { type: string }
    PropertySummaryOutput:
      type: object
      properties:
        id: { type: string, format: cuid }
        address: { type: string }
        city: { type: string }
        activeLease:
          type: object
          properties:
            tenantName: { type: string, nullable: true }
    PropertyDetailedOutput:
      allOf:
        - $ref: '#/components/schemas/PropertyOutput'
        - type: object
          properties:
            lease: { $ref: '#/components/schemas/LeaseOutput' }
            documents:
              type: array
              items: { $ref: '#/components/schemas/DocumentOutput' }
    LeaseOutput:
      type: object
      properties:
        id: { type: string, format: cuid }
        startDate: { type: string, format: date-time }
        endDate: { type: string, format: date-time }
        rentAmount: { type: number }
        tenant: { $ref: '#/components/schemas/UserOutput' }
    PaymentOutput:
      type: object
      properties:
        id: { type: string, format: cuid }
        amountDue: { type: number }
        amountPaid: { type: number, nullable: true }
        dueDate: { type: string, format: date-time }
        status: { type: string, enum: [UNPAID, PARTIALLY_PAID, PAID] }
        type: { type: string, enum: [RENT, ADMIN_FEE, UTILITIES, DEPOSIT, OTHER] }
    DocumentOutput:
      type: object
      properties:
        id: { type: string, format: cuid }
        fileUrl: { type: string, format: uri }
        type: { type: string, enum: [LEASE_AGREEMENT, INSURANCE, HANDOVER_PROTOCOL] }
        expiresAt: { type: string, format: date-time, nullable: true }
