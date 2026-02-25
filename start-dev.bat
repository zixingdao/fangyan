@echo off
echo ========================================
echo   Changsha Dialect - Dev Server
echo ========================================
echo.

echo [1/3] Starting Backend (NestJS) - Port 3000
start "Backend-NestJS" cmd /k "cd /d %~dp0apps\server && npx ts-node src/main.ts"

ping 127.0.0.1 -n 6 >nul

echo [2/3] Starting Client (React) - Port 5173
start "Client-React" cmd /k "cd /d %~dp0apps\client && pnpm dev"

echo [3/3] Starting Admin (React) - Port 5174
start "Admin-React" cmd /k "cd /d %~dp0apps\admin && pnpm dev"

echo.
echo ========================================
echo   All services started!
echo ========================================
echo.
echo   Backend API:  http://localhost:3000
echo   API Docs:     http://localhost:3000/docs
echo   Client:       http://localhost:5173
echo   Admin:        http://localhost:5174
echo.
echo   Press any key to open client...
pause >nul

start http://localhost:5173
