title Run Service Oriented Computing Architecture
@echo off
cls

echo - Compiling jdatabase
timeout 2 > nul

cd mybankdatabase
start "Compile jdatabase common object" cmd.exe /c "run_jdatabase"
cd ..
timeout 15 > nul

echo:
echo - Compiling jevent
cd mybankeventclient
start "Compile jeventClient common object" cmd.exe /c "run_jevent"

timeout 20 > nul
cd ..\mybankjerseyservice\customer
start "customer service" cmd.exe /k "mvn clean compile exec:java"
cd ..\account
start "account service" cmd.exe /k "mvn clean compile exec:java"
cd ..\eventsync
start "eventsync service" cmd.exe /k "mvn clean compile exec:java"
