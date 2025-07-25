# Stop script on any error
$ErrorActionPreference = "Stop"

# --- Script Configuration ---
$javaBackendPath = ".\java_backend"
$vsixName = "hybrid-demo"

# Function for colored output
function Write-Host-Colored {
    param(
        [string]$Message,
        [string]$Color
    )
    Write-Host $Message -ForegroundColor $Color
}

# --- Build Steps ---

Write-Host-Colored "=============================================" "Cyan"
Write-Host-Colored "🚀 STARTING HYBRID EXTENSION BUILD 🚀" "Cyan"
Write-Host-Colored "=============================================" "Cyan"

# 1. Install Node.js dependencies
Write-Host-Colored "`n[1/4] Installing Node.js dependencies..." "Yellow"
npm install

# 2. Compile TypeScript
Write-Host-Colored "`n[2/4] Compiling TypeScript..." "Yellow"
npm run compile

# 3. Build Java Backend with Maven
Write-Host-Colored "`n[3/4] Building Java backend with Maven (Fat JAR)..." "Yellow"
# The -f flag explicitly points to the pom.xml location
mvn -f "$javaBackendPath\pom.xml" clean package
if ($LASTEXITCODE -ne 0) {
    Write-Host-Colored "❌ Maven build failed." "Red"
    exit 1
}
Write-Host-Colored "✅ Java build successful." "Green"

# 4. Package the VS Code Extension
Write-Host-Colored "`n[4/4] Packaging the VS Code extension (.vsix)..." "Yellow"
vsce package --ignore-recommendations --out "$vsixName.vsix"

Write-Host-Colored "`n=============================================" "Cyan"
Write-Host-Colored "🎉 BUILD COMPLETE! 🎉" "Cyan"
Write-Host-Colored "Your extension is ready: .\$vsixName.vsix" "Green"
Write-Host-Colored "=============================================" "Cyan"