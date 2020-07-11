package jdatabase;

import java.sql.*;

public class dbsql {
	private static String databasename = "null";
	private static String databaseusername = "null";
	private static String databasepassword = "null";
	private static String databasetestquery = "null";

	private static serviceCommon cmn = new serviceCommon();

	public static void main(String[] args) {
		try {
			String data;

			initializedatabase(0); // default to dbCustomer
			String query = databasetestquery; // get databasequery from initializedatabase()

			System.out.println("Executing query: " + query);
			data = executequery(query);
			System.out.println("\nResult: " + data);
		} catch (Exception e) {
			System.out.println(e.toString());
		}
	}

	public dbsql(final int databaseID) {
		initializedatabase(databaseID);
	}

	public static void initializedatabase(final int databaseID) {

		try {
			String dbConfigFileName = "null";

			// databaseID = 0: dbCustomer, 1: dbAccount , 2: dbTransactions, 3: dbEventSync
			if (databaseID == 0)
				dbConfigFileName = ".\\dbconfig_customer.json";
			else if (databaseID == 1)
				dbConfigFileName = ".\\dbconfig_account.json";
			else if (databaseID == 2)
				dbConfigFileName = ".\\dbconfig_transactions.json";
			else if (databaseID == 3)
				dbConfigFileName = ".\\dbconfig_eventsync.json";
			System.out.println("\nDatabase ID: " + databaseID + "; Config file: " + dbConfigFileName);

			databasename = cmn.getJsonStringValue(dbConfigFileName, "databasename");
			databaseusername = cmn.getJsonStringValue(dbConfigFileName, "databaseusername");
			databasepassword = cmn.getJsonStringValue(dbConfigFileName, "databasepassword");
			databasetestquery = cmn.getJsonStringValue(dbConfigFileName, "databasetestquery");
		} catch (Exception e) {
			System.out.println("jdatabase error: " + e.toString());
		}
	}

	public static String executequery(final String query) {

		Statement stmt; // SELECT, UPDATE, DELETE, INSERT
		String sResult = "";

		try {
			System.out.println("\nRunning query against - db: " + databasename + "; user:" + databaseusername
					+ "; password:" + databasepassword + "\n");

			Class.forName("com.mysql.cj.jdbc.Driver");
			Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/" + databasename,
					databaseusername, databasepassword);

			stmt = con.createStatement();
			boolean results = stmt.execute(query);
			int count = 0;
			do {
				if (results) {
					ResultSet rs = stmt.getResultSet();
					while (rs.next()) {
						sResult = rs.getString(1);
					}
				} else {
					count = stmt.getUpdateCount();
					if (count >= 0) {
						sResult = "[{'success': 'WRITE_QUERY executed'}]";
					}
				}
				results = stmt.getMoreResults();
			} while (results || count != -1);
			stmt.close();
			con.close();

		} catch (Exception e) {
			sResult = e.toString();
		}
		return sResult;
	}
}

/*
 * Compile: E:\bank_soa\database>javac -cp "mysql-connector-java-8.0.18.jar"; webservice\database\dbsql.java
 * E:\bank_soa\database>javac -cp "json-simple-1.1.1.jar";"mysql-connector-java-8.0.18.jar"; jdatabase\*.java
 *
 * Run: java -cp "json-simple-1.1.1.jar";"mysql-connector-java-8.0.18.jar"; jdatabase.dbsql
 *
 * Create jar: jar cvf jdatabase.jar ./jdatabase/*.class json-simple-1.1.1.jar mysql-connector-java-8.0.18.jar
 *
 */
