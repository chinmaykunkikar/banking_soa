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
echo - Installing mysql-connector-java-8.0.18.jar
echo:
call mvn install:install-file -Dfile=%working_dir%\mybankdatabase\mysql-connector-java-8.0.18.jar -DgroupId=mysql -DartifactId=mysql-connector-java -Dversion=8.0.18 -Dpackaging=jar -DgeneratePom=true >> run_jevent.log 2>&1
echo - Done

echo:
echo - Installing json-simple-1.1.1.jar
echo:
call mvn install:install-file -Dfile=%working_dir%\mybankdatabase\json-simple-1.1.1.jar -DgroupId=com.googlecode.json-simple -DartifactId=json-simple -Dversion=1.1.1 -Dpackaging=jar -DgeneratePom=true >> run_jevent.log 2>&1
echo - Done

echo:
echo - Installing jevent.jar
echo:
call mvn install:install-file -Dfile=%working_dir%\mybankeventclient\jevent.jar -DgroupId=myevent -DartifactId=jevent -Dversion=1.0 -Dpackaging=jar -DgeneratePom=true >> run_jevent.log 2>&1

echo ---------------------------------
echo - Testing jeventClient connection
echo ---------------------------------
call mvn exec:java
echo:
pause
