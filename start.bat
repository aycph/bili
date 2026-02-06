@echo off
set PORT=8000
node server/dist/main.js %PORT% || pause
start http://localhost:%PORT%
