package mybank;

import java.util.regex.*;
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

@Path("account")
public class svcAccount {

	public String data;
	public dbsql db;
	public String event;
	public jeventClient eventclient;
	public String query;
	// final public String regex = "(INSERT
	// INTO\\s+)(\\w+)(\\s+\\()([\\w+,?\\s*]+)(\\)\\s+VALUES\\s+\\()(['?\\w+'?,?\\s*]+)(\\))";
	final public String regex = "[^\\d]*(\\d+)[^\\d]*(\\d+)[^\\d]*(\\d+)[^\\d]*";
	final public String serviceName = "account";

	public svcAccount() {
		db = new dbsql(1);
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

			System.out.println("svcAccount executequery result: " + jsonresult);

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

		try {
			String newquery = "";
			String jsonresult = "";
			int fromId = 0;
			int toId = 0;
			int transferAmount = 0;

			eventdata = eventdata.replace("\n", "").replace("\\r", "").replace("\t", "");
			Object obj = new JSONParser().parse(eventdata);
			JSONObject jo = (JSONObject) obj;
			String query = (String) jo.get("query");
			String eventsource = (String) jo.get("source");

			if (eventsource.equals("transactions")) {
				Pattern re = Pattern.compile(regex);
				Matcher matcher = re.matcher(query);
				while (matcher.find()) {
					fromId = Integer.parseInt(matcher.group(1));
					toId = Integer.parseInt(matcher.group(2));
					transferAmount = Integer.parseInt(matcher.group(3));
				}
			} else {
				System.out.println("\nBad event. Source: " + eventsource + "");
			}
			if (fromId != 0 || toId != 0) {
				// call a stored procedure 'new_transaction'
				newquery = "{call new_transaction('" + fromId + "','" + toId + "','" + transferAmount + "')}";
				jsonresult = db.executequery(newquery);
				System.out.println("svcAccount executequery result: " + jsonresult);
			}

		} catch (Exception e) {
			System.out.println("Returning Post2 failure");
			System.out.println("[{'error':'" + e.toString() + "'}]");
		}
	}
}
