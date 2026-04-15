@echo off
title Spice Route - Restaurant Management System
color 0A

echo.
echo  ============================================================
echo   🍽️  SPICE ROUTE — Restaurant Management System
echo  ============================================================
echo.
echo  [1/4] Checking Node.js installation...
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo  ❌ Node.js is not installed!
    echo  Please install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo  ✅ Node.js %NODE_VERSION% detected
echo.

echo  [2/4] Installing dependencies...
echo.
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo  ❌ Failed to install dependencies!
    pause
    exit /b 1
)
echo.
echo  ✅ Dependencies installed successfully
echo.

echo  [3/4] Cleaning old database for fresh seed...
echo.
if exist restaurant.sqlite (
    del /f restaurant.sqlite
    echo  🗑️  Old database removed
) else (
    echo  ℹ️  No existing database found (fresh start)
)
echo.

echo  [4/4] Starting server...
echo.
echo  ============================================================
echo   🚀 Server starting on http://localhost:4000
echo   🔑 Admin Key: changeme
echo   📋 Press Ctrl+C to stop the server
echo  ============================================================
echo.

:: Open browser after a short delay
start "" timeout /t 3 /nobreak >nul ^& start http://localhost:4000

:: Start the server
node src/server.js
