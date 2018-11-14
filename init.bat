@echo off
title talktive app!
start /min cmd /c mongo.bat
start /min cmd /c server.bat
CD .\app & call  npm start
pause
