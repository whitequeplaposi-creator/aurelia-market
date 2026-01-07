# Fix Login - Rensa Cache och Starta Om

Write-Host "Fixar login-problem genom att rensa cache..." -ForegroundColor Cyan
Write-Host ""

# Steg 1: Rensa Next.js cache
Write-Host "Rensar Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "Next.js cache rensad" -ForegroundColor Green
} else {
    Write-Host "Ingen .next mapp hittades" -ForegroundColor Gray
}

# Steg 2: Rensa node cache
Write-Host ""
Write-Host "Rensar npm cache..." -ForegroundColor Yellow
npm cache clean --force 2>$null
Write-Host "npm cache rensad" -ForegroundColor Green

# Steg 3: Visa instruktioner
Write-Host ""
Write-Host "CACHE RENSAD!" -ForegroundColor Green
Write-Host ""

Write-Host "Nasta steg:" -ForegroundColor Yellow
Write-Host "   1. Starta servern: npm run dev" -ForegroundColor White
Write-Host "   2. Oppna webblasaren i inkognito-lage" -ForegroundColor White
Write-Host "   3. Ga till: http://localhost:3001/register" -ForegroundColor White
Write-Host "   4. Registrera med en Gmail-adress" -ForegroundColor White
Write-Host "   5. Testa login" -ForegroundColor White
Write-Host ""

Write-Host "For att testa API direkt:" -ForegroundColor Yellow
Write-Host "   node diagnose-complete.js" -ForegroundColor White
Write-Host ""
