@echo off
setlocal
cd /d "d:\Food Express"

REM Set PATH to include Node.js
set "PATH=C:\Program Files\nodejs;%PATH%"

echo ========================================
echo Food Express - Installation & Setup
echo ========================================
echo.

REM Frontend
echo [Step 1/4] Installing Frontend Dependencies...
echo.
cd frontend
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ERROR: Frontend installation failed
    pause
    exit /b 1
)

REM Backend
echo.
echo [Step 2/4] Installing Backend Dependencies...
echo.
cd ..\backend
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ERROR: Backend installation failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Frontend ready at: d:\Food Express\frontend
echo Backend ready at:  d:\Food Express\backend
echo.
echo NEXT STEPS:
echo ===========
echo.
echo 1. Open TWO NEW COMMAND WINDOWS
echo.
echo 2. In FIRST WINDOW (Frontend):
echo    cd "d:\Food Express\frontend"
echo    npm run dev
echo    Then open: http://localhost:3000
echo.
echo 3. In SECOND WINDOW (Backend):
echo    cd "d:\Food Express\backend"
echo    npm run dev
echo    Server runs on: http://localhost:3001
echo.
echo Test Credentials:
echo ================
echo Customer: customer@example.com / password123
echo Admin:    admin@example.com / password123
echo.
pause
