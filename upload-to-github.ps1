# Aurelia Market - GitHub Upload Script
# Detta skript laddar upp projektet till GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Aurelia Market - GitHub Upload" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kontrollera om git är installerat
try {
    git --version | Out-Null
} catch {
    Write-Host "ERROR: Git är inte installerat!" -ForegroundColor Red
    Write-Host "Installera Git från: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host "Steg 1: Initierar Git repository..." -ForegroundColor Green
if (Test-Path ".git") {
    Write-Host "  Git repository finns redan" -ForegroundColor Yellow
} else {
    git init
    Write-Host "  Git repository skapat!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Steg 2: Lägger till alla filer..." -ForegroundColor Green
git add .
Write-Host "  Alla filer tillagda!" -ForegroundColor Green

Write-Host ""
Write-Host "Steg 3: Skapar commit..." -ForegroundColor Green
git commit -m "Initial commit: Aurelia Market - Professionell e-handelsplattform

✅ Komplett e-handelsplattform med Next.js 14, TypeScript och Tailwind CSS
✅ 8 produktkategorier med 24 produkter
✅ Säkra betalningar via Stripe (Visa, Mastercard, PayPal, Klarna)
✅ Responsiv design för alla enheter (mobil, tablet, desktop)
✅ Admin-panel med produkthantering och orderhantering
✅ JWT-autentisering och bcrypt-hashade lösenord
✅ XSS-skydd, SQL-injection-skydd och rate limiting
✅ GDPR-anpassad med cookie-policy och integritetspolicy
✅ Komplett dokumentation och deployment-guider
✅ Produktionsklar och redo att användas

Teknisk stack:
- Framework: Next.js 14 (App Router)
- Språk: TypeScript
- Styling: Tailwind CSS
- Databas: Supabase (PostgreSQL) / Turso (SQLite)
- Betalningar: Stripe
- Autentisering: JWT + bcrypt
- State Management: Zustand
- Säkerhet: DOMPurify, Rate Limiting

Funktioner:
- Produktkatalog med sökning och filtrering
- Varukorgsfunktionalitet med realtidsuppdatering
- Checkout med säkra betalningar
- Orderhistorik och orderspårning
- Admin-panel för produkthantering
- API-import från externa källor
- Mobiloptimerad med hamburger-meny
- Kategori-navigation med 8 kategorier

Säkerhet:
- GDPR-anpassad
- XSS-skydd (DOMPurify)
- SQL-injection-skydd
- JWT-autentisering
- Rate limiting (100 req/15min)
- Krypterade API-nycklar (AES-256-CBC)
- Bcrypt-hashade lösenord

Dokumentation:
- README.md - Komplett installation och API-dokumentation
- KATEGORISYSTEM.md - Guide för kategorisystemet
- MOBILOPTIMERING.md - Responsiv design-dokumentation
- DEPLOYMENT.md - Deployment-guide för Vercel/Netlify
- KONTROLL-RAPPORT-2025-01-07.md - Kvalitetskontroll

Status: ✅ 100% Produktionsklar"

Write-Host "  Commit skapad!" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NÄSTA STEG - VIKTIGT!" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Gå till GitHub och skapa ett nytt repository:" -ForegroundColor White
Write-Host "   https://github.com/new" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Repository-inställningar:" -ForegroundColor White
Write-Host "   Namn: aurelia-market" -ForegroundColor Yellow
Write-Host "   Beskrivning: En modern, professionell e-handelsplattform" -ForegroundColor Yellow
Write-Host "   Synlighet: Public eller Private (ditt val)" -ForegroundColor Yellow
Write-Host "   VIKTIGT: Skapa INTE README, .gitignore eller license (vi har redan dessa)" -ForegroundColor Red
Write-Host ""
Write-Host "3. Efter att du skapat repositoryt, kör dessa kommandon:" -ForegroundColor White
Write-Host ""
Write-Host "   git remote add origin https://github.com/DITT-ANVÄNDARNAMN/aurelia-market.git" -ForegroundColor Cyan
Write-Host "   git branch -M main" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "   (Byt ut DITT-ANVÄNDARNAMN med ditt GitHub-användarnamn)" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Vill du att jag ska öppna GitHub i din webbläsare? (J/N)" -ForegroundColor Green
$response = Read-Host

if ($response -eq "J" -or $response -eq "j" -or $response -eq "Y" -or $response -eq "y") {
    Start-Process "https://github.com/new"
    Write-Host ""
    Write-Host "GitHub öppnat i webbläsaren!" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Lokala filer är klara!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "När du har skapat repositoryt på GitHub, kör:" -ForegroundColor White
Write-Host "  .\push-to-github.ps1" -ForegroundColor Cyan
Write-Host ""
