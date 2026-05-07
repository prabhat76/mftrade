import {
  MutualFund, FundDetail, GoldPrice, GoldEtf,
  Holding, PortfolioSummary, Transaction, WatchlistItem,
  User, MarketStatus, NseIndex, NavHistory
} from '../models';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const navHistory = (base: number, days = 30): NavHistory[] =>
  Array.from({ length: days }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (days - i));
    return {
      date: d.toISOString().split('T')[0],
      nav: +(base + (Math.random() - 0.48) * base * 0.02 * i).toFixed(4),
    };
  });

// ─── User ─────────────────────────────────────────────────────────────────────
export const MOCK_USER: User = {
  id: 'usr_001',
  name: 'Prabhat Kumar',
  email: 'prabhat@example.com',
  mobile: '9876543210',
  panNumber: 'ABCDE1234F',
  kycStatus: 'VERIFIED',
  riskProfile: 'MODERATE',
  createdAt: '2024-01-15T10:00:00Z',
};

// ─── Market Status ────────────────────────────────────────────────────────────
export const MOCK_MARKET_STATUS: MarketStatus = {
  market: 'Capital Market',
  marketStatus: 'Open',
  tradeDate: new Date().toDateString(),
  index: 'NIFTY 50',
  last: 24523.15,
  variation: 123.45,
  percentChange: 0.51,
  marketStatusMessage: 'Market is Open',
};

export const MOCK_NSE_INDICES: NseIndex[] = [
  {
    key: 'NIFTY 50', index: 'NIFTY 50', indexSymbol: 'NIFTY',
    last: 24523.15, variation: 123.45, percentChange: 0.51,
    open: 24400, high: 24600, low: 24350, previousClose: 24399.70,
    yearHigh: 26277.35, yearLow: 21964.60,
    indicativeClose: 24523.15, pe: 22.5, pb: 3.8, dy: 1.2,
    declines: 18, advances: 32, unchanged: 0,
  },
  {
    key: 'NIFTY NEXT 50', index: 'NIFTY NEXT 50', indexSymbol: 'NIFTYJR',
    last: 71234.50, variation: -234.10, percentChange: -0.33,
    open: 71468.60, high: 71500, low: 71100, previousClose: 71468.60,
    yearHigh: 73737.85, yearLow: 56812.90,
    indicativeClose: 71234.50, pe: 28.1, pb: 4.2, dy: 0.9,
    declines: 28, advances: 22, unchanged: 0,
  },
];

// ─── Mutual Funds ─────────────────────────────────────────────────────────────
export const MOCK_FUNDS: MutualFund[] = [
  {
    schemeCode: 120503,
    schemeName: 'Mirae Asset Large Cap Fund - Regular Plan - Growth',
    fundHouse: 'Mirae Asset Mutual Fund',
    schemeType: 'Open Ended Schemes',
    schemeCategory: 'Equity Scheme - Large Cap Fund',
    schemeNavName: 'Mirae Asset Large Cap Fund Regular Growth',
    isinGrowth: 'INF769K01010',
    isinDivReinvestment: 'INF769K01028',
  },
  {
    schemeCode: 118989,
    schemeName: 'Axis Bluechip Fund - Regular Plan - Growth',
    fundHouse: 'Axis Mutual Fund',
    schemeType: 'Open Ended Schemes',
    schemeCategory: 'Equity Scheme - Large Cap Fund',
    schemeNavName: 'Axis Bluechip Fund Regular Growth',
    isinGrowth: 'INF846K01131',
    isinDivReinvestment: 'INF846K01149',
  },
  {
    schemeCode: 100356,
    schemeName: 'SBI Small Cap Fund - Regular Plan - Growth',
    fundHouse: 'SBI Mutual Fund',
    schemeType: 'Open Ended Schemes',
    schemeCategory: 'Equity Scheme - Small Cap Fund',
    schemeNavName: 'SBI Small Cap Fund Regular Growth',
    isinGrowth: 'INF200K01RD0',
    isinDivReinvestment: 'INF200K01RE8',
  },
  {
    schemeCode: 119598,
    schemeName: 'Parag Parikh Flexi Cap Fund - Regular Plan - Growth',
    fundHouse: 'PPFAS Mutual Fund',
    schemeType: 'Open Ended Schemes',
    schemeCategory: 'Equity Scheme - Flexi Cap Fund',
    schemeNavName: 'Parag Parikh Flexi Cap Fund Regular Growth',
    isinGrowth: 'INF879O01019',
    isinDivReinvestment: 'INF879O01027',
  },
  {
    schemeCode: 101206,
    schemeName: 'HDFC Gold Fund - Regular Plan - Growth',
    fundHouse: 'HDFC Mutual Fund',
    schemeType: 'Open Ended Schemes',
    schemeCategory: 'Other Scheme - Gold ETF FoF',
    schemeNavName: 'HDFC Gold Fund Regular Growth',
    isinGrowth: 'INF179K01BB4',
    isinDivReinvestment: 'INF179K01BC2',
  },
];

export const MOCK_FUND_DETAILS: Record<number, FundDetail> = {
  120503: {
    ...MOCK_FUNDS[0],
    currentNav: 98.45,
    previousNav: 97.82,
    navChange: 0.63,
    navChangePercent: 0.64,
    aum: 35420,
    expenseRatio: 1.58,
    exitLoad: '1% if redeemed within 1 year',
    minSipAmount: 1000,
    minLumpsum: 5000,
    navHistory: navHistory(98.45),
    returns: { oneMonth: 2.1, threeMonth: 5.4, sixMonth: 9.8, oneYear: 18.2, threeYear: 14.5, fiveYear: 16.8, sinceInception: 17.2 },
    riskRating: 'HIGH',
    fundManager: 'Gaurav Misra',
    benchmark: 'NIFTY 100 TRI',
  },
  118989: {
    ...MOCK_FUNDS[1],
    currentNav: 62.18,
    previousNav: 61.95,
    navChange: 0.23,
    navChangePercent: 0.37,
    aum: 42180,
    expenseRatio: 1.72,
    exitLoad: '1% if redeemed within 12 months',
    minSipAmount: 500,
    minLumpsum: 5000,
    navHistory: navHistory(62.18),
    returns: { oneMonth: 1.8, threeMonth: 4.9, sixMonth: 8.5, oneYear: 15.6, threeYear: 12.8, fiveYear: 14.2, sinceInception: 15.8 },
    riskRating: 'HIGH',
    fundManager: 'Shreyash Devalkar',
    benchmark: 'NIFTY 50 TRI',
  },
  100356: {
    ...MOCK_FUNDS[2],
    currentNav: 148.72,
    previousNav: 147.10,
    navChange: 1.62,
    navChangePercent: 1.10,
    aum: 28950,
    expenseRatio: 1.82,
    exitLoad: '1% if redeemed within 1 year',
    minSipAmount: 500,
    minLumpsum: 5000,
    navHistory: navHistory(148.72),
    returns: { oneMonth: 3.2, threeMonth: 8.1, sixMonth: 14.5, oneYear: 28.4, threeYear: 22.1, fiveYear: 24.8, sinceInception: 20.5 },
    riskRating: 'VERY_HIGH',
    fundManager: 'R. Srinivasan',
    benchmark: 'S&P BSE 250 SmallCap TRI',
  },
  119598: {
    ...MOCK_FUNDS[3],
    currentNav: 78.34,
    previousNav: 77.98,
    navChange: 0.36,
    navChangePercent: 0.46,
    aum: 68420,
    expenseRatio: 1.45,
    exitLoad: '2% if redeemed within 365 days',
    minSipAmount: 1000,
    minLumpsum: 1000,
    navHistory: navHistory(78.34),
    returns: { oneMonth: 2.4, threeMonth: 6.2, sixMonth: 11.2, oneYear: 22.8, threeYear: 18.4, fiveYear: 20.1, sinceInception: 19.8 },
    riskRating: 'HIGH',
    fundManager: 'Rajeev Thakkar',
    benchmark: 'NIFTY 500 TRI',
  },
  101206: {
    ...MOCK_FUNDS[4],
    currentNav: 24.56,
    previousNav: 24.38,
    navChange: 0.18,
    navChangePercent: 0.74,
    aum: 2840,
    expenseRatio: 0.18,
    exitLoad: 'Nil',
    minSipAmount: 500,
    minLumpsum: 5000,
    navHistory: navHistory(24.56),
    returns: { oneMonth: 1.2, threeMonth: 3.8, sixMonth: 7.4, oneYear: 14.2, threeYear: 11.8, fiveYear: 13.5, sinceInception: 12.4 },
    riskRating: 'MODERATE',
    fundManager: 'Krishan Kumar Daga',
    benchmark: 'Domestic Price of Gold',
  },
};

// ─── Gold ─────────────────────────────────────────────────────────────────────
export const MOCK_GOLD_PRICES: GoldPrice[] = [
  {
    symbol: 'GOLD',
    ltp: 72450,
    open: 72100,
    high: 72680,
    low: 72050,
    close: 72100,
    change: 350,
    changePercent: 0.49,
    volume: 12450,
    timestamp: new Date().toISOString(),
    expiry: '05 Jun 2025',
  },
  {
    symbol: 'GOLDM',
    ltp: 72380,
    open: 72050,
    high: 72600,
    low: 72000,
    close: 72050,
    change: 330,
    changePercent: 0.46,
    volume: 8920,
    timestamp: new Date().toISOString(),
    expiry: '30 Apr 2025',
  },
  {
    symbol: 'GOLDPETAL',
    ltp: 7248,
    open: 7215,
    high: 7270,
    low: 7210,
    close: 7215,
    change: 33,
    changePercent: 0.46,
    volume: 3210,
    timestamp: new Date().toISOString(),
    expiry: '30 Apr 2025',
  },
];

export const MOCK_GOLD_ETFS: GoldEtf[] = [
  {
    symbol: 'GOLDBEES',
    name: 'Nippon India ETF Gold BeES',
    isin: 'INF204KB17I5',
    nav: 58.42,
    ltp: 58.65,
    change: 0.42,
    changePercent: 0.72,
    aum: 9840,
    expenseRatio: 0.82,
  },
  {
    symbol: 'HDFCGOLD',
    name: 'HDFC Gold ETF',
    isin: 'INF179KB1HB2',
    nav: 58.18,
    ltp: 58.35,
    change: 0.38,
    changePercent: 0.66,
    aum: 4210,
    expenseRatio: 0.59,
  },
  {
    symbol: 'AXISGOLD',
    name: 'Axis Gold ETF',
    isin: 'INF846K01586',
    nav: 57.95,
    ltp: 58.10,
    change: 0.35,
    changePercent: 0.61,
    aum: 1820,
    expenseRatio: 0.49,
  },
];

// ─── Portfolio ─────────────────────────────────────────────────────────────────
export const MOCK_PORTFOLIO_SUMMARY: PortfolioSummary = {
  totalInvested: 250000,
  currentValue: 312450,
  totalPnl: 62450,
  totalPnlPercent: 24.98,
  dayChange: 1245,
  dayChangePercent: 0.40,
  mfValue: 268420,
  goldValue: 44030,
  sipCount: 3,
  holdingsCount: 6,
};

export const MOCK_HOLDINGS: Holding[] = [
  {
    id: 'h001', userId: 'usr_001', type: 'MUTUAL_FUND',
    schemeCode: 120503, schemeName: 'Mirae Asset Large Cap Fund',
    folioNumber: '1234567890', units: 512.345, avgBuyPrice: 78.20,
    currentPrice: 98.45, investedAmount: 40065, currentValue: 50440,
    pnl: 10375, pnlPercent: 25.90, xirr: 18.4, lastUpdated: new Date().toISOString(),
  },
  {
    id: 'h002', userId: 'usr_001', type: 'MUTUAL_FUND',
    schemeCode: 119598, schemeName: 'Parag Parikh Flexi Cap Fund',
    folioNumber: '9876543210', units: 1284.56, avgBuyPrice: 58.40,
    currentPrice: 78.34, investedAmount: 75018, currentValue: 100620,
    pnl: 25602, pnlPercent: 34.13, xirr: 22.1, lastUpdated: new Date().toISOString(),
  },
  {
    id: 'h003', userId: 'usr_001', type: 'MUTUAL_FUND',
    schemeCode: 100356, schemeName: 'SBI Small Cap Fund',
    folioNumber: '1122334455', units: 340.12, avgBuyPrice: 110.25,
    currentPrice: 148.72, investedAmount: 37500, currentValue: 50580,
    pnl: 13080, pnlPercent: 34.88, xirr: 24.8, lastUpdated: new Date().toISOString(),
  },
  {
    id: 'h004', userId: 'usr_001', type: 'GOLD_ETF',
    symbol: 'GOLDBEES', schemeName: 'Nippon India ETF Gold BeES',
    units: 500, avgBuyPrice: 48.20,
    currentPrice: 58.65, investedAmount: 24100, currentValue: 29325,
    pnl: 5225, pnlPercent: 21.68, lastUpdated: new Date().toISOString(),
  },
];

// ─── Transactions ─────────────────────────────────────────────────────────────
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn001', userId: 'usr_001', type: 'SIP',
    assetType: 'MUTUAL_FUND', schemeCode: 120503,
    schemeName: 'Mirae Asset Large Cap Fund',
    units: 10.234, price: 97.72, amount: 1000,
    status: 'COMPLETED', orderDate: '2025-04-01T09:00:00Z',
    settlementDate: '2025-04-03T09:00:00Z', folioNumber: '1234567890',
  },
  {
    id: 'txn002', userId: 'usr_001', type: 'BUY',
    assetType: 'MUTUAL_FUND', schemeCode: 119598,
    schemeName: 'Parag Parikh Flexi Cap Fund',
    units: 127.388, price: 78.50, amount: 10000,
    status: 'COMPLETED', orderDate: '2025-03-15T10:30:00Z',
    settlementDate: '2025-03-17T10:30:00Z', folioNumber: '9876543210',
  },
  {
    id: 'txn003', userId: 'usr_001', type: 'BUY',
    assetType: 'GOLD_ETF', symbol: 'GOLDBEES',
    schemeName: 'Nippon India ETF Gold BeES',
    units: 100, price: 57.80, amount: 5780,
    status: 'COMPLETED', orderDate: '2025-04-10T11:00:00Z',
    settlementDate: '2025-04-12T11:00:00Z',
  },
  {
    id: 'txn004', userId: 'usr_001', type: 'SIP',
    assetType: 'MUTUAL_FUND', schemeCode: 100356,
    schemeName: 'SBI Small Cap Fund',
    units: 6.712, price: 148.99, amount: 1000,
    status: 'PENDING', orderDate: new Date().toISOString(),
    folioNumber: '1122334455',
  },
];

// ─── Watchlist ─────────────────────────────────────────────────────────────────
export const MOCK_WATCHLIST: WatchlistItem[] = [
  {
    id: 'w001', userId: 'usr_001', type: 'MUTUAL_FUND',
    schemeCode: 118989, name: 'Axis Bluechip Fund', addedAt: '2025-03-01T00:00:00Z',
  },
  {
    id: 'w002', userId: 'usr_001', type: 'GOLD',
    symbol: 'HDFCGOLD', name: 'HDFC Gold ETF', addedAt: '2025-03-10T00:00:00Z',
  },
];
