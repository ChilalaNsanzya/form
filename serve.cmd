@echo off
REM Double-click this to serve the prototype on your wifi.
cd /d "%~dp0"
where node >nul 2>nul || (
  echo Node.js is not installed. Get it from https://nodejs.org then run this again.
  pause & exit /b 1
)
node scripts\serve.mjs %1
pause
