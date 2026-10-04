@echo off
title Lancement du projet React
color 0A

echo ============================================
echo      Lancement du projet React (Vite)
echo ============================================
echo.

REM --- Aller dans le dossier du projet (où se trouve le .bat) ---
cd /d %~dp0

echo Dossier du projet :
cd
echo.

REM --- Vérifier si package.json existe ---
IF NOT EXIST package.json (
    echo [ERREUR] Impossible de trouver package.json
    echo Le .bat doit etre place dans le dossier du projet.
    pause
    exit /b
)

REM --- Installer les dépendances si node_modules n'existe pas ---
IF NOT EXIST node_modules (
    echo Installation des dependances...
    npm install
)

echo.
echo Lancement du serveur Vite...
start "Vite Server" cmd /k "npm run dev"

echo Attente du serveur...
timeout /t 5 >nul

echo Ouverture du navigateur...
start "" "http://localhost:5173"

echo.
echo Serveur lance.
pause
exit /b
