// ─── User / Auth ────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  panNumber: string;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  riskProfile: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  mobile: string;
  password: string;
  panNumber: string;
}

// ─── Mutual Fund ─────────────────────────────────────────────────────────────
export interface MutualFund {
  schemeCode: number;          // AMFI scheme code
  schemeName: string;
  fundHouse: string;
  schemeType: string;          // Equity / Debt / Hybrid / Gold
  schemeCategory: string;      // Large Cap / Mid Cap / etc.
  schemeNavName: string;
  isinGrowth: string;
  isinDivReinvestment: string;
}

export interface NavData {
  schemeCode: number;
  schemeName: string;
  date: string;                // dd-MM-yyyy
  nav: number;
}

export interface NavHistory {
  date: string;
  nav: number;
}

export interface FundDetail extends MutualFund {
  currentNav: number;
  previousNav: number;
  navChange: number;
  navChangePercent: number;
  aum: number;                 // in crores
  expenseRatio: number;
  exitLoad: string;
  minSipAmount: number;
  minLumpsum: number;
  navHistory: NavHistory[];
  returns: FundReturns;
  riskRating: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  fundManager: string;
  benchmark: string;
}

export interface FundReturns {
  oneMonth: number;
  threeMonth: number;
  sixMonth: number;
  oneYear: number;
  threeYear: number;
  fiveYear: number;
  sinceInception: number;
}

// ─── SIP ─────────────────────────────────────────────────────────────────────
export interface SipOrder {
  id?: string;
  userId: string;
  schemeCode: number;
  schemeName: string;
  amount: number;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'WEEKLY';
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'COMPLETED';
  nextInstallmentDate: string;
  totalInstallments: number;
  completedInstallments: number;
  folioNumber?: string;
}

// ─── Gold ─────────────────────────────────────────────────────────────────────
export interface GoldInstrument {
  symbol: string;              // GOLD, GOLDM, GOLDPETAL, SGOLD (ETF)
  name: string;
  type: 'MCX_FUTURES' | 'ETF' | 'SOVEREIGN_BOND' | 'DIGITAL_GOLD';
  exchange: 'MCX' | 'NSE' | 'BSE';
  unit: string;                // grams / 10 grams
  lotSize: number;
}

export interface GoldPrice {
  symbol: string;
  ltp: number;                 // last traded price
  open: number;
  high: number;
  low: number;
  close: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
  expiry?: string;             // for futures
}

export interface GoldEtf {
  symbol: string;
  name: string;
  isin: string;
  nav: number;
  ltp: number;
  change: number;
  changePercent: number;
  aum: number;
  expenseRatio: number;
}

// ─── Portfolio ────────────────────────────────────────────────────────────────
export interface Holding {
  id: string;
  userId: string;
  type: 'MUTUAL_FUND' | 'GOLD_ETF' | 'GOLD_FUTURES' | 'DIGITAL_GOLD' | 'SGB';
  schemeCode?: number;
  symbol?: string;
  schemeName: string;
  folioNumber?: string;
  units: number;
  avgBuyPrice: number;
  currentPrice: number;
  investedAmount: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  xirr?: number;
  lastUpdated: string;
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  dayChange: number;
  dayChangePercent: number;
  mfValue: number;
  goldValue: number;
  sipCount: number;
  holdingsCount: number;
}

// ─── Transaction ─────────────────────────────────────────────────────────────
export interface Transaction {
  id: string;
  userId: string;
  type: 'BUY' | 'SELL' | 'SIP' | 'REDEMPTION' | 'SWITCH';
  assetType: 'MUTUAL_FUND' | 'GOLD_ETF' | 'GOLD_FUTURES' | 'DIGITAL_GOLD' | 'SGB';
  schemeCode?: number;
  symbol?: string;
  schemeName: string;
  units: number;
  price: number;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  orderDate: string;
  settlementDate?: string;
  folioNumber?: string;
  remarks?: string;
}

export interface OrderRequest {
  type: 'BUY' | 'SELL' | 'REDEMPTION';
  assetType: 'MUTUAL_FUND' | 'GOLD_ETF' | 'DIGITAL_GOLD' | 'SGB';
  schemeCode?: number;
  symbol?: string;
  amount?: number;             // for MF lumpsum / digital gold
  units?: number;              // for ETF / redemption by units
  folioNumber?: string;
}

// ─── Watchlist ────────────────────────────────────────────────────────────────
export interface WatchlistItem {
  id: string;
  userId: string;
  type: 'MUTUAL_FUND' | 'GOLD';
  schemeCode?: number;
  symbol?: string;
  name: string;
  addedAt: string;
}

// ─── NSE / Market ─────────────────────────────────────────────────────────────
export interface MarketStatus {
  market: string;
  marketStatus: 'Open' | 'Closed' | 'Pre-Open';
  tradeDate: string;
  index: string;
  last: number;
  variation: number;
  percentChange: number;
  marketStatusMessage: string;
}

export interface NseIndex {
  key: string;
  index: string;
  indexSymbol: string;
  last: number;
  variation: number;
  percentChange: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  yearHigh: number;
  yearLow: number;
  indicativeClose: number;
  pe: number;
  pb: number;
  dy: number;
  declines: number;
  advances: number;
  unchanged: number;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── UI State ─────────────────────────────────────────────────────────────────
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface FilterState {
  fundType?: string;
  category?: string;
  riskRating?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  page: number;
  pageSize: number;
}
