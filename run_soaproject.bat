title Run Service Oriented Computing Architecture
@echo off
cls

choice /t 4 /n /d N /m "Compile jdatabase and jevent? (Y/N) (Default: N)"
if %errorlevel% equ 1 goto yes
if %errorlevel% equ 2 goto no

:yes
cls
cd database
echo - Compiling jdatabase package
echo:
javac -cp "json-simple-1.1.1.jar";"mysql-connector-java-8.0.18.jar"; jdatabase\*.java > run_jdatabase.log 2>&1
echo - Done

echo:
echo - Making jdatabase.jar
echo:
jar cvf jdatabase.jar ./jdatabase/*.class json-simple-1.1.1.jar mysql-connector-java-8.0.18.jar >> run_jdatabase.log 2>&1
echo - Done

echo:
echo - Installing mysql-connector-java-8.0.18.jar
echo:
call mvn install:install-file -Dfile=.\mysql-connector-java-8.0.18.jar -DgroupId=mysql -DartifactId=mysql-connector-java -Dversion=8.0.18 -Dpackaging=jar -DgeneratePom=true >> run_jdatabase.log 2>&1
echo - Done

echo:
echo - Installing json-simple-1.1.1.jar
echo:
call mvn install:install-file -Dfile=.\json-simple-1.1.1.jar -DgroupId=com.googlecode.json-simple -DartifactId=json-simple -Dversion=1.1.1 -Dpackaging=jar -DgeneratePom=true >> run_jdatabase.log 2>&1
echo - Done

echo:
echo - Installing jdatabase.jar
echo:
call mvn install:install-file -Dfile=.\jdatabase.jar -DgroupId=mysql -DartifactId=jdatabase -Dversion=1.0 -Dpackaging=jar -DgeneratePom=true >> run_jdatabase.log 2>&1
echo - Done

echo:
echo ------------------------------
echo - Testing jdatabase connection
echo ------------------------------
timeout 2 > nul
echo:
java -cp "json-simple-1.1.1.jar";"mysql-connector-java-8.0.18.jar"; jdatabase.dbsql
echo - Done
echo:
cd ..

cd eventclient
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
call mvn install:install-file -Dfile=.\jevent.jar -DgroupId=myevent -DartifactId=jevent -Dversion=1.0 -Dpackaging=jar -DgeneratePom=true >> run_jevent.log 2>&1

echo ---------------------------------
echo - Testing jeventClient connection
echo ---------------------------------
call mvn exec:java
echo:
cd ..
goto no

:no
cd .\services\customer
start "customer service" cmd.exe /k "mvn clean compile exec:java"
cd ..\account
start "account service" cmd.exe /k "mvn clean compile exec:java"
cd ..\moneytransfer
start "moneytransfer service" cmd.exe /k "mvn clean compile exec:java"
cd ..\eventsync
start "eventsync service" cmd.exe /k "mvn clean compile exec:java"
