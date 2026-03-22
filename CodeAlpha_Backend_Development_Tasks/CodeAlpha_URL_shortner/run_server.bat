@echo off
:: Change to the directory of the batch file so it runs correctly even as Administrator
cd /d "%~dp0"

echo Starting URL Shortener Setup...
echo.

:: Check for Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in your PATH.
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b
)

if not exist "node_modules" (
    echo [1/3] node_modules not found. Initializing package.json...
    if not exist "package.json" (
        call npm init -y > nul
    )
    
    echo [2/3] Installing dependencies (express, cors, sqlite3)...
    call npm install express cors sqlite3
    echo.
) else (
    echo [1/3] Dependencies are already installed. Skipping installation.
)

echo [3/3] Starting the Server and opening your browser...
echo.
start http://localhost:3000
node server.js

pause
