// Twitter Configuration
export interface TwitterConfig {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
  bearerToken: string;
}

// Automation Rule
export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  conditions: any[];
  actions: any[];
  enabled: boolean;
  createdAt: number;
}

// Shitposting Templates
export interface ShitpostTemplate {
  id: string;
  name: string;
  template: string;
  category: 'meme' | 'copypasta' | 'troll' | 'random' | 'crypto';
  tags: string[];
}

// Sentiment Analysis Result
export interface SentimentResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  keywords: string[];
}

// Crypto Data
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

// Trending Coin
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