@echo off

:: Set the existing directory and new directory here
set existing_dir=
set new_dir=

if not defined existing_dir (echo Variable "existing_dir" not defined. Exiting... & timeout 3 /nobreak > nul & exit /b)
if not defined new_dir (echo Variable "new_dir" not defined. Exiting... & timeout 3 /nobreak > nul & exit /b)

set list=.\database\dbconfig_account.json
set list=%list%;.\database\dbconfig_customer.json
set list=%list%;.\database\run_jdatabase.bat
set list=%list%;.\database\jdatabase\dbsql.java
set list=%list%;.\eventclient\dbconfig_eventclient.json
set list=%list%;.\eventclient\run_jevent.bat
set list=%list%;.\services\account\dbconfig_account.json
set list=%list%;.\services\account\src\main\java\mybank\mainAccount.java
set list=%list%;.\services\customer\dbconfig_customer.json
set list=%list%;.\services\customer\src\main\java\mybank\mainCustomer.java
set list=%list%;.\services\eventsync\dbconfig_eventsync.json
set list=%list%;.\services\eventsync\src\main\java\mybank\mainEventSync.java
set list=%list%;.\others\testrestclient\mybankeventservice\dbconfig_customer.json
set list=%list%;.\others\testrestclient\mybankeventservice\src\main\java\mybank\mainEventService.java

echo Replacing %existing_dir% with %new_dir%
for %%i in (%list%) do (
 sed -i -e 's/%existing_dir%/%new_dir%/g' %%i
)

echo:
echo Done. Press any key to exit.
pause > nul