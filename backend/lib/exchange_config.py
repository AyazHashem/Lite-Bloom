EXCHANGES = [
    {
        "id": "NYSE",
        "name": "NYSE",
        "composite": "^GSPC",
        "composite_name": "S&P 500",
        "timezone": "America/New_York",
        "currency": "USD",
        "region": "United States",
        "top_stocks": [
            "AAPL", "MSFT", "NVDA", "AMZN", "GOOGL",
            "META", "TSLA", "JPM", "UNH", "V"
        ],
    },
    {
        "id": "LSE",
        "name": "LSE",
        "composite": "^FTSE",
        "composite_name": "FTSE 100",
        "timezone": "Europe/London",
        "currency": "GBP",
        "region": "United Kingdom",
        "top_stocks": [
            "SHEL.L", "AZN.L", "HSBA.L", "ULVR.L", "BP.L",
            "RIO.L", "GSK.L", "BATS.L", "VOD.L", "LLOY.L"
        ],
    },
    {
        "id": "TSE",
        "name": "TSE",
        "composite": "^N225",
        "composite_name": "Nikkei 225",
        "timezone": "Asia/Tokyo",
        "currency": "JPY",
        "region": "Japan",
        "top_stocks": [
            "7203.T", "6758.T", "9984.T", "8306.T", "7974.T",
            "6861.T", "4519.T", "8035.T", "9432.T", "6098.T"
        ],
    },
    {
        "id": "HKEX",
        "name": "HKEX",
        "composite": "^HSI",
        "composite_name": "Hang Seng",
        "timezone": "Asia/Hong_Kong",
        "currency": "HKD",
        "region": "Hong Kong",
        "top_stocks": [
            "0700.HK", "0939.HK", "1299.HK", "0005.HK", "0388.HK",
            "2318.HK", "1398.HK", "0941.HK", "2628.HK", "0883.HK"
        ],
    },
    {
        "id": "SGX",
        "name": "SGX",
        "composite": "^STI",
        "composite_name": "Straits Times",
        "timezone": "Asia/Singapore",
        "currency": "SGD",
        "region": "Singapore",
        "top_stocks": [
            "D05.SI", "O39.SI", "U11.SI", "Z74.SI", "C6L.SI",
            "Y92.SI", "BN4.SI", "V03.SI", "C52.SI", "A17U.SI"
        ],
    },
]

COMMODITY_SYMBOLS = [
    {"symbol": "GC=F",  "name": "Gold",        "type": "Metal",       "unit": "oz"},
    {"symbol": "SI=F",  "name": "Silver",      "type": "Metal",       "unit": "oz"},
    {"symbol": "CL=F",  "name": "WTI Crude",   "type": "Energy",      "unit": "bbl"},
    {"symbol": "BZ=F",  "name": "Brent Crude", "type": "Energy",      "unit": "bbl"},
    {"symbol": "NG=F",  "name": "Natural Gas", "type": "Energy",      "unit": "MMBtu"},
    {"symbol": "HG=F",  "name": "Copper",      "type": "Metal",       "unit": "lb"},
    {"symbol": "PL=F",  "name": "Platinum",    "type": "Metal",       "unit": "oz"},
    {"symbol": "PA=F",  "name": "Palladium",   "type": "Metal",       "unit": "oz"},
    {"symbol": "ZW=F",  "name": "Wheat",       "type": "Agriculture", "unit": "bu"},
    {"symbol": "ZC=F",  "name": "Corn",        "type": "Agriculture", "unit": "bu"},
    {"symbol": "ZS=F",  "name": "Soybeans",    "type": "Agriculture", "unit": "bu"},
    {"symbol": "KC=F",  "name": "Coffee",      "type": "Agriculture", "unit": "lb"},
]

CRYPTO_SYMBOLS = [
    {"symbol": "BTC-USD",  "name": "Bitcoin",  "short": "BTC"},
    {"symbol": "ETH-USD",  "name": "Ethereum", "short": "ETH"},
    {"symbol": "SOL-USD",  "name": "Solana",   "short": "SOL"},
    {"symbol": "XRP-USD",  "name": "XRP",      "short": "XRP"},
    {"symbol": "ADA-USD",  "name": "Cardano",  "short": "ADA"},
    {"symbol": "DOGE-USD", "name": "Dogecoin", "short": "DOGE"},
]