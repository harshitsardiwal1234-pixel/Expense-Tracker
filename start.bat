@echo off
echo ========================================================
echo        STARTING EXPENSE TRACKER (CLEAN SETUP)
echo ========================================================

echo.
echo [1/3] Checking dependencies and building if necessary...
cd backend
if not exist "target\expense-tracker-0.0.1-SNAPSHOT.jar" (
    echo Compiling Java Backend Application...
    call ..\tools\apache-maven-3.9.6\bin\mvn.cmd clean package -DskipTests
)
cd ..

set "PATH=%CD%\tools\node-v20.12.2-win-x64;%PATH%"
cd frontend
if not exist "node_modules\" (
    echo Installing Node Modules...
    call npm install
)
cd ..

echo.
echo [2/3] Booting Backend API Server...
start "Expense Tracker Backend (Clean)" cmd /c "cd backend & java -jar target\expense-tracker-0.0.1-SNAPSHOT.jar"

echo Waiting for backend API to fully initialize...
timeout /t 5 /nobreak > nul

echo.
echo [3/3] Starting React Dev Server...
cd frontend
start "Expense Tracker Frontend (Clean)" cmd /c "npm run dev -- --open"
cd ..

echo.
echo ========================================================
echo    SUCCESS! Application is launching in your browser.
echo ========================================================
