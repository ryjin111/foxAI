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
  category: 'meme' | 'copypasta' | 'troll' | 'random' | 'crypto' | 'analysis';
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

// Market Analysis
export interface MarketAnalysis {
  timestamp: string;
  overall_sentiment: 'bullish' | 'bearish' | 'neutral';
  market_cap_change_24h: number;
  volume_change_24h: number;
  top_gainers: CryptoData[];
  top_losers: CryptoData[];
  trending_topics: string[];
  fear_greed_index: number;
}

// Project Score
export interface ProjectScore {
  coin_id: string;
  name: string;
  score: number;
  factors: {
    market_cap: number;
    volume: number;
    price_stability: number;
    community_growth: number;
    developer_activity: number;
  };
  recommendation: 'buy' | 'hold' | 'sell';
  risk_level: 'low' | 'medium' | 'high';
}

// Trend Detection
export interface TrendDetection {
  coin_id: string;
  trend_type: 'breakout' | 'breakdown' | 'consolidation' | 'accumulation';
  confidence: number;
  support_level?: number;
  resistance_level?: number;
  volume_spike: boolean;
  timeframe: string;
} 