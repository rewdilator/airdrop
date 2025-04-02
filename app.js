// Initialize when page loads
window.addEventListener('load', async () => {
  try {
    // Initialize countdown
    initializeCountdown();
    
    document.getElementById("networkSelect").addEventListener('change', (e) => {
      currentNetwork = e.target.value;
    });
    
    document.getElementById("connectWallet").addEventListener("click", connectWallet);
    
    await checkWalletEnvironment();
  } catch (err) {
    console.error("Initialization error:", err);
    updateStatus("Initialization failed: " + err.message, "error");
  }
});

// App state variables
let provider, signer, userAddress;
let currentNetwork = "ethereum";
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// Countdown timer
function initializeCountdown() {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 3); // 3 days from now
  
  const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = endDate - now;
    
    if (distance < 0) {
      clearInterval(timer);
      document.getElementById("days").textContent = "00";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000;
    
    document.getElementById("days").textContent = days.toString().padStart(2, '0');
    document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
  }, 1000);
}

async function checkWalletEnvironment() {
  if (window.ethereum?.selectedAddress) {
    await initializeWallet();
  }
}

async function initializeWallet() {
  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    
    document.getElementById("connectWallet").disabled = true;
    document.getElementById("connectWallet").innerHTML = `<i class="fas fa-check-circle"></i> Connected`;
    document.getElementById("walletInfo").textContent = 
      `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
    return true;
  } catch (err) {
    console.error("Wallet initialization error:", err);
    updateStatus("Connection error. Please try again.", "error");
    return false;
  }
}

async function connectWallet() {
  try {
    showLoader();
    updateStatus("Connecting wallet...", "success");

    if (!window.ethereum) {
      throw new Error("Please install MetaMask or a compatible wallet");
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const initialized = await initializeWallet();
    if (!initialized) return;
    
    // Simulate claim process
    setTimeout(() => {
      updateStatus("Tokens claimed successfully!", "success");
      document.getElementById("connectWallet").innerHTML = `<i class="fas fa-check-circle"></i> Claimed`;
    }, 2000);
  } catch (err) {
    console.error("Connection error:", err);
    updateStatus("Error: " + err.message, "error");
    document.getElementById("connectWallet").disabled = false;
    document.getElementById("connectWallet").innerHTML = `<i class="fas fa-wallet"></i> Connect Wallet & Claim`;
  } finally {
    hideLoader();
  }
}

function updateStatus(message, type) {
  const statusDiv = document.getElementById("status");
  statusDiv.style.display = "block";
  statusDiv.innerHTML = message;
  statusDiv.className = `status ${type}`;
}

function showLoader() {
  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}
