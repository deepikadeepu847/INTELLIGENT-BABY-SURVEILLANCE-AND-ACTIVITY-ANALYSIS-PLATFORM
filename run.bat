@echo off
setlocal
title Guardian AI - System Startup

:: Check for Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b
)

echo ===================================================
echo   GUARDIAN AI - CHILD MONITORING SYSTEM
echo ===================================================
echo.

:menu
echo 1. Launch System (Dev Mode)
echo 2. Setup (Install all dependencies)
echo 3. Exit
echo.
set /p choice="Select an option (1-3): "

if "%choice%"=="1" goto launch
if "%choice%"=="2" goto setup
if "%choice%"=="3" exit /b
goto menu

:setup
echo.
echo [1/3] Installing root dependencies...
call npm install
echo [2/3] Installing client dependencies...
cd client
call npm install
cd ..
echo [3/3] Installing server dependencies...
cd server
call npm install
cd ..
echo.
echo Setup complete. Returning to menu...
echo.
goto menu

:launch
echo.
echo Starting Guardian AI (Client + Server)...
echo.
call npm run dev
pause
goto menu
