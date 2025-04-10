let signer;

document.getElementById("connectButton").addEventListener("click", async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length === 0) {
        alert("No accounts found. Please unlock MetaMask.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      const address = await signer.getAddress();

      document.getElementById("walletAddress").innerText = "Wallet Address: " + address;
      document.getElementById("sendTransactionButton").disabled = false;
      getBalance();
      setInterval(getBalance, 10000);
    } catch (error) {
      alert("MetaMask connection failed: " + error.message);
    }
  } else {
    alert("Please install MetaMask.");
    window.open("https://metamask.io/download/", "_blank");
  }
});

async function getBalance() {
  if (signer) {
    try {
      const balance = await signer.getBalance();
      document.getElementById("walletBalance").innerText =
        "Balance: " + ethers.utils.formatEther(balance) + " ETH";
    } catch {
      document.getElementById("walletBalance").innerText =
        "Balance: Error fetching balance!";
    }
  }
}

document.getElementById("sendTransactionButton").addEventListener("click", async () => {
  if (!signer) {
    alert("Connect MetaMask first!");
    return;
  }

  const recipient = prompt("Recipient Address:");
  const amount = prompt("Amount in ETH:");

  if (!recipient || !ethers.utils.isAddress(recipient)) {
    alert("Invalid address!");
    return;
  }

  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    alert("Invalid amount!");
    return;
  }

  try {
    const tx = await signer.sendTransaction({
      to: recipient,
      value: ethers.utils.parseEther(amount)
    });
    alert("Transaction Sent! Hash: " + tx.hash);
  } catch (error) {
    alert("Transaction failed: " + error.message);
  }
});
