# Turso Database Fix - Inloggningsproblem

## Problem
Inloggningen fungerade inte eftersom:
1. ❌ Turso-databasen har inga tabeller (tom databas)
2. ❌ Turso auth-token har endast **read-only** behörighet
3. ❌ Fel: "SQLITE_UNKNOWN: SQLite error: no such table: users"

## Tillfällig Lösning (Aktiverad)
✅ **Demo-läge är nu aktiverat** i `.env.local`
- Inloggning fungerar nu med mock-data
- Ingen riktig databas behövs
- Perfekt för utveckling och testning

## Permanent Lösning - Konfigurera Turso

För att använda riktig Turso-databas behöver du:

### Steg 1: Installera Turso CLI
```bash
# Windows (PowerShell)
irm https://get.tur.so/install.ps1 | iex

# Eller via npm
npm install -g @turso/cli
```

### Steg 2: Logga in på Turso
```bash
turso auth login
```

### Steg 3: Skapa eller använd befintlig databas
```bash
# Lista dina databaser
turso db list

# Eller skapa ny databas
turso db create aurelia-market
```

### Steg 4: Skapa tabeller
```bash
# Kör schema-filen
turso db shell aurelia-market < database/turso-schema.sql
```

### Steg 5: Skapa en token med skrivrättigheter
```bash
# Skapa en read-write token
turso db tokens create aurelia-market --expiration none

# Kopiera den nya token
```

### Steg 6: Uppdatera .env.local
```env
# Byt ut den gamla read-only token med den nya
TURSO_AUTH_TOKEN=din_nya_token_här
```

### Steg 7: Skapa en testanvändare
```bash
# Öppna Turso shell
turso db shell aurelia-market

# Kör SQL för att skapa användare
INSERT INTO users (email, password_hash, role) 
VALUES ('test@example.com', '$2a$10$...', 'customer');
```

Eller använd registrerings-endpointen:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'
```

### Steg 8: Inaktivera demo-läge
```env
# I .env.local
DEMO_MODE=false
```

## Nuvarande Status

### ✅ Fungerar Nu (Demo-läge)
- Inloggning
- Registrering  
- Produktvisning
- Alla UI-funktioner

### ⏭️ Behöver Turso-konfiguration för:
- Riktig datalagring
- Persistent användare
- Riktiga produkter
- Ordrar och betalningar

## Testning

### Testa inloggning (Demo-läge)
```bash
node test-login-http.js
```

### Testa med vilken email/lösenord som helst
I demo-läge accepteras alla inloggningar och returnerar en demo-användare.

## Rekommendation

**För utveckling**: Använd demo-läge (nuvarande inställning)
- ✅ Snabbt att komma igång
- ✅ Ingen databas-konfiguration behövs
- ✅ Perfekt för UI-utveckling

**För production**: Konfigurera Turso enligt stegen ovan
- ✅ Riktig datalagring
- ✅ Persistent data
- ✅ Skalbart

## Nästa Steg

1. ✅ Demo-läge aktiverat - inloggning fungerar nu
2. ⏭️ Testa applikationen i demo-läge
3. ⏭️ När du är redo: Konfigurera Turso enligt guiden ovan
4. ⏭️ Skapa admin-användare för att hantera produkter

## Support

Om du behöver hjälp med Turso-konfiguration:
- Turso Docs: https://docs.turso.tech/
- Turso Discord: https://discord.gg/turso
