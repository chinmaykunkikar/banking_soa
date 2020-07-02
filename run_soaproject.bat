title Run Service Oriented Computing Architecture
@echo off
cls

choice /t 5 /n /d N /m "Compile jdatabase and jevent?"
if %errorlevel% equ 1 goto yes
if %errorlevel% equ 2 goto no

:yes
echo - Compiling jdatabase
timeout 2 /nobreak > nul

cd mybankdatabase
start "Compile jdatabase common object" cmd.exe /c "run_jdatabase"
cd ..
timeout 15 /nobreak > nul

echo:
echo - Compiling jevent
cd mybankeventclient
start "Compile jeventClient common object" cmd.exe /c "run_jevent"
cd ..
timeout 20 /nobreak > nul
goto no

:no
cd mybankjerseyservice\customer
start "customer service" cmd.exe /k "mvn clean compile exec:java"
cd ..\account
start "account service" cmd.exe /k "mvn clean compile exec:java"
cd ..\eventsync
start "eventsync service" cmd.exe /k "mvn clean compile exec:java"
