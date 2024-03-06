@echo off
set PORT=8000
start http://localhost:%PORT%
cd frontend && node ../backend/server.js %PORT% || pause
