package jdatabase;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.*;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.FileWriter;

public class serviceCommon {
	public static void main(String[] args) throws IOException {
		System.out.println("Reading JSON");
		System.out.println("Website folder: " + getJSONStringValuefromFile(".\\dbconfig_customer.json", "websitefolder"));
	}

	public static String getJSONStringValuefromFile(String filename, String node) {
		String nodevalue = "";

		try (FileReader config = new FileReader(filename)) {
			Object obj = new JSONParser().parse(config);
			JSONObject jo = (JSONObject) obj;
			nodevalue = (String) jo.get(node);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return nodevalue;
	}
}