title Run Service Oriented Computing Architecture
@echo off
cls
:start
set choice=
set /p choice=Compile jdatabase and jevent? [N]: 
if NOT '%choice%'=='' set choice=%choice:~0,1%
if '%choice%'=='Y' goto yes
if '%choice%'=='y' goto yes
if '%choice%'=='N' goto no
if '%choice%'=='n' goto no
if '%choice%'=='' goto no
echo "%choice%" is not valid
echo:
goto start

:yes
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
cd ..
timeout 20 > nul
goto no

:no
cd mybankjerseyservice\customer
start "customer service" cmd.exe /k "mvn clean compile exec:java"
cd ..\account
start "account service" cmd.exe /k "mvn clean compile exec:java"
cd ..\eventsync
start "eventsync service" cmd.exe /k "mvn clean compile exec:java"
