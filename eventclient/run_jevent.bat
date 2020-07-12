title jeventClient

:: Change your project dirictory here
set working_dir=E:\bank_soa

@echo off
cls
echo - Compiling jeventClient
echo:
call mvn clean compile > run_jevent.log 2>&1

echo - Making jevent.jar
cd .\target\classes
jar cvf jevent.jar jevent\*.class >> run_jevent.log 2>&1
cd ..\..
copy .\target\classes\jevent.jar >> run_jevent.log 2>&1

echo:
echo - Installing jevent.jar
echo:
call mvn install:install-file -Dfile=%working_dir%\eventclient\jevent.jar -DgroupId=myevent -DartifactId=jevent -Dversion=1.0 -Dpackaging=jar -DgeneratePom=true >> run_jevent.log 2>&1

echo ---------------------------------
echo - Testing jeventClient connection
echo ---------------------------------
call mvn exec:java
echo:
pause
