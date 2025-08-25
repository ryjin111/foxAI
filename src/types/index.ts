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
  category: 'meme' | 'copypasta' | 'troll' | 'random';
  tags: string[];
}

// Sentiment Analysis Result
export interface SentimentResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  keywords: string[];
} 