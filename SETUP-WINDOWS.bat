@echo off
setlocal
cd /d "%~dp0"
title WeShare - Setup
where node >nul 2>nul
if errorlevel 1 goto missing_node
node scripts\check-node.mjs
if errorlevel 1 goto failed
where npm >nul 2>nul
if errorlevel 1 goto missing_node
echo Installing the exact project dependencies...
call npm ci
if errorlevel 1 goto failed
echo.
echo Setup complete. Open START-WINDOWS.bat to work on the source.
pause
exit /b 0
:missing_node
echo Install Node.js 24.15 or later in the 24 LTS series, then reopen this file.
echo Official download: https://nodejs.org/
:failed
echo.
echo Setup did not complete. Read the error above and README.md.
pause
exit /b 1
