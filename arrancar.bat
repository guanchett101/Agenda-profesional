@echo off
echo ========================================
echo   Agenda Profesional
echo ========================================
echo.
echo Arrancando Backend...
start "Backend - Puerto 8000" cmd /k "venv\Scripts\activate.bat && uvicorn backend:app --reload --host 0.0.0.0 --port 8000"

echo Esperando 3 segundos...
timeout /t 3 /nobreak >nul

echo Arrancando Frontend...
start "Frontend - Puerto 5173" cmd /k "cd frontend && npm run dev -- --host"

echo.
echo ========================================
echo   Agenda arrancada correctamente!
echo ========================================
echo.
echo Accede desde este PC: http://localhost:5173
echo.
echo Para ver tu IP y compartir en red:
echo   ipconfig
echo.
echo Luego las otras PCs acceden a: http://TU_IP:5173
echo.
pause
