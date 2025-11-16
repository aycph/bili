@echo off
set PORT=8000
start http://localhost:%PORT%
cd frontend && node ../backend/main.js %PORT% || pause
