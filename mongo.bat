@echo off
title mongo!
CD .\mongodb && call  mongod --dbpath="db"
call server.bat
pause
