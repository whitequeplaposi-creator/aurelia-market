# Add dynamic export to all API routes
$files = @(
    "src/app/api/auth/register/route.ts",
    "src/app/api/products/route.ts",
    "src/app/api/products/[id]/route.ts",
    "src/app/api/cart/route.ts",
    "src/app/api/cart/items/route.ts",
    "src/app/api/cart/items/[id]/route.ts",
    "src/app/api/checkout/create-payment-intent/route.ts",
    "src/app/api/webhooks/stripe/route.ts",
    "src/app/api/orders/route.ts",
    "src/app/api/orders/[id]/route.ts",
    "src/app/api/admin/products/route.ts",
    "src/app/api/admin/products/[id]/route.ts",
    "src/app/api/admin/products/import/route.ts",
    "src/app/api/admin/orders/route.ts",
    "src/app/api/admin/orders/[id]/route.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content -notmatch "export const dynamic") {
            # Find the first import statement and add after it
            $lines = Get-Content $file
            $newLines = @()
            $added = $false
            
            foreach ($line in $lines) {
                $newLines += $line
                if (-not $added -and $line -match "^import.*from") {
                    # Check if next line is also an import
                    $nextIndex = [array]::IndexOf($lines, $line) + 1
                    if ($nextIndex -lt $lines.Length -and $lines[$nextIndex] -notmatch "^import") {
                        $newLines += ""
                        $newLines += "// Force dynamic rendering"
                        $newLines += "export const dynamic = 'force-dynamic';"
                        $added = $true
                    }
                }
            }
            
            $newLines | Set-Content $file
            Write-Host "Updated: $file"
        }
    }
}
