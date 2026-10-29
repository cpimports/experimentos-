@echo off
title Servidor Local - Experimentos Infantis
echo ========================================================
echo   Iniciando Servidor Local - Experimentos Infantis
echo ========================================================
echo.
echo Abrindo o site no seu navegador...
start http://127.0.0.1:3000
echo.
echo Servidor em execucao. Mantenha esta janela aberta enquanto navega.
echo.
node server.js
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Nao foi possivel iniciar via Node.js.
  echo Abrindo index.html diretamente no navegador...
  start index.html
)
pause
