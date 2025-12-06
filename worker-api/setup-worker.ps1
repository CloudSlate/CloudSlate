# CloudSlate Worker Setup Script
# This script helps you set up the Cloudflare Worker manually

Write-Host "=== CloudSlate Worker Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
$nodePath = Get-Command node -ErrorAction SilentlyContinue
if ($nodePath) {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/ (LTS version)" -ForegroundColor Yellow
    Write-Host "After installation, restart your terminal and run this script again." -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
Write-Host "Checking for npm..." -ForegroundColor Yellow
$npmPath = Get-Command npm -ErrorAction SilentlyContinue
if ($npmPath) {
    $npmVersion = npm --version
    Write-Host "✓ npm found: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "✗ npm not found" -ForegroundColor Red
    Write-Host "npm should come with Node.js. Please reinstall Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if wrangler is installed
Write-Host "Checking for Wrangler CLI..." -ForegroundColor Yellow
$wranglerPath = Get-Command wrangler -ErrorAction SilentlyContinue
if ($wranglerPath) {
    $wranglerVersion = wrangler --version
    Write-Host "✓ Wrangler found: $wranglerVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Wrangler not found. Installing globally..." -ForegroundColor Yellow
    npm install -g wrangler
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Wrangler installed successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install Wrangler" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "=== Setup Steps ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Login to Cloudflare:" -ForegroundColor Yellow
Write-Host "   wrangler login" -ForegroundColor White
Write-Host ""
Write-Host "2. Create KV Namespace:" -ForegroundColor Yellow
Write-Host "   wrangler kv:namespace create `"BLOG_STORAGE`"" -ForegroundColor White
Write-Host "   (Copy the namespace ID from the output)" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Update wrangler.toml:" -ForegroundColor Yellow
Write-Host "   - Replace YOUR_KV_NAMESPACE_ID with the ID from step 2" -ForegroundColor White
Write-Host "   - Change ADMIN_TOKEN to a secure random token" -ForegroundColor White
Write-Host ""
Write-Host "4. Install dependencies:" -ForegroundColor Yellow
Write-Host "   npm install" -ForegroundColor White
Write-Host ""
Write-Host "5. Deploy the worker:" -ForegroundColor Yellow
Write-Host "   wrangler deploy" -ForegroundColor White
Write-Host ""

$continue = Read-Host "Would you like to start with step 1 (login)? (y/n)"
if ($continue -eq 'y' -or $continue -eq 'Y') {
    Write-Host ""
    Write-Host "Running: wrangler login" -ForegroundColor Cyan
    wrangler login
}

