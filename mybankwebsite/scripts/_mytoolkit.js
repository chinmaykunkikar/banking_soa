let port = location.port
if (port == 8081) {
    document.getElementById("accountsBtn").disabled = true
    document.getElementById("moneytransferBtn").disabled = true;
    document.getElementById("portNo").textContent = "Port: " + port + " (Customer)";
} else if (port == 8082) {
    document.getElementById("customerBtn").disabled = true
    document.getElementById("moneytransferBtn").disabled = true;
    document.getElementById("portNo").textContent = "Port: " + port + " (Accounts)";
} else if (port == 8083) {
    document.getElementById("customerBtn").disabled = true
    document.getElementById("accountsBtn").disabled = true
    document.getElementById("portNo").textContent = "Port: " + port + " (Money Transfer)";
}