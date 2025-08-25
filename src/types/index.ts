// Core ElizaOS Types
export interface AgentPersonality {
  name: string;
  traits: string[];
  goals: string[];
  behavior: string[];
}

export interface AgentMemory {
  id: string;
  timestamp: Date;
  type: 'conversation' | 'action' | 'observation' | 'decision' | 'system';
  content: string;
  metadata?: Record<string, any>;
}

export interface AgentState {
  isActive: boolean;
  currentTask?: string;
  lastAction?: string;
  mood: 'happy' | 'focused' | 'curious' | 'determined' | 'neutral';
  energy: number; // 0-100
  knowledge: Record<string, any>;
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  capabilities: string[];
  isEnabled: boolean;
  init(): Promise<void>;
  execute(action: string, params?: any): Promise<any>;
  cleanup?(): Promise<void>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  schedule?: string; // cron expression
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

export interface WorkflowStep {
  id: string;
  name: string;
  pluginId: string;
  action: string;
  params?: any;
  condition?: string;
  onSuccess?: string;
  onError?: string;
}

export interface Task {
  id: string;
  type: 'scheduled' | 'triggered' | 'manual';
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
}

// Twitter Plugin Types
export interface TwitterConfig {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
  bearerToken: string;
}

export interface TweetContent {
  text: string;
  hashtags?: string[];
  mentions?: string[];
  media?: string[];
}

// Crypto Plugin Types
export interface CryptoData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
}

export interface HyperliquidData {
  asset: string;
  price: number;
  volume24h: number;
  change24h: number;
  marketCap: number;
  nftCollections?: NFTCollection[];
}

export interface NFTCollection {
  name: string;
  floorPrice: number;
  volume24h: number;
  holders: number;
  items: number;
}

// AI Plugin Types
export interface AIResponse {
  content: string;
  confidence: number;
  reasoning?: string;
  suggestions?: string[];
}

export interface AIContext {
  conversation: string[];
  currentTask?: string;
  agentState: AgentState;
  availablePlugins: string[];
}

// System Types
export interface SystemConfig {
  port: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  plugins: Record<string, any>;
  workflows: Record<string, any>;
}

export interface LogEntry {
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  metadata?: Record<string, any>;
} 