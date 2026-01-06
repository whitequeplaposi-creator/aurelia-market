# Vercel: "Git Repository cannot be connected to more than 10 Projects" - Lösning

## 🔴 Problem

**Felmeddelande:**
```
A Git Repository cannot be connected to more than 10 Projects.
```

**Orsak:**  
Ditt GitHub-repository `paradoxapiko-maker/aurelia-market` är redan kopplat till 10 eller fler Vercel-projekt. Vercel har en begränsning på max 10 projekt per repository.

---

## ✅ Lösningar

### Lösning 1: Ta bort gamla/oanvända Vercel-projekt (REKOMMENDERAT)

#### Steg 1: Lista alla projekt kopplade till repositoryt

1. Gå till **Vercel Dashboard**: https://vercel.com/dashboard
2. Klicka på ditt användarnamn/team i sidomenyn
3. Se alla dina projekt

#### Steg 2: Identifiera gamla projekt

Leta efter projekt som:
- Inte används längre
- Är test-projekt
- Är duplicerade versioner av samma app
- Har gamla namn eller versioner

#### Steg 3: Ta bort gamla projekt

För varje projekt du vill ta bort:

1. Klicka på projektet
2. Gå till **Settings** (längst ner i sidomenyn)
3. Scrolla ner till **Delete Project**
4. Klicka på **Delete**
5. Bekräfta genom att skriva projektnamnet
6. Klicka på **Delete**

**VIKTIGT:** Ta bort minst 1 projekt för att få plats för det nya.

#### Steg 4: Skapa nytt projekt

Efter att du tagit bort gamla projekt:

1. Gå till Vercel Dashboard
2. Klicka på **Add New...** → **Project**
3. Välj **Import Git Repository**
4. Välj `paradoxapiko-maker/aurelia-market`
5. Konfigurera miljövariabler (se nedan)
6. Klicka på **Deploy**

---

### Lösning 2: Skapa ett nytt GitHub-repository

Om du inte vill ta bort gamla projekt kan du skapa ett nytt repository:

#### Steg 1: Skapa nytt GitHub-repository

1. Gå till GitHub: https://github.com/new
2. Repository namn: `aurelia-market-production` (eller annat namn)
3. Välj **Private** eller **Public**
4. **VIKTIGT:** Skapa INTE README, .gitignore eller license (vi har redan dessa)
5. Klicka på **Create repository**

#### Steg 2: Uppdatera git remote lokalt

```bash
# Ta bort gamla remote
git remote remove origin

# Lägg till nya remote (ändra URL till ditt nya repo)
git remote add origin https://github.com/paradoxapiko-maker/aurelia-market-production.git

# Pusha till nya repositoryt
git push -u origin main
```

#### Steg 3: Koppla Vercel till nya repositoryt

1. Gå till Vercel Dashboard
2. Klicka på **Add New...** → **Project**
3. Välj **Import Git Repository**
4. Välj ditt nya repository: `aurelia-market-production`
5. Konfigurera miljövariabler (se nedan)
6. Klicka på **Deploy**

---

### Lösning 3: Använd Vercel CLI för deployment (Alternativ)

Om du inte vill använda Git-integration kan du deploya direkt från din lokala maskin:

#### Steg 1: Installera Vercel CLI

```bash
npm install -g vercel
```

#### Steg 2: Logga in

```bash
vercel login
```

#### Steg 3: Deploya

```bash
# Första gången
vercel

# Följ instruktionerna och konfigurera miljövariabler
```

#### Steg 4: Deploya till production

```bash
vercel --prod
```

**NACKDEL:** Ingen automatisk deployment vid git push.

---

## 🔧 Miljövariabler för Vercel

Oavsett vilken lösning du väljer, lägg till dessa miljövariabler i Vercel:

```bash
DEMO_MODE=true
JWT_SECRET=aurelia-market-production-secret-2024-change-this
API_KEY_ENCRYPTION_SECRET=aurelia-encryption-secret-2024-change-this
NEXT_PUBLIC_APP_URL=https://din-app.vercel.app
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_placeholder
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
NEXT_PUBLIC_SUPABASE_URL=https://demo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo
```

**Konfigurera i Vercel:**
1. Gå till projekt → **Settings** → **Environment Variables**
2. Lägg till varje variabel
3. Välj **Production**, **Preview** och **Development**
4. Klicka på **Save**

---

## 📋 Rekommenderad Lösning

**Jag rekommenderar Lösning 1** (ta bort gamla projekt) eftersom:

✅ Enklast och snabbast  
✅ Behåller samma repository  
✅ Automatisk deployment vid git push  
✅ Ingen kodändring behövs  
✅ Ingen extra kostnad  

**Steg-för-steg:**

1. **Gå till Vercel Dashboard**
2. **Identifiera 1-2 gamla/oanvända projekt**
3. **Ta bort dem** (Settings → Delete Project)
4. **Skapa nytt projekt** från `aurelia-market` repository
5. **Lägg till miljövariabler** (se ovan)
6. **Deploy!** 🚀

---

## 🔍 Kontrollera antal projekt

För att se hur många projekt som är kopplade till ditt repository:

1. Gå till Vercel Dashboard
2. Filtrera projekt efter repository-namn
3. Räkna antalet projekt som använder `aurelia-market`

Om du har 10 eller fler, måste du ta bort minst 1.

---

## 🆘 Felsökning

### "Jag hittar inte gamla projekt att ta bort"

**Lösning:** Använd Lösning 2 (skapa nytt repository) eller Lösning 3 (Vercel CLI).

### "Jag vill behålla alla mina projekt"

**Lösning:** 
- Uppgradera till Vercel Pro (högre gräns)
- Eller använd Lösning 2 (nytt repository)
- Eller använd Lösning 3 (Vercel CLI)

### "Deployment misslyckas efter att jag skapat nytt projekt"

**Kontrollera:**
1. Att alla miljövariabler är satta
2. Att `DEMO_MODE=true` är satt
3. Att senaste koden är pushad (commit `6aff0ce` eller senare)
4. Läs build-loggen för specifika fel

---

## 📝 Sammanfattning

**Problem:** Max 10 projekt per repository i Vercel  
**Snabbaste lösning:** Ta bort 1-2 gamla projekt  
**Alternativ:** Skapa nytt repository eller använd Vercel CLI  
**Nästa steg:** Konfigurera miljövariabler och deploya  

---

**Uppdaterad:** 2025-01-06  
**Status:** Koden är redo - bara Vercel-konfiguration kvarstår  
**Repository:** `paradoxapiko-maker/aurelia-market`  
**Senaste Commit:** `6aff0ce`
