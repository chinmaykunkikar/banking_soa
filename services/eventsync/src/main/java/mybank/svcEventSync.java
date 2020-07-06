package mybank;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.xml.ws.http.HTTPException;

import javax.ws.rs.core.Response;

import org.json.simple.JSONObject;
import org.json.simple.parser.*;

import jdatabase.*;
import jevent.*;

@Path("event")
public class svcEventSync {

	public String data;
	public dbsql db;
	public jeventClient eventclient;
	public String query;
	final int READ_QUERY = 0;
	final int WRITE_QUERY = 1;

	// dbsql 0:customer 1:accounts 2:money transfer 3:events
	public svcEventSync() {
		db = new dbsql(3);
		eventclient = new jeventClient("eventsync");
	}

	@POST
	@Path("/executequery")
	@Produces({ "application/json" })
	@Consumes({ "application/json" })
	public Response executequery(String data) {
		String jsonresult = "";

		try {
			data = data.replace("\n", "").replace("\\r", "").replace("\t", "");
			Object obj = new JSONParser().parse(data);
			JSONObject jo = (JSONObject) obj;

			// get the query and query type
			String query = (String) jo.get("query");
			int querytype = ((Long) jo.get("querytype")).intValue();

			jsonresult = db.executequery(query, querytype);

			System.out.println("svcEventSync executequery result: " + jsonresult);

		} catch (Exception e) {
			System.out.println("Returning Post2 failure -");
			System.out.println("[ {'error':'" + e.toString() + "'}]");
			return sendjsonresponse("[ {'error':'" + e.toString() + "'}]");
		}

		return sendjsonresponse(jsonresult);
	}

	public Response sendjsonresponse(String output) {
		try {
			data = output;
			return Response.status(200).entity(data).build();
		} catch (Exception e) {
			throw new HTTPException(400);
		}
	}

	/*
	 * The function will broadcast an incoming event or send it to a particular
	 * destination
	 */
	@POST
	@Path("/sync")
	@Produces({ "application/json" })
	@Consumes({ "application/json" })
	public void syncEvent(String event) {
		try {
			// first save the query in local database
			// eventclient.syncEvent(event, db); // save the event in dbEventSync
			// broadcastEvent(event);
		} catch (Exception e) {
			throw new HTTPException(400);
		}
	}

	public void broadcastEvent(String event) {
		System.out.println("Broadcasting event");
		// read the json event;
		// get all services uri from dbConfig file
		// check source destination
		// send to all destination except source

		String uri = "http://localhost:8082/mybank/account/syncevent";
		eventclient.broadcastEvent(event, uri);

		uri = "http://localhost:8081/mybank/customer/syncevent";
		eventclient.broadcastEvent(event, uri);

 		uri = "http://localhost:8083/mybank/moneytransfer/syncevent";
		eventclient.broadcastEvent(event, uri);
	}
}
