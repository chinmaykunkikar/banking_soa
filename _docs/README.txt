Necessary programs required
1. Maven (v3.6.3) - https://mirrors.estointernet.in/apache/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.zip

2. MySQL Installer (v8.0.21) - https://downloads.mysql.com/archives/get/p/25/file/mysql-installer-web-community-8.0.21.0.msi
After you install this installer, run it and install -
 2.1. MySQL Server v8.0.21
 2.2. MySQL Shell
Then set up the rest of it (admin user and passwords, etc) with the same wizard.

3. JRE and JDK v1.8 (I put it on my drive to make it easier) - https://drive.google.com/drive/folders/1gsVojoiKf4hwUSlVtKQz2sF7B2kxNcx2?usp=sharing

==========================================

Basics
1. Setup JDK, JRE, Maven, MySQL.
2. Extract bank_soa-v1.x in a folder of your choice. My path is E:\bank_soa, I will use it here for convenience.

Setting up databases from MySQL Workbench
3. Open MySQL Workbench and open the default connection
4. Once opened, File > Run SQL Script > Navigate to E:\bank_soa\database\sqlscripts > Select 'create_database_all.sql' > Click Run on the opened window. This will set up the necessary databases and their respective tables.

Changing path names and database credentials in E:\bank_soa to match it with your path
Go to E:\bank_soa

There are total 10 files you need to change paths (E:\\bank_soa), databaseusername ("chinmay") and databasepassword ("8087"):
1. database\dbconfig_customer.json
2. eventclient\dbconfig_eventclient.json
3. services\account\dbconfig_account.json
4. services\account\src\main\java\mybank\mainAccount.java
5. services\customer\dbconfig_customer.json
6. services\customer\src\main\java\mybank\mainCustomer.java
7. services\eventsync\dbconfig_eventsync.json
8. services\eventsync\src\main\java\mybank\mainEventSync.java
9. services\transactions\dbconfig_transactions.json
10. services\transactions\src\main\java\mybank\mainTransactions.java

Now we run the project
5. In E:\bank_soa > Run run_soaproject.bat > Press Y to compile jdatabase and jevent jar files > .bat file will compile jdatabase and jevent first and will open 4 new windows to start services. > They will eventually open 3 new Chrome tabs.