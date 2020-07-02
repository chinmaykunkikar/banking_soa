@echo off

:: Set the existing directory and new directory here
set existing_dir=
set new_dir=

if not defined existing_dir (echo Variable "existing_dir" not defined. Exiting... & timeout 3 /nobreak > nul & exit /b)
if not defined new_dir (echo Variable "new_dir" not defined. Exiting... & timeout 3 /nobreak > nul & exit /b)

set list=.\mybankdatabase\dbconfig_account.json
set list=%list%;.\mybankdatabase\dbconfig_customer.json
set list=%list%;.\mybankdatabase\run_jdatabase.bat
set list=%list%;.\mybankdatabase\jdatabase\dbsql.java
set list=%list%;.\mybankeventclient\dbconfig_eventclient.json
set list=%list%;.\mybankeventclient\run_jevent.bat
set list=%list%;.\mybankjerseyservice\account\dbconfig_account.json
set list=%list%;.\mybankjerseyservice\account\src\main\java\mybank\mainAccount.java
set list=%list%;.\mybankjerseyservice\customer\dbconfig_customer.json
set list=%list%;.\mybankjerseyservice\customer\src\main\java\mybank\mainCustomer.java
set list=%list%;.\mybankjerseyservice\eventsync\dbconfig_eventsync.json
set list=%list%;.\mybankjerseyservice\eventsync\src\main\java\mybank\mainEventSync.java
set list=%list%;.\others\testrestclient\mybankeventservice\dbconfig_customer.json
set list=%list%;.\others\testrestclient\mybankeventservice\src\main\java\mybank\mainEventService.java

echo Replacing %existing_dir% with %new_dir%
for %%i in (%list%) do (
 sed -i -e 's/%existing_dir%/%new_dir%/g' %%i
)

echo:
echo Done. Press any key to exit.
pause > nul