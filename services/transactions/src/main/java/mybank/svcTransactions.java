package mybank;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.core.MediaType;
import javax.xml.ws.http.HTTPException;

import javax.ws.rs.core.Response;

import org.json.simple.JSONObject;
import org.json.simple.parser.*;

import jdatabase.*;
import jevent.*;

@Path("transactions")
public class svcTransactions {

	public String data;
	public dbsql db;
	public jeventClient eventclient;
	public String query;
	final public String serviceName = "transactions";

	public svcTransactions() {
		db = new dbsql(2);
		eventclient = new jeventClient(serviceName);
	}

	@POST
	@Path("/executequery")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response executequery(String data) {
		String jsonresult = "";

		try {
			data = data.replace("\n", "").replace("\\r", "").replace("\t", "");
			Object obj = new JSONParser().parse(data);
			JSONObject jo = (JSONObject) obj;

			// get the query and query type
			String query = (String) jo.get("query");

			jsonresult = db.executequery(query);

			// workaround to avoid milliseconds from the query result
			jsonresult = jsonresult.replace(".000000", "");

			System.out.println("svcTransactions executequery result: " + jsonresult);

			eventclient.sendEvent(data);

		} catch (Exception e) {
			System.out.println("Returning Post2 failure");
			System.out.println("[{'error':'" + e.toString() + "'}]");
			return sendjsonresponse("[{'error':'" + e.toString() + "'}]");
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

	// sync the event locally as received from event synchronizer
	@POST
	@Path("/syncevent")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public void syncEvent(String eventdata) {
		eventclient.syncEvent(eventdata, db);
	}
}
