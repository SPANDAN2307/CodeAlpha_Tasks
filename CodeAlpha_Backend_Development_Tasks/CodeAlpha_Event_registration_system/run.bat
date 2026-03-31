@echo off
title Event Registration System Server
echo =======================================================
echo Starting Event Registration System (Frontend and Backend)
echo =======================================================
echo.

echo Checking and installing new dependencies (including Authentication packages)...
call npm run install-all
echo.

echo Starting the servers...
npm run dev

pause
