import axios from 'axios';
import WebSocket from 'ws';
import crypto from 'crypto';
import { HyperliquidConfig, MarketData, Position, Order, TradingSignal } from '../types/index.js';
import { Logger } from '../utils/logger.js';

export class HyperliquidService {
  private config: HyperliquidConfig;
  private ws: WebSocket | null = null;
  private logger: Logger;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(config: HyperliquidConfig) {
    this.config = config;
    this.logger = new Logger('HyperliquidService');
  }

  private generateSignature(timestamp: number, method: string, path: string, body: string = ''): string {
    const message = `${timestamp}${method}${path}${body}`;
    return crypto.createHmac('sha256', this.config.secretKey).update(message).digest('hex');
  }

  private async makeRequest(method: string, endpoint: string, data?: any): Promise<any> {
    const timestamp = Date.now();
    const url = `${this.config.baseUrl}${endpoint}`;
    const body = data ? JSON.stringify(data) : '';
    
    const signature = this.generateSignature(timestamp, method, endpoint, body);
    
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.config.apiKey,
      'X-Timestamp': timestamp.toString(),
      'X-Signature': signature,
    };

    try {
      const response = await axios({
        method,
        url,
        headers,
        data: body || undefined,
      });
      
      return response.data;
    } catch (error) {
      this.logger.error(`API request failed: ${error}`);
      throw error;
    }
  }

  async getAccountInfo(): Promise<any> {
    return this.makeRequest('GET', '/account');
  }

  async getPositions(): Promise<Position[]> {
    const response = await this.makeRequest('GET', '/positions');
    return response.positions || [];
  }

  async getMarketData(symbol?: string): Promise<MarketData[]> {
    const endpoint = symbol ? `/market/${symbol}` : '/markets';
    const response = await this.makeRequest('GET', endpoint);
    return response.markets || [];
  }

  async placeOrder(order: Omit<Order, 'id' | 'status' | 'timestamp'>): Promise<Order> {
    const response = await this.makeRequest('POST', '/order', {
      symbol: order.symbol,
      side: order.side,
      size: order.size,
      price: order.price,
      type: 'limit',
    });
    
    return {
      id: response.orderId,
      symbol: order.symbol,
      side: order.side,
      size: order.size,
      price: order.price,
      status: 'pending',
      timestamp: Date.now(),
    };
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    try {
      await this.makeRequest('DELETE', `/order/${orderId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to cancel order ${orderId}: ${error}`);
      return false;
    }
  }

  async getOrderHistory(limit: number = 100): Promise<Order[]> {
    const response = await this.makeRequest('GET', `/orders?limit=${limit}`);
    return response.orders || [];
  }

  async getOpenOrders(): Promise<Order[]> {
    const response = await this.makeRequest('GET', '/orders/open');
    return response.orders || [];
  }

  // WebSocket connection for real-time data
  connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.config.wsUrl);
      
      this.ws.on('open', () => {
        this.logger.info('WebSocket connected');
        this.reconnectAttempts = 0;
        resolve();
      });

      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleWebSocketMessage(message);
        } catch (error) {
          this.logger.error(`Failed to parse WebSocket message: ${error}`);
        }
      });

      this.ws.on('error', (error) => {
        this.logger.error(`WebSocket error: ${error}`);
        reject(error);
      });

      this.ws.on('close', () => {
        this.logger.warn('WebSocket disconnected');
        this.handleReconnect();
      });
    });
  }

  private handleWebSocketMessage(message: any): void {
    // Handle different types of WebSocket messages
    switch (message.type) {
      case 'market_data':
        this.handleMarketDataUpdate(message.data);
        break;
      case 'order_update':
        this.handleOrderUpdate(message.data);
        break;
      case 'position_update':
        this.handlePositionUpdate(message.data);
        break;
      default:
        this.logger.debug(`Unknown message type: ${message.type}`);
    }
  }

  private handleMarketDataUpdate(data: any): void {
    // Emit market data updates for automation rules
    this.logger.debug(`Market data update for ${data.symbol}: ${data.price}`);
  }

  private handleOrderUpdate(data: any): void {
    this.logger.info(`Order update: ${data.orderId} - ${data.status}`);
  }

  private handlePositionUpdate(data: any): void {
    this.logger.info(`Position update: ${data.symbol} - PnL: ${data.pnl}`);
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      this.logger.info(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connectWebSocket().catch((error) => {
          this.logger.error(`Reconnection failed: ${error}`);
        });
      }, delay);
    } else {
      this.logger.error('Max reconnection attempts reached');
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Trading signal generation based on market data
  async generateTradingSignals(symbol: string): Promise<TradingSignal[]> {
    const marketData = await this.getMarketData(symbol);
    const signals: TradingSignal[] = [];
    
    if (marketData.length === 0) return signals;

    const data = marketData[0];
    
    // Simple signal generation logic (can be enhanced with more sophisticated algorithms)
    const priceChange = data.change24h;
    const volume = data.volume24h;
    
    if (priceChange > 5 && volume > 1000000) {
      signals.push({
        symbol,
        side: 'buy',
        size: 1,
        timestamp: Date.now(),
        confidence: 0.7,
        source: 'volume_price_spike',
      });
    } else if (priceChange < -5 && volume > 1000000) {
      signals.push({
        symbol,
        side: 'sell',
        size: 1,
        timestamp: Date.now(),
        confidence: 0.7,
        source: 'volume_price_drop',
      });
    }
    
    return signals;
  }
} 