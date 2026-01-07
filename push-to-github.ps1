# Aurelia Market - Push to GitHub Script
# Detta skript pushar koden till ditt GitHub-repository

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Aurelia Market - Push to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Fråga efter GitHub-användarnamn
Write-Host "Ange ditt GitHub-användarnamn:" -ForegroundColor Green
$username = Read-Host

if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "ERROR: Du måste ange ett användarnamn!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Användarnamn: $username" -ForegroundColor Yellow
Write-Host "Repository: aurelia-market" -ForegroundColor Yellow
Write-Host ""
Write-Host "Är detta korrekt? (J/N)" -ForegroundColor Green
$confirm = Read-Host

if ($confirm -ne "J" -and $confirm -ne "j" -and $confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Avbrutet av användaren" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Steg 1: Kontrollerar remote..." -ForegroundColor Green

# Ta bort befintlig remote om den finns
try {
    git remote remove origin 2>$null
} catch {
    # Ingen remote finns, fortsätt
}

Write-Host "Steg 2: Lägger till GitHub remote..." -ForegroundColor Green
$repoUrl = "https://github.com/$username/aurelia-market.git"
git remote add origin $repoUrl
Write-Host "  Remote tillagd: $repoUrl" -ForegroundColor Green

Write-Host ""
Write-Host "Steg 3: Sätter branch till main..." -ForegroundColor Green
git branch -M main
Write-Host "  Branch satt till main" -ForegroundColor Green

Write-Host ""
Write-Host "Steg 4: Pushar till GitHub..." -ForegroundColor Green
Write-Host "  (Du kan behöva logga in med ditt GitHub-lösenord eller personal access token)" -ForegroundColor Yellow
Write-Host ""

try {
    git push -u origin main
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  SUCCESS! Kod uppladdat till GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Ditt repository finns nu på:" -ForegroundColor White
    Write-Host "  https://github.com/$username/aurelia-market" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Vill du öppna repositoryt i webbläsaren? (J/N)" -ForegroundColor Green
    $openBrowser = Read-Host
    
    if ($openBrowser -eq "J" -or $openBrowser -eq "j" -or $openBrowser -eq "Y" -or $openBrowser -eq "y") {
        Start-Process "https://github.com/$username/aurelia-market"
        Write-Host ""
        Write-Host "Repository öppnat i webbläsaren!" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  NÄSTA STEG" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Verifiera att alla filer finns på GitHub" -ForegroundColor White
    Write-Host "2. Lägg till Topics/Tags på GitHub:" -ForegroundColor White
    Write-Host "   nextjs, typescript, ecommerce, stripe, supabase," -ForegroundColor Yellow
    Write-Host "   tailwindcss, react, e-commerce, webshop" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "3. För att deploya till Vercel:" -ForegroundColor White
    Write-Host "   - Gå till https://vercel.com" -ForegroundColor Cyan
    Write-Host "   - Importera ditt GitHub-repository" -ForegroundColor Cyan
    Write-Host "   - Lägg till miljövariabler från .env.example" -ForegroundColor Cyan
    Write-Host "   - Klicka Deploy!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Se VERCEL-DEPLOYMENT-GUIDE.md för detaljerade instruktioner" -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ERROR vid push till GitHub" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Möjliga orsaker:" -ForegroundColor Yellow
    Write-Host "1. Repositoryt finns inte på GitHub" -ForegroundColor White
    Write-Host "   Lösning: Skapa repositoryt på https://github.com/new" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Fel användarnamn" -ForegroundColor White
    Write-Host "   Lösning: Kör skriptet igen med rätt användarnamn" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "3. Autentiseringsproblem" -ForegroundColor White
    Write-Host "   Lösning: Använd Personal Access Token istället för lösenord" -ForegroundColor Cyan
    Write-Host "   Guide: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "4. Repositoryt är inte tomt" -ForegroundColor White
    Write-Host "   Lösning: Skapa ett nytt tomt repository eller använd force push:" -ForegroundColor Cyan
    Write-Host "   git push -u origin main --force" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
