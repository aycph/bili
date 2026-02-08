@echo off
set PORT=8000
start http://localhost:%PORT%
node server/dist/main.js %PORT% || pause
