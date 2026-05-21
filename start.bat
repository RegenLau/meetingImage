@echo off
setlocal

cd /d "%~dp0"
set "SERVER_SCRIPT=%~dp0tools\serve-static.ps1"

if not exist "%SERVER_SCRIPT%" (
  echo Cannot find "%SERVER_SCRIPT%".
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%SERVER_SCRIPT%"

if errorlevel 1 (
  echo.
  echo The local service stopped with an error.
  pause
)
