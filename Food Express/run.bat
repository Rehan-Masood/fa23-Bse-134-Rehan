@echo off
setlocal enabledelayedexpansion
cd /d "d:\Food Express"

echo ========================================
echo Food Express Project Runner v2.0
echo ========================================
echo.

REM Check Node.js installation
echo Checking Node.js...
where node >nul 2>nul
if errorlevel 1 (
    echo Node.js not found in PATH
    echo Trying C:\Program Files\nodejs...
    set "PATH=C:\Program Files\nodejs;!PATH!"
)

node --version >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node.js not found!
    pause
    exit /b 1
)

echo Node.js found!
echo.

echo [1/4] Cleaning and Installing Frontend Dependencies...
cd frontend
if exist node_modules (
    echo Removing old node_modules...
    rmdir /s /q node_modules >nul 2>&1
)
echo Running npm install...
call npm install --prefer-offline
if errorlevel 1 (
    echo Failed to install frontend dependencies
    echo Check the error above
    pause
    exit /b 1
)

echo.
echo [2/4] Cleaning and Installing Backend Dependencies...
cd ..\backend
if exist node_modules (
    echo Removing old node_modules...
    rmdir /s /q node_modules >nul 2>&1
)
echo Running npm install...
call npm install --prefer-offline
if errorlevel 1 (
    echo Failed to install backend dependencies
    echo Check the error above
    pause
    exit /b 1
)

echo.
echo [3/4] Running Database Migrations and Seeding...
echo.
echo === Generating Prisma Client ===
call npx prisma generate
if errorlevel 1 (
    echo Failed to generate Prisma client
    echo Check the error above
    pause
    exit /b 1
)

echo === Running Migrations ===
call npx prisma migrate deploy
if errorlevel 1 (
    echo Migration deploy failed, attempting migrate dev...
    call npx prisma migrate dev --skip-generate
    if errorlevel 1 (
        echo Failed to run migrations
        echo Ensure PostgreSQL is running at 127.0.0.1:2305
        echo Check DATABASE_URL in .env file
        pause
        exit /b 1
    )
)

echo === Seeding Database ===
call npx prisma db seed
if errorlevel 1 (
    echo Warning: Database seeding failed (may already be seeded)
    echo Continuing startup...
)

echo.
echo ========================================
echo Database Ready - Dependencies Installed!
echo ========================================
echo.
echo [4/4] Starting Servers...
echo.
echo [Starting Backend on port 3002...]
start cmd /k "cd /d d:\Food Express\backend && npm run dev"

timeout /t 5 /nobreak

echo [Starting Frontend on port 3001...]
start cmd /k "cd /d d:\Food Express\frontend && npm run dev"

echo.
echo ========================================
echo Servers Starting...
echo ========================================
echo Frontend: http://localhost:3001
echo Backend:  http://localhost:3002
echo API Docs: http://localhost:3002/api/docs
echo.
echo Credentials:
echo Admin: admin@foodexpress.com / admin123
echo Customer: customer@example.com / password123
echo.
echo Windows will open new terminal windows for each server.
echo Press Ctrl+C in each terminal to stop servers.
pause
