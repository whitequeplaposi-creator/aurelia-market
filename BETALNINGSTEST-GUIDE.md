# Betalningstest Guide 🧪

## Översikt

Denna guide hjälper dig att testa betalningsflödet med en testprodukt på 4 kr innan du lanserar din e-handel med riktiga produkter.

---

## 🎯 Syfte

- Testa att Stripe-integrationen fungerar korrekt
- Verifiera hela betalningsflödet från varukorg till order
- Säkerställa att betalningar registreras i Stripe Dashboard
- Bekräfta att orders sparas i databasen
- Testa med låg kostnad (4 kr) innan lansering

---

## 📋 Förberedelser

### 1. Säkerställ att Turso Database är Konfigurerad

```bash
# Kontrollera att du har write-access token
# Se TURSO-DATABASE-SETUP.md för instruktioner
```

### 2. Säkerställ att Stripe är Konfigurerat

```bash
# Kontrollera .env.local
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

---

## 🚀 Steg 1: Lägg till Testprodukt

Kör detta kommando för att lägga till en testprodukt på 4 kr:

```bash
npm run db:add-test-product
```

**Förväntad output:**
```
🧪 Adding test product for payment testing...

✅ Test product added successfully!

📦 Product Details:
   ID: test-product-4kr
   Name: TEST - Betalningstest 4kr
   Price: 4.00 SEK
   Stock: 999
   Category: test

🎯 Next Steps:
   1. Go to /products to see the test product
   2. Add it to cart
   3. Go to checkout
   4. Complete payment with Stripe
   5. Verify payment in Stripe Dashboard
```

---

## 🧪 Steg 2: Genomför Betalningstest

### 2.1 Starta Applikationen

```bash
npm run dev
```

Öppna: `http://localhost:3000`

### 2.2 Navigera till Produkter

1. Gå till `/products`
2. Du ska se testprodukten: **"TEST - Betalningstest 4kr"**
3. Produkten har en 🧪 emoji för att visa att det är en testprodukt

### 2.3 Lägg till i Varukorg

1. Klicka på **"Lägg till i varukorg"** på testprodukten
2. Gå till `/cart`
3. Verifiera att produkten finns i varukorgen
4. Totalpris ska vara **4 kr**

### 2.4 Gå till Kassan

1. Klicka på **"Gå till kassan"**
2. Du omdirigeras till `/checkout`
3. Stripe Elements ska laddas (kortformulär)

### 2.5 Fyll i Kortuppgifter

**För Test (om du använder test keys):**
- Kortnummer: `4242 4242 4242 4242`
- Expiry: `12/34`
- CVC: `123`
- ZIP: `12345`

**För Production (med live keys):**
- Använd ett riktigt kort
- ⚠️ **4 kr kommer att dras från kortet!**

### 2.6 Genomför Betalning

1. Klicka på **"Betala 4 kr"**
2. Vänta på bekräftelse (kan ta några sekunder)
3. Du ska omdirigeras till `/payment-success`

### 2.7 Verifiera Success-sida

På success-sidan ska du se:
- ✅ Bekräftelsemeddelande
- Order-ID
- Totalt belopp: 4 kr
- Länk till "Se Mina Ordrar"

---

## ✅ Steg 3: Verifiera Betalning

### 3.1 Kontrollera Stripe Dashboard

1. Gå till: https://dashboard.stripe.com/payments
2. Du ska se betalningen på **4.00 SEK**
3. Status ska vara: **"Succeeded"**
4. Klicka på betalningen för mer detaljer

### 3.2 Kontrollera Order i Databasen

**Alternativ A: Via Applikationen**
1. Gå till `/orders`
2. Du ska se din order
3. Status: "Paid"
4. Belopp: 4 kr

**Alternativ B: Via Turso Dashboard**
1. Gå till: https://turso.tech/app
2. Välj din databas
3. Kör query:
   ```sql
   SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;
   ```
4. Du ska se din order

### 3.3 Kontrollera Order Items

```sql
SELECT * FROM order_items WHERE order_id = 'din-order-id';
```

Du ska se testprodukten i order items.

---

## 🧹 Steg 4: Ta Bort Testprodukt

När du har verifierat att betalningen fungerar och är redo att lägga till riktiga produkter:

```bash
npm run db:remove-test-products
```

**Förväntad output:**
```
🧹 Removing test products...

Found 1 test product(s):

   - TEST - Betalningstest 4kr (4 SEK) [ID: test-product-4kr]

✅ Successfully removed 1 test product(s)!

🎉 Your database now contains only real products.
```

---

## 📊 Checklista för Lyckad Test

- [ ] Testprodukt skapad i databasen
- [ ] Testprodukt syns på `/products`
- [ ] Kan lägga till i varukorg
- [ ] Varukorg visar korrekt pris (4 kr)
- [ ] Checkout-sida laddas korrekt
- [ ] Stripe Elements visas
- [ ] Kan fylla i kortuppgifter
- [ ] Betalning genomförs framgångsrikt
- [ ] Omdirigeras till success-sida
- [ ] Order visas på `/orders`
- [ ] Betalning syns i Stripe Dashboard
- [ ] Order finns i Turso-databasen
- [ ] Testprodukt borttagen efter test

---

## 🔄 Automatisk Borttagning (Framtida Feature)

För att automatiskt ta bort testprodukter när riktiga produkter läggs till, kan du:

### Alternativ 1: Manuellt

Kör `npm run db:remove-test-products` när du är klar med testning.

### Alternativ 2: Via Admin Panel

När du lägger till riktiga produkter via admin-panelen (`/admin/products`), kan du manuellt ta bort testprodukten.

### Alternativ 3: Automatiskt Script

Lägg till detta i din deployment-process:

```bash
# Efter att ha lagt till riktiga produkter
npm run db:remove-test-products
```

---

## 🆘 Felsökning

### Problem: Testprodukt syns inte på /products

**Lösning:**
1. Kontrollera att `DEMO_MODE=false` i `.env.local`
2. Kontrollera att databasen är konfigurerad
3. Kör `npm run db:add-test-product` igen
4. Restart development server

### Problem: "Invalid API Key" vid checkout

**Lösning:**
1. Kontrollera att Stripe keys är korrekt satta i `.env.local`
2. Kontrollera att keys börjar med `pk_live_` och `sk_live_`
3. Restart development server

### Problem: Betalning misslyckas

**Lösning:**
1. Kontrollera att kortet har tillräckligt med medel (4 kr)
2. Kontrollera att kortet inte är blockerat
3. Försök med ett annat kort
4. Kontrollera Stripe Dashboard för felmeddelanden

### Problem: Order skapas inte i databasen

**Lösning:**
1. Kontrollera att Turso auth token har write-access
2. Kontrollera att webhook är konfigurerad (om du använder webhooks)
3. Kontrollera browser console för fel
4. Kontrollera server logs

---

## 💡 Tips

### Test med Olika Betalningsmetoder

Om du vill testa olika scenarion:

**Test Cards (med test keys):**
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Insufficient funds:** `4000 0000 0000 9995`
- **3D Secure:** `4000 0027 6000 3184`

### Test med Olika Belopp

Du kan ändra priset på testprodukten:

```sql
UPDATE products 
SET price = 10.00 
WHERE id = 'test-product-4kr';
```

### Test med Flera Produkter

Lägg till testprodukten flera gånger i varukorgen för att testa högre belopp.

---

## 📝 Nästa Steg Efter Lyckad Test

1. ✅ Ta bort testprodukt: `npm run db:remove-test-products`
2. ✅ Lägg till riktiga produkter via admin-panelen (`/admin/products`)
3. ✅ Konfigurera webhooks i Stripe Dashboard (se STRIPE-PRODUCTION-SETUP.md)
4. ✅ Testa med riktiga produkter
5. ✅ Deploy till Vercel
6. ✅ Testa på production
7. ✅ Lansera! 🚀

---

## 📚 Relaterade Guider

- **STRIPE-PRODUCTION-SETUP.md** - Stripe-konfiguration
- **TURSO-DATABASE-SETUP.md** - Database-konfiguration
- **DEPLOYMENT-BADA-GITHUB-KONTON.md** - Deployment-guide

---

**Uppdaterad:** 2025-01-06  
**Status:** Redo för betalningstest  
**Kostnad:** 4 kr per test
