export const environment = {
  name: 'dev',
  production: false,
  useMocks: true,
  apiBase: 'http://localhost:4200/mock',
  mfApiBase: 'https://api.mfapi.in',          // public MF API (no auth)
  nseApiBase: 'https://www.nseindia.com/api',  // NSE (requires session cookie)
  nismApiBase: 'https://www.nism.ac.in',
  mcxGoldApi: 'https://priceapi.mcxindia.com/MarketData/GetContractDetails',
  authApi: '/api/auth',                        // maintained by you
  portfolioApi: '/api/portfolio',              // maintained by you
  orderApi: '/api/orders',                     // maintained by you
  watchlistApi: '/api/watchlist',              // maintained by you
  refreshInterval: 30000,
  logLevel: 'debug',
};
