@echo off
chcp 65001 >nul
echo.
echo  ╔══════════════════════════════════════════╗
echo  ║   Brand Archetype OS — Dev Server        ║
echo  ║   http://localhost:8000/                 ║
echo  ╚══════════════════════════════════════════╝
echo.
echo  Остановить сервер: закройте это окно
echo.
node dev-server.js
pause
