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

export interface HyperliquidData {
  symbol: string;
  price: number;
  price_change_24h: number;
  volume_24h: number;
  market_cap: number;
  is_nft: boolean;
  nft_collection?: string;
  holders?: number;
}

export interface MarketAnalysis {
  timestamp: string;
  overall_sentiment: 'bullish' | 'bearish' | 'neutral';
  market_cap_change_24h: number;
  volume_change_24h: number;
  top_gainers: HyperliquidData[];
  top_losers: HyperliquidData[];
  trending_topics: string[];
  fear_greed_index: number;
  hyperliquid_evm_focus: boolean;
}

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

export interface TrendDetection {
  coin_id: string;
  trend_type: 'breakout' | 'breakdown' | 'consolidation' | 'accumulation';
  confidence: number;
  support_level?: number;
  resistance_level?: number;
  volume_spike: boolean;
  timeframe: string;
}

export class CryptoService {
  private logger: Logger;
  private baseUrl = 'https://api.coingecko.com/api/v3';
  private hyperliquidUrl = 'https://api.hyperliquid.xyz'; // Hyperliquid API

  constructor() {
    this.logger = new Logger('CryptoService');
  }

  // Hyperliquid EVM specific methods
  async getHyperliquidData(): Promise<HyperliquidData[]> {
    try {
      // Simulate Hyperliquid EVM data (replace with actual API calls)
      const hyperliquidAssets: HyperliquidData[] = [
        {
          symbol: 'HL_NFT',
          price: 0.85,
          price_change_24h: 12.5,
          volume_24h: 2500000,
          market_cap: 85000000,
          is_nft: true,
          nft_collection: 'Hyperliquid EVM NFTs',
          holders: 1250
        },
        {
          symbol: 'HL_TOKEN',
          price: 2.45,
          price_change_24h: -3.2,
          volume_24h: 1800000,
          market_cap: 245000000,
          is_nft: false
        },
        {
          symbol: 'HL_DEFI',
          price: 1.23,
          price_change_24h: 8.7,
          volume_24h: 3200000,
          market_cap: 123000000,
          is_nft: false
        },
        {
          symbol: 'HL_GAMING',
          price: 0.67,
          price_change_24h: 15.3,
          volume_24h: 4500000,
          market_cap: 67000000,
          is_nft: true,
          nft_collection: 'Gaming NFTs',
          holders: 890
        }
      ];

      this.logger.info('Fetched Hyperliquid EVM data');
      return hyperliquidAssets;
    } catch (error) {
      this.logger.error('Failed to fetch Hyperliquid data:', error);
      return [];
    }
  }

  async getNFTCollectionData(collectionName: string): Promise<HyperliquidData[]> {
    try {
      // Focus on specific NFT collection data
      const nftData: HyperliquidData[] = [
        {
          symbol: `${collectionName}_NFT_1`,
          price: 1.25,
          price_change_24h: 18.5,
          volume_24h: 850000,
          market_cap: 12500000,
          is_nft: true,
          nft_collection: collectionName,
          holders: 450
        },
        {
          symbol: `${collectionName}_NFT_2`,
          price: 0.95,
          price_change_24h: 22.1,
          volume_24h: 1200000,
          market_cap: 9500000,
          is_nft: true,
          nft_collection: collectionName,
          holders: 380
        }
      ];

      this.logger.info(`Fetched ${collectionName} NFT collection data`);
      return nftData;
    } catch (error) {
      this.logger.error(`Failed to fetch ${collectionName} NFT data:`, error);
      return [];
    }
  }

  async getMarketAnalysis(): Promise<MarketAnalysis> {
    try {
      const hyperliquidData = await this.getHyperliquidData();
      
      const gainers = hyperliquidData
        .filter(asset => asset.price_change_24h > 0)
        .sort((a, b) => b.price_change_24h - a.price_change_24h)
        .slice(0, 5);

      const losers = hyperliquidData
        .filter(asset => asset.price_change_24h < 0)
        .sort((a, b) => a.price_change_24h - b.price_change_24h)
        .slice(0, 5);

      const overallSentiment = this.calculateMarketSentiment(hyperliquidData);
      const fearGreedIndex = this.calculateFearGreedIndex(hyperliquidData);

      return {
        timestamp: new Date().toISOString(),
        overall_sentiment: overallSentiment,
        market_cap_change_24h: this.calculateMarketCapChange(hyperliquidData),
        volume_change_24h: this.calculateVolumeChange(hyperliquidData),
        top_gainers: gainers,
        top_losers: losers,
        trending_topics: this.generateHyperliquidTopics(hyperliquidData),
        fear_greed_index: fearGreedIndex,
        hyperliquid_evm_focus: true
      };
    } catch (error) {
      this.logger.error('Failed to generate Hyperliquid market analysis:', error);
      return this.getDefaultMarketAnalysis();
    }
  }

  async getProjectScore(coinId: string): Promise<ProjectScore> {
    try {
      const hyperliquidData = await this.getHyperliquidData();
      const asset = hyperliquidData.find(a => a.symbol.toLowerCase() === coinId.toLowerCase());
      
      if (!asset) {
        throw new Error(`Asset ${coinId} not found in Hyperliquid EVM`);
      }

      const score = this.calculateProjectScore({
        price: asset.price,
        marketCap: asset.market_cap,
        volume: asset.volume_24h,
        isNFT: asset.is_nft,
        holders: asset.holders || 0
      });

      return {
        coin_id: coinId,
        name: asset.symbol,
        score: score.total,
        factors: {
          market_cap: score.factors.marketCap,
          volume: score.factors.volume,
          price_stability: score.factors.stability,
          community_growth: score.factors.community,
          developer_activity: score.factors.development
        },
        recommendation: score.recommendation,
        risk_level: score.riskLevel
      };
    } catch (error) {
      this.logger.error(`Failed to calculate project score for ${coinId}:`, error);
      return this.getDefaultProjectScore(coinId);
    }
  }

  async detectTrends(coinId: string): Promise<TrendDetection> {
    try {
      const hyperliquidData = await this.getHyperliquidData();
      const asset = hyperliquidData.find(a => a.symbol.toLowerCase() === coinId.toLowerCase());
      
      if (!asset) {
        throw new Error(`Asset ${coinId} not found in Hyperliquid EVM`);
      }

      const trendType = this.analyzeTrendType(asset.price_change_24h);
      const confidence = Math.random() * 0.4 + 0.6; // 60-100% confidence

      return {
        coin_id: coinId,
        trend_type: trendType,
        confidence: Math.round(confidence * 100),
        support_level: asset.price * 0.95,
        resistance_level: asset.price * 1.05,
        volume_spike: asset.volume_24h > 1000000, // High volume threshold
        timeframe: '24h'
      };
    } catch (error) {
      this.logger.error(`Failed to detect trends for ${coinId}:`, error);
      return this.getDefaultTrendDetection(coinId);
    }
  }

  async analyzeSentiment(text: string): Promise<{ sentiment: string; score: number; keywords: string[] }> {
    const positiveWords = ['bullish', 'moon', 'pump', 'gains', 'profit', 'buy', 'hodl', 'diamond', 'rocket', 'hyperliquid', 'evm', 'nft'];
    const negativeWords = ['bearish', 'dump', 'crash', 'sell', 'fud', 'scam', 'rug', 'dead'];
    const hyperliquidKeywords = ['hyperliquid', 'evm', 'nft', 'defi', 'gaming', 'trading'];

    const words = text.toLowerCase().split(' ');
    let positiveCount = 0;
    let negativeCount = 0;
    const foundKeywords: string[] = [];

    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
      if (hyperliquidKeywords.includes(word)) foundKeywords.push(word);
    });

    const score = (positiveCount - negativeCount) / words.length;
    let sentiment = 'neutral';
    if (score > 0.1) sentiment = 'bullish';
    else if (score < -0.1) sentiment = 'bearish';

    return {
      sentiment,
      score: Math.round(score * 100),
      keywords: foundKeywords
    };
  }

  generateCryptoShitpost(assetData?: HyperliquidData): string {
    const templates = [
      "🚀 {asset} on Hyperliquid EVM just went {direction}! {percentage}% in 24h! The NFT market is wild! 🌙 #Hyperliquid #EVM #NFT",
      "📊 {asset} is {trend} on Hyperliquid! Market cap: ${marketCap}M. {nft_info} This is the future of trading! 💎 #HyperliquidEVM",
      "🔥 {asset} is {trend} like crazy on Hyperliquid EVM! {percentage}% change in 24h. {nft_info} The revolution is here! 😅 #Crypto #NFT",
      "⚡ {asset} update on Hyperliquid: ${price} USD. {trend} {percentage}%. EVM supremacy! 🙏 #Hyperliquid #EVM #Trading",
      "💎 {asset} holders on Hyperliquid EVM, how we feeling? {trend} {percentage}% in 24h. {nft_info} This is why we HODL! 💪 #HODL #Hyperliquid"
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];

    if (assetData) {
      const direction = assetData.price_change_24h > 0 ? '🚀 UP' : '📉 DOWN';
      const trend = assetData.price_change_24h > 0 ? 'pumping' : 'dumping';
      const percentage = Math.abs(assetData.price_change_24h).toFixed(2);
      const marketCap = (assetData.market_cap / 1e6).toFixed(2);
      const price = assetData.price.toFixed(2);
      const nftInfo = assetData.is_nft ? `NFT Collection: ${assetData.nft_collection} | Holders: ${assetData.holders}` : '';

      return template
        .replace('{asset}', assetData.symbol)
        .replace('{direction}', direction)
        .replace('{trend}', trend)
        .replace('{percentage}', percentage)
        .replace('{marketCap}', marketCap)
        .replace('{price}', price)
        .replace('{nft_info}', nftInfo);
    }

    return "🚀 Hyperliquid EVM is revolutionizing crypto trading! NFTs, DeFi, and gaming all in one place! 💎 #Hyperliquid #EVM #Crypto";
  }

  async getRandomCryptoInsight(): Promise<string> {
    try {
      const hyperliquidData = await this.getHyperliquidData();
      
      if (hyperliquidData.length === 0) {
        return "📊 Hyperliquid EVM markets are having a moment! Check back later for fresh insights! 🔍 #Hyperliquid #EVM";
      }

      const randomAsset = hyperliquidData[Math.floor(Math.random() * hyperliquidData.length)];
      return this.generateCryptoShitpost(randomAsset);
    } catch (error) {
      this.logger.error('Failed to generate Hyperliquid insight:', error);
      return "🚀 Hyperliquid EVM is always interesting! Check your favorite assets and HODL strong! 💎 #Hyperliquid #EVM";
    }
  }

  // Legacy methods for compatibility (now redirect to Hyperliquid data)
  async getTopCoins(limit: number = 10): Promise<CryptoData[]> {
    const hyperliquidData = await this.getHyperliquidData();
    return hyperliquidData.map(asset => ({
      id: asset.symbol,
      symbol: asset.symbol,
      name: asset.symbol,
      current_price: asset.price,
      price_change_24h: asset.price_change_24h,
      price_change_percentage_24h: asset.price_change_24h,
      market_cap: asset.market_cap,
      volume_24h: asset.volume_24h,
      image: ''
    })).slice(0, limit);
  }

  async getTrendingCoins(): Promise<TrendingCoin[]> {
    const hyperliquidData = await this.getHyperliquidData();
    return hyperliquidData
      .filter(asset => asset.price_change_24h > 10) // Trending = >10% gain
      .map(asset => ({
        item: {
          id: asset.symbol,
          name: asset.symbol,
          symbol: asset.symbol,
          market_cap_rank: 1,
          price_btc: asset.price / 50000, // Rough BTC conversion
          score: asset.price_change_24h
        }
      }));
  }

  async getCoinPrice(coinId: string): Promise<number | null> {
    const hyperliquidData = await this.getHyperliquidData();
    const asset = hyperliquidData.find(a => a.symbol.toLowerCase() === coinId.toLowerCase());
    return asset?.price || null;
  }

  // Private helper methods
  private calculateMarketSentiment(assets: HyperliquidData[]): 'bullish' | 'bearish' | 'neutral' {
    const positiveCount = assets.filter(asset => asset.price_change_24h > 0).length;
    const negativeCount = assets.filter(asset => asset.price_change_24h < 0).length;
    
    if (positiveCount > negativeCount * 1.5) return 'bullish';
    if (negativeCount > positiveCount * 1.5) return 'bearish';
    return 'neutral';
  }

  private calculateFearGreedIndex(assets: HyperliquidData[]): number {
    const avgChange = assets.reduce((sum, asset) => sum + asset.price_change_24h, 0) / assets.length;
    const avgVolume = assets.reduce((sum, asset) => sum + asset.volume_24h, 0) / assets.length;
    
    let index = 50; // Neutral
    if (avgChange > 5) index += 20; // Greed
    if (avgChange < -5) index -= 20; // Fear
    if (avgVolume > 2000000) index += 10; // High activity
    if (avgVolume < 500000) index -= 10; // Low activity
    
    return Math.max(0, Math.min(100, index));
  }

  private calculateMarketCapChange(assets: HyperliquidData[]): number {
    const totalMarketCap = assets.reduce((sum, asset) => sum + asset.market_cap, 0);
    return (totalMarketCap / 1e6) * 0.1; // Simulate 10% change
  }

  private calculateVolumeChange(assets: HyperliquidData[]): number {
    const totalVolume = assets.reduce((sum, asset) => sum + asset.volume_24h, 0);
    return (totalVolume / 1e6) * 0.15; // Simulate 15% change
  }

  private generateHyperliquidTopics(assets: HyperliquidData[]): string[] {
    const topics = ['Hyperliquid EVM', 'NFT Trading', 'DeFi', 'Gaming NFTs', 'Cross-chain Trading'];
    return topics.slice(0, 3);
  }

  private calculateProjectScore(data: any): any {
    const marketCapScore = Math.min(data.marketCap / 1e6, 100);
    const volumeScore = Math.min(data.volume / 1e6, 100);
    const stabilityScore = 70 + Math.random() * 30;
    const communityScore = data.isNFT ? (data.holders / 1000) * 100 : 60 + Math.random() * 40;
    const developmentScore = 50 + Math.random() * 50;

    const total = (marketCapScore + volumeScore + stabilityScore + communityScore + developmentScore) / 5;
    
    let recommendation = 'hold';
    if (total > 80) recommendation = 'buy';
    else if (total < 40) recommendation = 'sell';

    let riskLevel = 'medium';
    if (total > 70) riskLevel = 'low';
    else if (total < 30) riskLevel = 'high';

    return {
      total: Math.round(total),
      factors: { marketCap: marketCapScore, volume: volumeScore, stability: stabilityScore, community: communityScore, development: developmentScore },
      recommendation,
      riskLevel
    };
  }

  private analyzeTrendType(priceChange: number): 'breakout' | 'breakdown' | 'consolidation' | 'accumulation' {
    if (priceChange > 10) return 'breakout';
    if (priceChange < -10) return 'breakdown';
    if (priceChange > 0) return 'accumulation';
    return 'consolidation';
  }

  private getDefaultMarketAnalysis(): MarketAnalysis {
    return {
      timestamp: new Date().toISOString(),
      overall_sentiment: 'neutral',
      market_cap_change_24h: 0,
      volume_change_24h: 0,
      top_gainers: [],
      top_losers: [],
      trending_topics: ['Hyperliquid EVM', 'NFT Trading', 'DeFi'],
      fear_greed_index: 50,
      hyperliquid_evm_focus: true
    };
  }

  private getDefaultProjectScore(coinId: string): ProjectScore {
    return {
      coin_id: coinId,
      name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
      score: 50,
      factors: { market_cap: 50, volume: 50, price_stability: 50, community_growth: 50, developer_activity: 50 },
      recommendation: 'hold',
      risk_level: 'medium'
    };
  }

  private getDefaultTrendDetection(coinId: string): TrendDetection {
    return {
      coin_id: coinId,
      trend_type: 'consolidation',
      confidence: 60,
      support_level: 0,
      resistance_level: 0,
      volume_spike: false,
      timeframe: '24h'
    };
  }
} 