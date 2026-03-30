@echo off
title Event Registration System Server
echo =======================================================
echo Starting Event Registration System (Frontend and Backend)
echo =======================================================
echo.

:: Check if node_modules exists, if not, maybe prompt or just start.
:: Here we just start since it's a simple run file.
npm run dev

pause
