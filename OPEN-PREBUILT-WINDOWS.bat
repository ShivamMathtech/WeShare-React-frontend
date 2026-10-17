@echo off
setlocal
cd /d "%~dp0"
title WeShare - Ready to use
where node >nul 2>nul
if errorlevel 1 goto missing_node
echo Starting the included build. No npm installation is needed for this mode.
node scripts\serve.mjs --open
if errorlevel 1 pause
exit /b
:missing_node
echo Install Node.js 24 LTS from https://nodejs.org/ and reopen this file.
pause
exit /b 1
