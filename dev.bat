@echo off
start "server" cmd /k "cd server && npm run dev"
start "web" cmd /k "cd web && npm run dev"
