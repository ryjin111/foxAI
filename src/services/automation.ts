import cron from 'node-cron';
import { 
  AutomationRule, 
  AutomationCondition, 
  AutomationAction, 
  TradingSignal, 
  MarketData, 
  TwitterPost,
  Alert 
} from '../types/index.js';
import { HyperliquidService } from './hyperliquid.js';
import { TwitterService } from './twitter.js';
import { Logger } from '../utils/logger.js';

export class AutomationService {
  private rules: Map<string, AutomationRule> = new Map();
  private hyperliquidService: HyperliquidService;
  private twitterService: TwitterService;
  private logger: Logger;
  private alerts: Alert[] = [];

  constructor(hyperliquidService: HyperliquidService, twitterService: TwitterService) {
    this.hyperliquidService = hyperliquidService;
    this.twitterService = twitterService;
    this.logger = new Logger('AutomationService');
  }

  addRule(rule: AutomationRule): void {
    this.rules.set(rule.id, rule);
    this.logger.info(`Automation rule added: ${rule.name}`);
  }

  removeRule(ruleId: string): boolean {
    const removed = this.rules.delete(ruleId);
    if (removed) {
      this.logger.info(`Automation rule removed: ${ruleId}`);
    }
    return removed;
  }

  getRules(): AutomationRule[] {
    return Array.from(this.rules.values());
  }

  async startAutomation(): Promise<void> {
    this.logger.info('Starting automation service...');
    
    // Start monitoring market data
    await this.hyperliquidService.connectWebSocket();
    
    // Start scheduled tasks
    this.startScheduledTasks();
    
    // Start Twitter monitoring
    this.startTwitterMonitoring();
    
    this.logger.info('Automation service started successfully');
  }

  private startScheduledTasks(): void {
    // Check for scheduled rules every minute
    cron.schedule('* * * * *', async () => {
      await this.checkScheduledRules();
    });

    // Generate trading signals every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      await this.generateAndProcessSignals();
    });

    // Post market updates every hour
    cron.schedule('0 * * * *', async () => {
      await this.postMarketUpdates();
    });
  }

  private startTwitterMonitoring(): void {
    // Monitor keywords related to trading
    const keywords = ['hyperliquid', 'trading', 'crypto', 'defi', 'futures'];
    
    this.twitterService.monitorKeywords(keywords, async (tweet: TwitterPost) => {
      await this.processTwitterSignal(tweet);
    }).catch((error) => {
      this.logger.error(`Twitter monitoring failed: ${error}`);
    });
  }

  private async checkScheduledRules(): Promise<void> {
    const now = Date.now();
    
    for (const rule of this.rules.values()) {
      if (!rule.enabled || rule.trigger !== 'scheduled') continue;
      
      const scheduledCondition = rule.conditions.find(c => c.type === 'time_based');
      if (!scheduledCondition) continue;
      
      const { cronExpression } = scheduledCondition.parameters;
      if (cron.validate(cronExpression) && cron.schedule(cronExpression, () => {
        this.executeRule(rule);
      })) {
        this.logger.debug(`Scheduled rule triggered: ${rule.name}`);
      }
    }
  }

  private async generateAndProcessSignals(): Promise<void> {
    try {
      // Get market data for popular symbols
      const symbols = ['BTC', 'ETH', 'SOL', 'MATIC'];
      
      for (const symbol of symbols) {
        const signals = await this.hyperliquidService.generateTradingSignals(symbol);
        
        for (const signal of signals) {
          await this.processTradingSignal(signal);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to generate signals: ${error}`);
    }
  }

  private async processTradingSignal(signal: TradingSignal): Promise<void> {
    this.logger.info(`Processing trading signal: ${signal.symbol} ${signal.side} (confidence: ${signal.confidence})`);
    
    // Check if any rules match this signal
    for (const rule of this.rules.values()) {
      if (!rule.enabled || rule.trigger !== 'price_change') continue;
      
      const shouldExecute = await this.evaluateRuleConditions(rule, { signal });
      if (shouldExecute) {
        await this.executeRule(rule, { signal });
      }
    }
  }

  private async processTwitterSignal(tweet: TwitterPost): Promise<void> {
    this.logger.info(`Processing Twitter signal: ${tweet.text.substring(0, 50)}...`);
    
    // Check if any rules match this tweet
    for (const rule of this.rules.values()) {
      if (!rule.enabled || rule.trigger !== 'twitter_mention') continue;
      
      const shouldExecute = await this.evaluateRuleConditions(rule, { tweet });
      if (shouldExecute) {
        await this.executeRule(rule, { tweet });
      }
    }
  }

  private async evaluateRuleConditions(rule: AutomationRule, context: any): Promise<boolean> {
    for (const condition of rule.conditions) {
      const result = await this.evaluateCondition(condition, context);
      if (!result) return false;
    }
    return true;
  }

  private async evaluateCondition(condition: AutomationCondition, context: any): Promise<boolean> {
    switch (condition.type) {
      case 'price_above':
        const marketData = await this.hyperliquidService.getMarketData(condition.parameters.symbol);
        return marketData[0]?.price > condition.parameters.price;
        
      case 'price_below':
        const marketData2 = await this.hyperliquidService.getMarketData(condition.parameters.symbol);
        return marketData2[0]?.price < condition.parameters.price;
        
      case 'volume_above':
        const marketData3 = await this.hyperliquidService.getMarketData(condition.parameters.symbol);
        return marketData3[0]?.volume24h > condition.parameters.volume;
        
      case 'twitter_keyword':
        if (context.tweet) {
          const keywords = condition.parameters.keywords as string[];
          return keywords.some(keyword => 
            context.tweet.text.toLowerCase().includes(keyword.toLowerCase())
          );
        }
        return false;
        
      case 'time_based':
        return true; // Already handled by cron
        
      default:
        return false;
    }
  }

  private async executeRule(rule: AutomationRule, context?: any): Promise<void> {
    this.logger.info(`Executing rule: ${rule.name}`);
    
    for (const action of rule.actions) {
      try {
        await this.executeAction(action, context);
      } catch (error) {
        this.logger.error(`Failed to execute action in rule ${rule.name}: ${error}`);
        this.addAlert('error', `Action execution failed: ${error}`);
      }
    }
  }

  private async executeAction(action: AutomationAction, context?: any): Promise<void> {
    switch (action.type) {
      case 'place_order':
        await this.executePlaceOrder(action.parameters, context);
        break;
        
      case 'post_tweet':
        await this.executePostTweet(action.parameters, context);
        break;
        
      case 'send_alert':
        await this.executeSendAlert(action.parameters, context);
        break;
        
      case 'close_position':
        await this.executeClosePosition(action.parameters, context);
        break;
        
      default:
        this.logger.warn(`Unknown action type: ${action.type}`);
    }
  }

  private async executePlaceOrder(parameters: any, context?: any): Promise<void> {
    const order = {
      symbol: parameters.symbol,
      side: parameters.side,
      size: parameters.size,
      price: parameters.price,
    };
    
    const result = await this.hyperliquidService.placeOrder(order);
    this.logger.info(`Order placed: ${result.id}`);
    this.addAlert('success', `Order placed: ${order.symbol} ${order.side} ${order.size}`);
  }

  private async executePostTweet(parameters: any, context?: any): Promise<void> {
    let tweetText = parameters.text;
    
    // Replace placeholders with actual data
    if (context?.signal) {
      tweetText = tweetText
        .replace('{symbol}', context.signal.symbol)
        .replace('{side}', context.signal.side)
        .replace('{confidence}', context.signal.confidence.toString());
    }
    
    const tweetId = await this.twitterService.postTweet(tweetText);
    this.logger.info(`Tweet posted: ${tweetId}`);
    this.addAlert('info', `Tweet posted: ${tweetText.substring(0, 50)}...`);
  }

  private async executeSendAlert(parameters: any, context?: any): Promise<void> {
    const alert: Alert = {
      id: Date.now().toString(),
      type: parameters.type || 'info',
      message: parameters.message,
      timestamp: Date.now(),
      data: context,
    };
    
    this.addAlert(alert.type, alert.message, context);
  }

  private async executeClosePosition(parameters: any, context?: any): Promise<void> {
    const positions = await this.hyperliquidService.getPositions();
    const position = positions.find(p => p.symbol === parameters.symbol);
    
    if (position && position.size !== 0) {
      const closeOrder = {
        symbol: position.symbol,
        side: position.size > 0 ? 'sell' : 'buy',
        size: Math.abs(position.size),
        price: undefined, // Market order
      };
      
      const result = await this.hyperliquidService.placeOrder(closeOrder);
      this.logger.info(`Position closed: ${result.id}`);
      this.addAlert('warning', `Position closed: ${position.symbol}`);
    }
  }

  private async postMarketUpdates(): Promise<void> {
    try {
      const marketData = await this.hyperliquidService.getMarketData();
      const topMovers = marketData
        .filter(m => Math.abs(m.change24h) > 5)
        .slice(0, 5);
      
      if (topMovers.length > 0) {
        const tweetText = `📊 Market Update:\n${topMovers.map(m => 
          `${m.symbol}: ${m.change24h > 0 ? '📈' : '📉'} ${m.change24h.toFixed(2)}%`
        ).join('\n')}`;
        
        await this.twitterService.postTweet(tweetText);
        this.logger.info('Market update posted');
      }
    } catch (error) {
      this.logger.error(`Failed to post market update: ${error}`);
    }
  }

  private addAlert(type: Alert['type'], message: string, data?: any): void {
    const alert: Alert = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: Date.now(),
      data,
    };
    
    this.alerts.push(alert);
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
  }

  getAlerts(): Alert[] {
    return [...this.alerts];
  }

  clearAlerts(): void {
    this.alerts = [];
  }
} 