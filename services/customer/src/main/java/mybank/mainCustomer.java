package mybank;

import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.grizzly.http.server.StaticHttpHandler;

import java.io.IOException;
import java.net.URI;

public class mainCustomer {
    public static final String BASE_URI = "http://localhost:8081/mybank/";

    public static HttpServer startServer() {
        final ResourceConfig rc = new ResourceConfig().packages("mybank");
        return GrizzlyHttpServerFactory.createHttpServer(URI.create(BASE_URI), rc);

    }

    public static void main(String[] args) throws IOException {
        final HttpServer server = startServer();

        server.getServerConfiguration().addHttpHandler(new StaticHttpHandler("E:\\bank_soa\\website\\"), "/");
        System.out.println(String.format(
                "Jersey app started with WADL available at " + "%sapplication.wadl\nHit enter to stop it...",
                BASE_URI));

        // Open the URI in Chrome (Windows)
        Runtime rt = Runtime.getRuntime();
        rt.exec("rundll32 url.dll,FileProtocolHandler " + "http://localhost:8081/customer.html");

        System.in.read();
        server.shutdownNow();
    }
}
