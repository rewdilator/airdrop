// config/networks.js
var NETWORK_CONFIGS = {
  bsc: {
    chainId: "0x38",
    chainName: "Binance Smart Chain",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com"],
    scanUrl: "https://bscscan.com/tx/"
  },
  polygon: {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com"],
    scanUrl: "https://polygonscan.com/tx/"
  }
};
