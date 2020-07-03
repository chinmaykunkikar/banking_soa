let port = location.port
if (port == 8081) {
    document.getElementById("accountsBtn").disabled = true
    document.getElementById("moneytransferBtn").disabled = true
    document.getElementById("portNo").textContent = "Port: " + port + " (Customer)"
    document.querySelector("title").textContent = "MyBank (Customer)"
} else if (port == 8082) {
    document.getElementById("customerBtn").disabled = true
    document.getElementById("moneytransferBtn").disabled = true
    document.getElementById("portNo").textContent = "Port: " + port + " (Accounts)"
    document.querySelector("title").textContent = "MyBank (Accounts)"
} else if (port == 8083) {
    document.getElementById("customerBtn").disabled = true
    document.getElementById("accountsBtn").disabled = true
    document.getElementById("portNo").textContent = "Port: " + port + " (Money Transfer)"
    document.querySelector("title").textContent = "MyBank (MoneyTransfer)"
}