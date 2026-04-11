@echo off
echo =======================================================
echo Starting Restaurant Management System (Backend + Frontend)
echo =======================================================

cd /d "%~dp0"

echo Checking backend dependencies...
if not exist "node_modules\" (
    echo node_modules not found. Running npm install...
    npm install
)

echo.
echo Starting Frontend UI Server at http://localhost:3000 ...
:: We use 'start' to run this in a separate command window so it doesn't block the backend
start "Lumina Frontend UI" cmd /c "npx http-server frontend -p 3000 -c-1"

echo Waiting for local frontend server...
timeout /t 3 /nobreak >nul

echo Opening browser...
start http://localhost:3000

echo.
echo Starting Backend API Server (Port 4000)...
npm start

pause
