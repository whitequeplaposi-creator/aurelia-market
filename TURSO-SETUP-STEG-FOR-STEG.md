# Turso Database Setup - Steg för Steg

## 🎯 Mål
Konfigurera Turso-databasen permanent så att inloggning fungerar med riktig data.

## 📋 Förberedelser
- ✅ Du har ett Turso-konto
- ✅ Du har tillgång till Turso Dashboard
- ✅ Databas: `dostar` (från URL: dostar-dostar.aws-ap-northeast-1.turso.io)

## 🚀 Steg 1: Öppna Turso Dashboard

1. Gå till: **https://turso.tech/app**
2. Logga in med ditt konto
3. Hitta din databas: **dostar**
4. Klicka på databasen för att öppna den

## 📝 Steg 2: Öppna SQL Console

1. I databasens dashboard, leta efter:
   - "SQL Console" tab
   - "Query" tab
   - Eller "Shell" knapp
2. Klicka för att öppna SQL-editorn

## 💾 Steg 3: Kör Setup SQL

1. Öppna filen: `database/turso-complete-setup.sql`
2. Kopiera **HELA** innehållet
3. Klistra in i Turso SQL Console
4. Klicka "Run" eller "Execute"

**Alternativt**: Kopiera SQL från denna fil och kör rad för rad.

### Vad skapas:
- ✅ 6 tabeller (users, products, orders, cart_items, order_items, support_tickets)
- ✅ Alla index för bättre prestanda
- ✅ 2 testanvändare:
  - **Kund**: test@example.com (lösenord: test123456)
  - **Admin**: ngabulokana75@gmail.com (lösenord: admin123456)
- ✅ 5 exempelprodukter

## ✅ Steg 4: Verifiera att det fungerade

Kör detta i SQL Console:
```sql
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;
```

Du ska se:
```
cart_items
order_items
orders
products
support_tickets
users
```

Kolla användare:
```sql
SELECT email, role FROM users;
```

Du ska se:
```
test@example.com | customer
ngabulokana75@gmail.com | admin
```

## 🔧 Steg 5: Inaktivera Demo-läge

1. Öppna `.env.local`
2. Ändra:
   ```env
   DEMO_MODE=false
   ```
3. Spara filen

## 🔄 Steg 6: Starta om servern

1. Stoppa nuvarande server (tryck `Ctrl+C` i terminalen)
2. Starta igen:
   ```bash
   npm run dev
   ```

## 🧪 Steg 7: Testa inloggning

### Test 1: Via script
```bash
node test-login-http.js
```

Du ska se:
```
✅ Login successful!
```

### Test 2: Via webbläsare
1. Gå till: http://localhost:3000/login
2. Logga in med:
   - **Email**: test@example.com
   - **Lösenord**: test123456
3. Du ska bli inloggad!

### Test 3: Admin-inloggning
1. Gå till: http://localhost:3000/admin/login
2. Logga in med:
   - **Email**: ngabulokana75@gmail.com
   - **Lösenord**: admin123456
3. Du ska komma till admin-panelen!

## 🎉 Klart!

Din Turso-databas är nu konfigurerad och fungerar!

### Vad fungerar nu:
- ✅ Riktig inloggning med databas
- ✅ Registrering av nya användare
- ✅ Produkter från databas
- ✅ Admin-panel för att hantera produkter
- ✅ Ordrar och betalningar
- ✅ Kundvagn

## 📊 Nästa steg

### Lägg till fler produkter
1. Logga in som admin
2. Gå till: http://localhost:3000/admin/products
3. Klicka "Lägg till produkt"
4. Fyll i formuläret och spara

### Skapa fler användare
Användare kan registrera sig via: http://localhost:3000/register

### Deploya till production
När allt fungerar lokalt:
1. Pusha till GitHub
2. Deploya till Vercel
3. Sätt environment-variabler i Vercel:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `DEMO_MODE=false`
   - Alla andra variabler från `.env.local`

## 🆘 Felsökning

### Problem: "no such table: users"
- Kör SQL-scriptet igen i Turso Dashboard
- Verifiera att tabellerna skapades

### Problem: "Felaktig e-postadress eller lösenord"
- Kontrollera att användarna skapades korrekt
- Kör: `SELECT * FROM users;` i SQL Console

### Problem: "Databas ej tillgänglig"
- Kontrollera att `DEMO_MODE=false` i `.env.local`
- Kontrollera att Turso-credentials är korrekta
- Starta om servern

## 📞 Support

Om du behöver hjälp:
- Turso Docs: https://docs.turso.tech/
- Turso Discord: https://discord.gg/turso
- GitHub: https://github.com/tursodatabase/turso-cli/issues
