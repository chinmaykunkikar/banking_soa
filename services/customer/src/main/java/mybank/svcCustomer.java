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

@Path("customer")
public class svcCustomer {

	public String data;
	public dbsql db;
	public String query;
	public jeventClient eventclient;
	final public String serviceName = "customer";

	public svcCustomer() {
		db = new dbsql(0);
		eventclient = new jeventClient(serviceName);
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

			jsonresult = db.executequery(query);

			System.out.println("svcCustomer executequery result: " + jsonresult);

			// at present we are just forwarding the query as it is received
			// we may have to create a standard json data for events which contains source,
			// destination
			eventclient.sendEvent(data);

		} catch (Exception e) {
			System.out.println("Returning Post2 failure");
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

	// sync the event locally as received from event synchronizer
	@POST
	@Path("/syncevent")
	@Produces({ "application/json" })
	@Consumes({ "application/json" })
	public void syncEvent(String eventdata) {
		eventclient.syncEvent(eventdata, db);
	}

}
