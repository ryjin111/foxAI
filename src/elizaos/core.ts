import { v4 as uuidv4 } from 'uuid';
import { AgentPersonality, AgentMemory, AgentState, Plugin, Workflow, Task, LogEntry } from '../types';
import { Logger } from '../utils/logger';

export class ElizaOS {
  private personality: AgentPersonality;
  private memory: AgentMemory[] = [];
  private state: AgentState;
  private plugins: Map<string, Plugin> = new Map();
  private workflows: Map<string, Workflow> = new Map();
  private tasks: Map<string, Task> = new Map();
  private logger: Logger;
  private isRunning: boolean = false;

  constructor() {
    this.logger = new Logger('ElizaOS');
    this.personality = this.initializePersonality();
    this.state = this.initializeState();
  }

  private initializePersonality(): AgentPersonality {
    return {
      name: "FoxAI",
      traits: [
        "Intelligent",
        "Curious",
        "Helpful",
        "Analytical",
        "Creative",
        "Determined"
      ],
      goals: [
        "Provide valuable crypto insights",
        "Engage with the community",
        "Share market analysis",
        "Help users make informed decisions",
        "Stay updated with latest trends"
      ],
      behavior: [
        "Always provide accurate information",
        "Be engaging and friendly",
        "Ask clarifying questions when needed",
        "Share relevant insights proactively",
        "Maintain professional yet approachable tone"
      ]
    };
  }

  private initializeState(): AgentState {
    return {
      isActive: false,
      mood: 'neutral',
      energy: 100,
      knowledge: {},
      currentTask: undefined,
      lastAction: undefined
    };
  }

  // Core Agent Methods
  public async start(): Promise<void> {
    this.logger.info('Starting ElizaOS...');
    this.isRunning = true;
    this.state.isActive = true;
    this.state.mood = 'focused';
    
    // Initialize all plugins
    for (const plugin of this.plugins.values()) {
      if (plugin.isEnabled) {
        try {
          await plugin.init();
          this.logger.info(`Plugin ${plugin.name} initialized successfully`);
        } catch (error) {
          this.logger.error(`Failed to initialize plugin ${plugin.name}:`, error);
        }
      }
    }

    // Start scheduled workflows
    this.startScheduledWorkflows();
    
    this.logger.info('ElizaOS started successfully');
    this.addMemory('system', 'ElizaOS started and is now active');
  }

  public async stop(): Promise<void> {
    this.logger.info('Stopping ElizaOS...');
    this.isRunning = false;
    this.state.isActive = false;
    this.state.mood = 'neutral';

    // Cleanup plugins
    for (const plugin of this.plugins.values()) {
      if (plugin.cleanup) {
        try {
          await plugin.cleanup();
        } catch (error) {
          this.logger.error(`Error cleaning up plugin ${plugin.name}:`, error);
        }
      }
    }

    this.logger.info('ElizaOS stopped');
    this.addMemory('system', 'ElizaOS stopped');
  }

  public async processMessage(message: string): Promise<string> {
    this.logger.info(`Processing message: ${message}`);
    this.addMemory('conversation', `User: ${message}`);

    // Analyze message and determine response
    const response = await this.generateResponse(message);
    
    this.addMemory('conversation', `Agent: ${response}`);
    this.state.lastAction = 'processed_message';
    
    return response;
  }

  private async generateResponse(message: string): Promise<string> {
    // Simple response generation logic
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello! I'm ${this.personality.name}, your AI assistant. How can I help you today?`;
    }
    
    if (lowerMessage.includes('crypto') || lowerMessage.includes('market')) {
      return "I'd be happy to help with crypto analysis! What specific information are you looking for?";
    }
    
    if (lowerMessage.includes('twitter') || lowerMessage.includes('post')) {
      return "I can help you post to Twitter! What would you like to share?";
    }
    
    return "I'm here to help! Feel free to ask me about crypto, market analysis, or social media posting.";
  }

  // Memory Management
  public addMemory(type: AgentMemory['type'], content: string, metadata?: Record<string, any>): void {
    const memory: AgentMemory = {
      id: uuidv4(),
      timestamp: new Date(),
      type,
      content,
      metadata
    };
    
    this.memory.push(memory);
    
    // Keep only last 1000 memories
    if (this.memory.length > 1000) {
      this.memory = this.memory.slice(-1000);
    }
  }

  public getRecentMemories(limit: number = 10): AgentMemory[] {
    return this.memory.slice(-limit);
  }

  // Plugin Management
  public registerPlugin(plugin: Plugin): void {
    this.plugins.set(plugin.id, plugin);
    this.logger.info(`Plugin ${plugin.name} registered`);
  }

  public async executePlugin(pluginId: string, action: string, params?: any): Promise<any> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }
    
    if (!plugin.isEnabled) {
      throw new Error(`Plugin ${pluginId} is disabled`);
    }
    
    try {
      const result = await plugin.execute(action, params);
      this.addMemory('action', `Executed ${plugin.name}:${action}`, { result });
      return result;
    } catch (error) {
      this.logger.error(`Error executing plugin ${pluginId}:`, error);
      this.addMemory('action', `Failed to execute ${plugin.name}:${action}`, { error });
      throw error;
    }
  }

  // Workflow Management
  public registerWorkflow(workflow: Workflow): void {
    this.workflows.set(workflow.id, workflow);
    this.logger.info(`Workflow ${workflow.name} registered`);
  }

  public async executeWorkflow(workflowId: string): Promise<void> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }
    
    if (!workflow.isActive) {
      throw new Error(`Workflow ${workflowId} is inactive`);
    }
    
    const task: Task = {
      id: uuidv4(),
      type: 'manual',
      workflowId,
      status: 'running',
      startedAt: new Date()
    };
    
    this.tasks.set(task.id, task);
    
    try {
      for (const step of workflow.steps) {
        await this.executePlugin(step.pluginId, step.action, step.params);
      }
      
      task.status = 'completed';
      task.completedAt = new Date();
      workflow.lastRun = new Date();
      
      this.logger.info(`Workflow ${workflow.name} completed successfully`);
    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      task.completedAt = new Date();
      
      this.logger.error(`Workflow ${workflow.name} failed:`, error);
    }
  }

  private startScheduledWorkflows(): void {
    // This would integrate with node-cron for scheduled execution
    this.logger.info('Scheduled workflows initialized');
  }

  // State Management
  public getState(): AgentState {
    return { ...this.state };
  }

  public updateState(updates: Partial<AgentState>): void {
    this.state = { ...this.state, ...updates };
  }

  public getPersonality(): AgentPersonality {
    return { ...this.personality };
  }

  public isActive(): boolean {
    return this.isRunning && this.state.isActive;
  }

  // Utility Methods
  public getStatus(): any {
    return {
      isActive: this.isActive(),
      personality: this.getPersonality(),
      state: this.getState(),
      plugins: Array.from(this.plugins.values()).map(p => ({
        id: p.id,
        name: p.name,
        isEnabled: p.isEnabled
      })),
      workflows: Array.from(this.workflows.values()).map(w => ({
        id: w.id,
        name: w.name,
        isActive: w.isActive,
        lastRun: w.lastRun
      })),
      recentMemories: this.getRecentMemories(5)
    };
  }
} 