import { Logger } from '../utils/logger.js';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  volume_24h: number;
  image: string;
}

export interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    price_btc: number;
    score: number;
  };
}

export class CryptoService {
  private logger: Logger;
  private baseUrl = 'https://api.coingecko.com/api/v3';

  constructor() {
    this.logger = new Logger('CryptoService');
  }

  async getTopCoins(limit: number = 10): Promise<CryptoData[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.statusText}`);
      }

      const data = await response.json();
      this.logger.info(`Fetched top ${limit} coins`);
      return data;
    } catch (error) {
      this.logger.error('Failed to fetch top coins:', error);
      return [];
    }
  }

  async getTrendingCoins(): Promise<TrendingCoin[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search/trending`);
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.statusText}`);
      }

      const data = await response.json();
      this.logger.info('Fetched trending coins');
      return data.coins || [];
    } catch (error) {
      this.logger.error('Failed to fetch trending coins:', error);
      return [];
    }
  }

  async getCoinPrice(coinId: string): Promise<number | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/simple/price?ids=${coinId}&vs_currencies=usd`
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data[coinId]?.usd || null;
    } catch (error) {
      this.logger.error(`Failed to fetch price for ${coinId}:`, error);
      return null;
    }
  }

  async getMarketData(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/global`);
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.statusText}`);
      }

      const data = await response.json();
      this.logger.info('Fetched global market data');
      return data.data;
    } catch (error) {
      this.logger.error('Failed to fetch market data:', error);
      return null;
    }
  }

  generateCryptoShitpost(coinData?: CryptoData): string {
    const templates = [
      "🚀 {coin} just went {direction}! {percentage}% in 24h! To the moon or to the ground? Only time will tell! 🌙 #Crypto #MoonMission",
      "📊 {coin} is {trend}! Market cap: ${marketCap}B. This is either the best or worst investment of your life! 💎 #DiamondHands",
      "🔥 {coin} is {trend} like crazy! {percentage}% change in 24h. Your portfolio is either celebrating or crying right now! 😅 #CryptoLife",
      "⚡ {coin} update: ${price} USD. {trend} {percentage}%. The crypto gods have spoken! 🙏 #Crypto #Trading",
      "💎 {coin} holders, how we feeling? {trend} {percentage}% in 24h. This is why we HODL! 💪 #HODL #Crypto"
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];
    
    if (coinData) {
      const direction = coinData.price_change_percentage_24h > 0 ? '🚀 UP' : '📉 DOWN';
      const trend = coinData.price_change_percentage_24h > 0 ? 'pumping' : 'dumping';
      const percentage = Math.abs(coinData.price_change_percentage_24h).toFixed(2);
      const marketCap = (coinData.market_cap / 1e9).toFixed(2);
      const price = coinData.current_price.toFixed(2);

      return template
        .replace('{coin}', coinData.name)
        .replace('{direction}', direction)
        .replace('{trend}', trend)
        .replace('{percentage}', percentage)
        .replace('{marketCap}', marketCap)
        .replace('{price}', price);
    }

    return "🚀 Crypto is wild today! Some coins are mooning, others are rekt. This is why we love this space! 💎 #Crypto #WildWest";
  }

  async getRandomCryptoInsight(): Promise<string> {
    try {
      const [topCoins, trendingCoins] = await Promise.all([
        this.getTopCoins(5),
        this.getTrendingCoins()
      ]);

      if (topCoins.length === 0) {
        return "📊 Crypto markets are having a moment! Check back later for fresh insights! 🔍 #Crypto";
      }

      const randomCoin = topCoins[Math.floor(Math.random() * topCoins.length)];
      return this.generateCryptoShitpost(randomCoin);
    } catch (error) {
      this.logger.error('Failed to generate crypto insight:', error);
      return "🚀 Crypto is always interesting! Check your favorite coins and HODL strong! 💎 #Crypto";
    }
  }
} 