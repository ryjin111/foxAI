export interface HyperliquidConfig {
  apiKey: string;
  secretKey: string;
  baseUrl: string;
  wsUrl: string;
}

export interface TwitterConfig {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
  bearerToken: string;
}

export interface TradingSignal {
  symbol: string;
  side: 'buy' | 'sell';
  size: number;
  price?: number;
  timestamp: number;
  confidence: number;
  source: string;
}

export interface MarketData {
  symbol: string;
  price: number;
  volume24h: number;
  change24h: number;
  timestamp: number;
}

export interface Position {
  symbol: string;
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  timestamp: number;
}

export interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  size: number;
  price: number;
  status: 'pending' | 'filled' | 'cancelled';
  timestamp: number;
}

export interface TwitterPost {
  id: string;
  text: string;
  timestamp: number;
  metrics: {
    likes: number;
    retweets: number;
    replies: number;
  };
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: 'price_change' | 'volume_spike' | 'twitter_mention' | 'scheduled';
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  enabled: boolean;
  createdAt: number;
}

export interface AutomationCondition {
  type: 'price_above' | 'price_below' | 'volume_above' | 'twitter_keyword' | 'time_based';
  parameters: Record<string, any>;
}

export interface AutomationAction {
  type: 'place_order' | 'post_tweet' | 'send_alert' | 'close_position';
  parameters: Record<string, any>;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: number;
  data?: any;
} 