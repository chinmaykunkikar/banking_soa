package jdatabase;

import java.sql.*;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.*;

public class dbsql {
	final static int READ_QUERY = 0;
	final static int WRITE_QUERY = 1;

	static String databasename = "null";
	static String databaseusername = "null";
	static String databasepassword = "null";
	static String databasetestquery = "null";

	static serviceCommon cmn = new serviceCommon();

	public static void main(String args[]) {
		try {
			String data;

			initializedatabase(0); // default to dbCustomer
			String query = databasetestquery; // get databasequery from initializedatabase()

			System.out.println("Executing query: " + query);
			data = executequery(query, READ_QUERY);
			System.out.println("\nResult: " + data);
		} catch (Exception e) {
			System.out.println(e.toString());
		}
	}

	public dbsql(int databaseID) {
		initializedatabase(databaseID);
	}

	public static void initializedatabase(int databaseID) {

		try {
			String dbConfigFileName = "null";

			// databaseID = 0: dbCustomer, 1: dbAccount , 2: dbMoneyTransfer, 3: dbEventSync
			if (databaseID == 0)
				dbConfigFileName = ".\\dbconfig_customer.json";
			else if (databaseID == 1)
				dbConfigFileName = ".\\dbconfig_account.json";
			else if (databaseID == 2)
				dbConfigFileName = ".\\dbconfig_moneytransfer.json";
			else if (databaseID == 3)
				dbConfigFileName = ".\\dbconfig_eventsync.json";
			System.out.println("\nDatabase ID: " + databaseID + "; Config file: " + dbConfigFileName);

			databasename = cmn.getJSONStringValuefromFile(dbConfigFileName, "databasename");
			databaseusername = cmn.getJSONStringValuefromFile(dbConfigFileName, "databaseusername");
			databasepassword = cmn.getJSONStringValuefromFile(dbConfigFileName, "databasepassword");
			databasetestquery = cmn.getJSONStringValuefromFile(dbConfigFileName, "databasetestquery");

			// System.out.println("Initializing db - name: " + databasename + "; user: " + databaseusername + "; password: "
			// 		+ databasepassword);
			// System.out.println("Test query: " + databasetestquery);
		} catch (Exception e) {
			System.out.println("jdatabase error: " + e.toString());
		}
	}

	// querytype = 0 means SELECT query, querytype 1 means data manipulation query
	public static String executequery(String query, int querytype) {

		Statement stmt; // SELECT
		PreparedStatement preparedStmt; // UPDATE, DELETE, INSERT
		ResultSet rs;
		String sResult;

		sResult = "";
		boolean displayResult = true;
		String querydelimiter = ":::";

		try {
			System.out.println("Running query against - db: " + databasename + "; user:" + databaseusername
					+ "; password:" + databasepassword);

			Class.forName("com.mysql.cj.jdbc.Driver");
			Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/" + databasename,
					databaseusername, databasepassword);

			stmt = con.createStatement();

			if (querytype == READ_QUERY) {
				displayResult = false;
				rs = stmt.executeQuery(query);
				while (rs.next()) {
					sResult = rs.getString(1);
				}

			} else if (querytype == WRITE_QUERY) {
				System.out.println("Executing query type 1: " + query);
				String[] querylist = query.split(querydelimiter);
				String q = "";
				System.out.println("Total queries to execute: " + querylist.length);

				for (int i = 0; i < querylist.length; i++) {
					q = querylist[i]; // + ";"; //add the semi colon back for each query
					System.out.print("\nExecuting query: " + q);
					preparedStmt = con.prepareStatement(q);
					preparedStmt.execute();
				}
				sResult = "[{'success': 'WRITE_QUERY executed'}]";
			}
			con.close();

		} catch (Exception e) {
			sResult = "[{'error':'" + e.toString() + "'}]";
		}

		if (displayResult)
			System.out.println("Result: " + sResult);
		else
			System.out.println("Read successful!");
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
