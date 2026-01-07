# 🚀 Automatisk Vercel Deployment från GitHub

## Översikt

När du pushar kod till GitHub ska den automatiskt deployas till Vercel. Här är steg-för-steg guiden.

## 📋 Förutsättningar

- ✅ GitHub repository: https://github.com/whitequeplaposi-creator/aurelia-market.git
- ✅ Vercel-konto
- ✅ Projektet är pushat till GitHub

## 🔧 Steg 1: Koppla GitHub till Vercel

### A. Logga in på Vercel

1. Gå till: https://vercel.com
2. Klicka "Log in"
3. Välj "Continue with GitHub"
4. Godkänn åtkomst till ditt GitHub-konto

### B. Importera Projekt

1. På Vercel Dashboard, klicka "Add New..." → "Project"
2. Välj "Import Git Repository"
3. Hitta `aurelia-market` i listan
4. Klicka "Import"

### C. Konfigurera Projekt

**Framework Preset:** Next.js (detekteras automatiskt)

**Root Directory:** `./` (lämna som standard)

**Build Command:** `npm run build` (standard)

**Output Directory:** `.next` (standard)

**Install Command:** `npm install` (standard)

## 🔐 Steg 2: Lägg till Environment Variables

Klicka på "Environment Variables" och lägg till följande:

### Kritiska Variabler (MÅSTE finnas)

```env
# Turso Database
TURSO_DATABASE_URL=<din-turso-url>
TURSO_AUTH_TOKEN=<din-turso-write-token>

# Demo Mode (VIKTIGT: false för production)
DEMO_MODE=false

# JWT Secret
JWT_SECRET=<din-jwt-secret>

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=<din-stripe-public-key>
STRIPE_SECRET_KEY=<din-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<din-stripe-webhook-secret>
```

**VIKTIGT:** Använd dina egna nycklar från:
- Turso: https://turso.tech/app
- Stripe: https://dashboard.stripe.com/apikeys

### Valfria Variabler (för Supabase-kompatibilitet)

```env
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDE3NjkyMDAsImV4cCI6MTk1NzM0NTIwMH0.placeholder-key
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0MTc2OTIwMCwiZXhwIjoxOTU3MzQ1MjAwfQ.placeholder-service-key
```

**VIKTIGT:** 
- Markera alla variabler för "Production", "Preview" och "Development"
- Dubbelkolla att DEMO_MODE=false
- Dubbelkolla att TURSO_AUTH_TOKEN är write-token (inte read-only)

## 🚀 Steg 3: Deploy

1. Klicka "Deploy"
2. Vänta medan Vercel bygger projektet (2-5 minuter)
3. När det är klart får du en URL: `https://aurelia-market.vercel.app` (eller liknande)

## ⚙️ Steg 4: Konfigurera Automatisk Deployment

### A. Vercel Inställningar

1. Gå till Project Settings
2. Klicka på "Git" i sidomenyn
3. Kontrollera att följande är aktiverat:
   - ✅ **Production Branch:** `main`
   - ✅ **Automatic Deployments:** ON
   - ✅ **Deploy Hooks:** (valfritt)

### B. GitHub Integration

Vercel skapar automatiskt en GitHub App som:
- ✅ Lyssnar på push till `main` branch
- ✅ Skapar preview deployments för pull requests
- ✅ Kommenterar på commits med deployment-status

## 🔄 Hur Automatisk Deployment Fungerar

### När du pushar till GitHub:

```bash
git add .
git commit -m "Din commit-message"
git push origin main
```

**Vad händer:**
1. 🔔 GitHub notifierar Vercel om push
2. 🏗️ Vercel startar automatisk build
3. ✅ Om build lyckas → Deploy till production
4. ❌ Om build misslyckas → Behåller föregående version
5. 📧 Du får email-notifikation om status

### Deployment-tid:
- **Build:** 2-5 minuter
- **Deploy:** 10-30 sekunder
- **Total:** ~3-6 minuter från push till live

## 📊 Övervaka Deployments

### Vercel Dashboard

1. Gå till: https://vercel.com/dashboard
2. Välj ditt projekt
3. Se alla deployments under "Deployments"

### Deployment-status:

- 🟡 **Building** - Bygger projektet
- 🟢 **Ready** - Live på production
- 🔴 **Error** - Build misslyckades
- 🔵 **Canceled** - Deployment avbruten

## 🐛 Felsökning

### Problem: Build misslyckas

**Lösning:**
1. Kontrollera build-loggar i Vercel
2. Testa build lokalt: `npm run build`
3. Fixa fel och pusha igen

### Problem: Environment variables saknas

**Lösning:**
1. Gå till Project Settings → Environment Variables
2. Lägg till saknade variabler
3. Redeploy: Deployments → ⋯ → Redeploy

### Problem: Login fungerar inte på Vercel

**Lösning:**
1. Kontrollera att DEMO_MODE=false
2. Kontrollera att TURSO_AUTH_TOKEN är write-token
3. Kontrollera att JWT_SECRET är satt
4. Kolla Vercel Function Logs för felmeddelanden

## 📝 Bästa Praxis

### Commit Messages

Använd tydliga commit-messages:
```bash
git commit -m "Fix: Åtgärda login-problem"
git commit -m "Feature: Lägg till ny produktkategori"
git commit -m "Update: Förbättra produktbilder"
```

### Branching Strategy

**För större ändringar:**
```bash
# Skapa feature branch
git checkout -b feature/ny-funktion

# Gör ändringar och commit
git add .
git commit -m "Add: Ny funktion"

# Pusha feature branch
git push origin feature/ny-funktion

# Skapa Pull Request på GitHub
# Vercel skapar automatisk preview deployment

# När godkänd, merge till main
# Vercel deployer automatiskt till production
```

## 🔐 Säkerhet

### Secrets Management

**ALDRIG commit:**
- ❌ API keys
- ❌ Database credentials
- ❌ JWT secrets
- ❌ Stripe keys

**Använd istället:**
- ✅ Vercel Environment Variables
- ✅ .env.local (i .gitignore)
- ✅ GitHub Secrets (för CI/CD)

### .gitignore

Kontrollera att följande finns i `.gitignore`:
```
.env.local
.env*.local
.vercel
```

## 📧 Notifikationer

### Email Notifications

Vercel skickar email när:
- ✅ Deployment lyckas
- ❌ Deployment misslyckas
- 🔔 Domain-ändringar
- ⚠️ Quota-varningar

### Slack/Discord Integration

1. Gå till Project Settings → Integrations
2. Välj Slack eller Discord
3. Konfigurera webhook
4. Få notifikationer i din kanal

## 🎯 Sammanfattning

**Setup (engångskonfiguration):**
1. ✅ Koppla GitHub till Vercel
2. ✅ Importera projekt
3. ✅ Lägg till environment variables
4. ✅ Deploy första gången

**Daglig användning:**
```bash
# Gör ändringar i koden
git add .
git commit -m "Din ändring"
git push origin main

# Vänta 3-6 minuter
# ✅ Automatiskt live på Vercel!
```

**Vercel URL:** https://aurelia-market.vercel.app (eller din custom domain)

**GitHub Repo:** https://github.com/whitequeplaposi-creator/aurelia-market

## 🚀 Nästa Steg

1. **Testa deployment:**
   - Gör en liten ändring
   - Pusha till GitHub
   - Vänta på deployment
   - Verifiera på Vercel URL

2. **Konfigurera custom domain (valfritt):**
   - Gå till Project Settings → Domains
   - Lägg till din domain
   - Uppdatera DNS-records

3. **Övervaka prestanda:**
   - Använd Vercel Analytics
   - Kolla Function Logs
   - Optimera baserat på data

Din e-handelsplattform är nu konfigurerad för automatisk deployment! 🎉
