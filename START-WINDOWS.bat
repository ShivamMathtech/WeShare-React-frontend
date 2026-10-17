@echo off
setlocal
cd /d "%~dp0"
title WeShare - Development
where node >nul 2>nul
if errorlevel 1 goto setup_needed
node scripts\check-node.mjs
if errorlevel 1 goto failed
if not exist "node_modules\vite\package.json" goto setup_needed
echo Opening WeShare at http://127.0.0.1:5173/
call npm run dev -- --open
if errorlevel 1 goto failed
exit /b 0
:setup_needed
echo Run SETUP-WINDOWS.bat first, then open this file again.
:failed
pause
exit /b 1
