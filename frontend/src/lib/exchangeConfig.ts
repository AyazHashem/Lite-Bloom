export interface ExchangeConfig {
    id: string
    name: string
    composite: string
    compositeName: string
    timezone: string
    openTime: string
    closeTime: string
    currency: string
    region: string
    topStocks: string[]
}

export const EXCHANGES: ExchangeConfig[] = [
    {
        id: 'NYSE',
        name: 'NYSE',
        composite: '^GSPC',
        compositeName: 'S&P 500',
        timezone: 'America/New_York',
        openTime: '09:30',
        closeTime: '16:00',
        currency: 'USD',
        region: 'United States',
        topStocks: [
        'AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'META', 'TSLA', 'BRK-B', 'JPM', 'UNH'
        ],
    },
    {
        id: 'LSE',
        name: 'LSE',
        composite: '^FTSE',
        compositeName: 'FTSE 100',
        timezone: 'Europe/London',
        openTime: '08:00',
        closeTime: '16:30',
        currency: 'GBP',
        region: 'United Kingdom',
        topStocks: [
        'SHEL.L', 'AZN.L', 'HSBA.L', 'ULVR.L', 'BP.L', 'RIO.L', 'GSK.L', 'BATS.L', 'VOD.L', 'LLOY.L'
        ],
    },
    {
        id: 'TSE',
        name: 'TSE',
        composite: '^N225',
        compositeName: 'Nikkei 225',
        timezone: 'Asia/Tokyo',
        openTime: '09:00',
        closeTime: '15:30',
        currency: 'JPY',
        region: 'Japan',
        topStocks: [
        '7203.T', '6758.T', '9984.T', '8306.T', '7974.T', '6861.T', '4519.T', '8035.T', '9432.T', '6098.T'
        ],
    },
    {
        id: 'HKEX',
        name: 'HKEX',
        composite: '^HSI',
        compositeName: 'Hang Seng',
        timezone: 'Asia/Hong_Kong',
        openTime: '09:30',
        closeTime: '16:00',
        currency: 'HKD',
        region: 'Hong Kong',
        topStocks: [
        '0700.HK', '0939.HK', '1299.HK', '0005.HK', '0388.HK', '2318.HK', '1398.HK', '0941.HK', '2628.HK', '0883.HK'
        ],
    },
    {
        id: 'SGX',
        name: 'SGX',
        composite: '^STI',
        compositeName: 'Straits Times',
        timezone: 'Asia/Singapore',
        openTime: '09:00',
        closeTime: '17:00',
        currency: 'SGD',
        region: 'Singapore',
        topStocks: [
        'D05.SI', 'O39.SI', 'U11.SI', 'Z74.SI', 'C6L.SI', 'Y92.SI', 'BN4.SI', 'V03.SI', 'C52.SI', 'A17U.SI'
        ],
    },
]

export const COMMODITY_SYMBOLS = [
    { symbol: 'GC=F', name: 'Gold', type: 'Metal', unit: 'oz' },
    { symbol: 'SI=F', name: 'Silver', type: 'Metal', unit: 'oz' },
    { symbol: 'CL=F', name: 'WTI Crude', type: 'Energy', unit: 'bbl'},
    { symbol: 'BZ=F', name: 'Brent Crude', type: 'Energy', unit: 'bbl' },
    { symbol: 'NG=F', name: 'Natural Gas', type: 'Energy', unit: 'MMBtu' },
    { symbol: 'HG=F', name: 'Copper', type: 'Metal', unit: 'lb' },
    { symbol: 'PL=F', name: 'Platinum', type: 'Metal', unit: 'oz' },
    { symbol: 'PA=F', name: 'Palladium', type: 'Metal', unit: 'oz' },
    { symbol: 'ZW=F', name: 'Wheat', type: 'Agriculture', unit: 'bu'},
    { symbol: 'ZC=F', name: 'Corn', type: 'Agriculture', unit: 'bu'},
    { symbol: 'ZS=F', name: 'Soybeans', type: 'Agriculture', unit: 'bu' },
    { symbol: 'KC=F', name: 'Coffee', type: 'Agriculture', unit: 'lb' },
]

export const CRYPTO_SYMBOLS = [
    { symbol: 'BTC-USD', name: 'Bitcoin', short: 'BTC' },
    { symbol: 'ETH-USD', name: 'Ethereum', short: 'ETH' },
    { symbol: 'SOL-USD', name: 'Solana', short: 'SOL' },
    { symbol: 'XRP-USD', name: 'XRP', short: 'XRP' },
    { symbol: 'ADA-USD', name: 'Cardano', short: 'ADA' },
    { symbol: 'DOGE-USD', name: 'Dogecoin', short: 'DOGE' },
]

export const FOREX_PAIRS = [
    { from: 'USD', to: 'EUR', name: 'EUR/USD' },
    { from: 'USD', to: 'GBP', name: 'GBP/USD' },
    { from: 'USD', to: 'JPY', name: 'USD/JPY' },
    { from: 'USD', to: 'CHF', name: 'USD/CHF' },
    { from: 'USD', to: 'AUD', name: 'AUD/USD' },
    { from: 'USD', to: 'CAD', name: 'USD/CAD' },
    { from: 'USD', to: 'HKD', name: 'USD/HKD' },
    { from: 'USD', to: 'SGD', name: 'USD/SGD' },
    { from: 'USD', to: 'AED', name: 'USD/AED' },
    { from: 'USD', to: 'SAR', name: 'USD/SAR' },
]