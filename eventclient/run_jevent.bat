title jeventClient

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
call mvn install:install-file -Dfile=.\jevent.jar -DgroupId=mybank -DartifactId=jevent -Dversion=2.0 -Dpackaging=jar >> run_jevent.log 2>&1

echo ---------------------------------
echo - Testing jeventClient connection
echo ---------------------------------
call mvn exec:java
echo:
pause
