# Fix: Registrerings- och JSON-problem

## Problem
Registreringsfunktionen fungerade inte på grund av JSON-hanteringsproblem i autentiserings-API:erna.

## Rotorsak
`DOMPurify.sanitize()` returnerar alltid en **sträng**, inte ett objekt. När vi saniterade ett objekt med `email` och `password`, konverterades värdena på ett sätt som kunde orsaka problem med JSON-parsing och validering.

## Lösning

### 1. Förbättrad `sanitizeInput`-funktion (src/middleware/security.ts)

**Tidigare problem:**
- `DOMPurify.sanitize()` returnerade strängar utan att hantera dem korrekt
- Ingen trimning av whitespace
- Ingen kontroll av `hasOwnProperty` vid iteration

**Ny implementation:**
```typescript
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Sanitera strängen och trimma whitespace
    const sanitized = DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false
    });
    return typeof sanitized === 'string' ? sanitized.trim() : String(sanitized).trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(item => sanitizeInput(item));
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        sanitized[key] = sanitizeInput(input[key]);
      }
    }
    return sanitized;
  }
  
  // Returnera primitiva värden som de är (number, boolean, null, undefined)
  return input;
}
```

**Förbättringar:**
- ✅ Explicit hantering av DOMPurify-returvärden
- ✅ Trimning av whitespace från strängar
- ✅ Säker iteration med `hasOwnProperty`
- ✅ Korrekt hantering av primitiva värden

### 2. Förbättrad felhantering i register API (src/app/api/auth/register/route.ts)

**Nya funktioner:**
- ✅ Explicit JSON-parsing med try-catch
- ✅ Separat validering med tydliga felmeddelanden
- ✅ Svenska felmeddelanden för bättre användarupplevelse
- ✅ Specifik hantering av Zod-valideringsfel

**Exempel:**
```typescript
let body;
try {
  body = await request.json();
} catch (jsonError) {
  console.error('JSON parse error:', jsonError);
  return NextResponse.json(
    { error: 'Ogiltig förfrågan - JSON-fel' },
    { status: 400 }
  );
}

// Sanitera input
const sanitizedBody = sanitizeInput(body);

// Validera input
let validatedData;
try {
  validatedData = registerSchema.parse(sanitizedBody);
} catch (validationError) {
  console.error('Validation error:', validationError);
  return NextResponse.json(
    { error: 'Ogiltig e-postadress eller lösenord (minst 8 tecken krävs)' },
    { status: 400 }
  );
}
```

### 3. Förbättrad felhantering i login API (src/app/api/auth/login/route.ts)

Samma förbättringar som i register API:
- ✅ Explicit JSON-parsing
- ✅ Separat validering
- ✅ Svenska felmeddelanden
- ✅ Bättre loggning för debugging

## Felmeddelanden (nu på svenska)

| Tidigare (Engelska) | Nu (Svenska) |
|---------------------|--------------|
| "Invalid credentials" | "Felaktig e-postadress eller lösenord" |
| "Email already registered" | "E-postadressen är redan registrerad" |
| "Registration failed" | "Registrering misslyckades. Försök igen." |
| "Login failed" | "Inloggning misslyckades. Försök igen." |

## Testning

### Manuell testning
1. Gå till `/register`
2. Fyll i e-postadress och lösenord (minst 8 tecken)
3. Klicka på "Registrera"
4. Verifiera att registreringen fungerar

### Felfall att testa
- ✅ Tom e-postadress
- ✅ Ogiltig e-postadress
- ✅ För kort lösenord (< 8 tecken)
- ✅ Lösenord matchar inte
- ✅ E-postadress redan registrerad

## Commit
```
6013e55 - Fix: Förbättra JSON-hantering och sanitering i auth API:er - fixa registreringsproblem
```

## Nästa steg
1. Testa registrering på Vercel efter deployment
2. Verifiera att alla felmeddelanden visas korrekt
3. Kontrollera att demo-läget fortfarande fungerar

## Säkerhetsförbättringar
- ✅ XSS-skydd bibehållet med DOMPurify
- ✅ Input-validering med Zod
- ✅ Rate limiting på plats
- ✅ Bättre felhantering utan att läcka känslig information
