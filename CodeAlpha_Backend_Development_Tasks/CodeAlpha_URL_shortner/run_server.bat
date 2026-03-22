@echo off
:: Change to the directory of the batch file
cd /d "%~dp0"

echo Starting URL Shortener Setup
echo.

:: Check for Node.js
node -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in your PATH.
    winget install -e --id OpenJS.NodeJS
    pause
    exit /b
)

:: Install dependencies if needed
if not exist "node_modules" (
    echo [1/3] node_modules not found. Initializing package.json
    if not exist "package.json" (
        npm init -y >nul
    )
    
    echo [2/3] Installing dependencies: express, cors, sqlite3
    npm install express cors sqlite3
    echo.
) else (
    echo [1/3] Dependencies are already installed. Skipping installation.
)

echo [3/3] Starting the Server
start node server.js
timeout /t 3 >nul
start http://localhost:3000

pause