@echo off
echo ========================================
echo   Stop All Services
echo ========================================
echo.

echo Stopping all Node.js processes...
taskkill /f /im node.exe 2>nul
if %errorlevel% equ 0 (
    echo [OK] All Node.js processes stopped
) else (
    echo [INFO] No running Node.js processes found
)

echo.
echo All services stopped.
pause
