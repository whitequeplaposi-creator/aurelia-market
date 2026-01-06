# Turso Database Setup Guide 🚀

## ✅ Vad har gjorts

Din Turso-databas är nu konfigurerad i projektet!

**Database URL:** `libsql://dostar-dostar.aws-ap-northeast-1.turso.io`  
**Auth Token:** Konfigurerad i `.env.local`

### Installerade Paket:
- `@libsql/client` - Turso/libSQL klient för Node.js och web
- `dotenv` - För att läsa miljövariabler
- `tsx` - För att köra TypeScript-skript

### Skapade Filer:
1. `src/lib/turso.ts` - Turso databasklient
2. `database/turso-schema.sql` - Databasschema (SQLite-kompatibelt)
3. `scripts/setup-turso-database.ts` - Migrationsskript
4. `.env.local` - Uppdaterad med Turso-konfiguration

---

## ⚠️ VIKTIGT: Auth Token Permissions

Din nuvarande auth token har **READ-ONLY** access. För att kunna skapa tabeller och skriva data behöver du en token med **WRITE** access.

### Skapa en ny token med write-access:

1. **Gå till Turso Dashboard:**
   - https://turso.tech/app

2. **Välj din databas:** `dostar`

3. **Gå till "Tokens" eller "Settings"**

4. **Skapa ny token:**
   - Klicka på "Create Token" eller "New Token"
   - Välj **"Read & Write"** permissions
   - Kopiera den nya token

5. **Uppdatera `.env.local`:**
   ```bash
   TURSO_AUTH_TOKEN=din-nya-token-med-write-access
   ```

---

## 🔧 Setup Database Schema

Efter att du har uppdaterat token med write-access, kör:

```bash
npm run db:setup
```

Detta kommer att:
- Skapa alla tabeller (users, products, cart_items, orders, order_items)
- Skapa index för bättre prestanda
- Skapa triggers för automatisk uppdatering av `updated_at`

### Förväntad Output:

```
🚀 Setting up Turso database...

📝 Executing 14 SQL statements...

✅ Statement 1/14 executed successfully
✅ Statement 2/14 executed successfully
...
✅ Statement 14/14 executed successfully

✅ Database setup completed successfully!

📊 Verifying tables...

Created tables:
  - cart_items
  - order_items
  - orders
  - products
  - users

🎉 Turso database is ready to use!
```

---

## 📊 Database Schema

### Tables:

**1. users**
- `id` (TEXT, PRIMARY KEY)
- `email` (TEXT, UNIQUE)
- `password_hash` (TEXT)
- `role` (TEXT: 'customer' | 'admin')
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

**2. products**
- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT)
- `description` (TEXT)
- `price` (REAL)
- `image` (TEXT)
- `stock` (INTEGER)
- `category` (TEXT)
- `active` (INTEGER: 0 | 1)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

**3. cart_items**
- `id` (TEXT, PRIMARY KEY)
- `user_id` (TEXT, FOREIGN KEY)
- `session_id` (TEXT)
- `product_id` (TEXT, FOREIGN KEY)
- `quantity` (INTEGER)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

**4. orders**
- `id` (TEXT, PRIMARY KEY)
- `user_id` (TEXT, FOREIGN KEY)
- `total_price` (REAL)
- `status` (TEXT: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled')
- `stripe_payment_intent_id` (TEXT)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

**5. order_items**
- `id` (TEXT, PRIMARY KEY)
- `order_id` (TEXT, FOREIGN KEY)
- `product_id` (TEXT, FOREIGN KEY)
- `quantity` (INTEGER)
- `price_at_purchase` (REAL)
- `created_at` (DATETIME)

---

## 🔄 Växla mellan Demo Mode och Production Mode

### Demo Mode (Mock Data):
```bash
# I .env.local
DEMO_MODE=true
```
- Använder mock data från `src/lib/mockData.ts`
- Ingen databas krävs
- Perfekt för utveckling och testning

### Production Mode (Turso Database):
```bash
# I .env.local
DEMO_MODE=false
TURSO_DATABASE_URL=libsql://dostar-dostar.aws-ap-northeast-1.turso.io
TURSO_AUTH_TOKEN=din-token-med-write-access
```
- Använder riktig Turso-databas
- Data sparas permanent
- Perfekt för production

---

## 🚀 Deployment till Vercel

När du deployar till Vercel, lägg till dessa miljövariabler:

```bash
# För Production Mode
DEMO_MODE=false
TURSO_DATABASE_URL=libsql://dostar-dostar.aws-ap-northeast-1.turso.io
TURSO_AUTH_TOKEN=din-token-med-write-access

# Övriga variabler (samma som tidigare)
JWT_SECRET=aurelia-market-production-secret-2024
API_KEY_ENCRYPTION_SECRET=aurelia-encryption-secret-2024
NEXT_PUBLIC_APP_URL=https://din-app.vercel.app
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_placeholder
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
```

**VIKTIGT:** Sätt `DEMO_MODE=false` i Vercel för att använda Turso-databasen.

---

## 📝 Nästa Steg

### 1. Skaffa Write-Access Token
- Gå till Turso Dashboard
- Skapa ny token med "Read & Write" permissions
- Uppdatera `TURSO_AUTH_TOKEN` i `.env.local`

### 2. Kör Database Setup
```bash
npm run db:setup
```

### 3. (Valfritt) Seed Database med Testdata
```bash
npm run db:seed
```

### 4. Starta Applikationen
```bash
npm run dev
```

### 5. Testa Registrering
- Gå till `http://localhost:3000/register`
- Registrera en ny användare
- Data sparas nu i Turso-databasen!

---

## 🔍 Verifiera Database

Du kan verifiera att databasen fungerar genom att:

1. **Registrera en användare** på `/register`
2. **Kontrollera i Turso Dashboard** att användaren finns i `users` tabellen
3. **Logga in** med samma användare
4. **Lägg till produkter i varukorgen**
5. **Kontrollera** att `cart_items` tabellen uppdateras

---

## 🆘 Felsökning

### Problem: "Operation was blocked: SQL write operations are forbidden"

**Orsak:** Auth token har endast read-access.

**Lösning:** 
1. Skapa ny token med "Read & Write" permissions i Turso Dashboard
2. Uppdatera `TURSO_AUTH_TOKEN` i `.env.local`
3. Kör `npm run db:setup` igen

### Problem: "Cannot connect to database"

**Kontrollera:**
1. Att `TURSO_DATABASE_URL` är korrekt
2. Att `TURSO_AUTH_TOKEN` är giltig
3. Att du har internetanslutning
4. Att databasen finns i Turso Dashboard

### Problem: "Module not found: @libsql/client"

**Lösning:**
```bash
npm install @libsql/client@0.5.6 --legacy-peer-deps
```

---

## 📚 Resurser

- **Turso Documentation:** https://docs.turso.tech/
- **Turso Dashboard:** https://turso.tech/app
- **libSQL Documentation:** https://github.com/tursodatabase/libsql

---

**Uppdaterad:** 2025-01-06  
**Status:** Konfigurerad, väntar på write-access token  
**Database:** Turso (libSQL/SQLite)
