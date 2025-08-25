import { TwitterService } from './twitter.js';
import { AutomationRule } from '../types/index.js';
import { Logger } from '../utils/logger.js';

export class AutomationService {
  private rules: Map<string, AutomationRule> = new Map();
  private twitterService: TwitterService;
  private logger: Logger;

  constructor(twitterService: TwitterService) {
    this.twitterService = twitterService;
    this.logger = new Logger('AutomationService');
  }

  async createRule(ruleData: any): Promise<AutomationRule> {
    const rule: AutomationRule = {
      id: Date.now().toString(),
      name: ruleData.name,
      trigger: ruleData.trigger,
      conditions: ruleData.conditions || [],
      actions: ruleData.actions || [],
      enabled: true,
      createdAt: Date.now(),
    };

    this.rules.set(rule.id, rule);
    this.logger.info(`Created automation rule: ${rule.name}`);
    return rule;
  }

  async listRules(): Promise<AutomationRule[]> {
    return Array.from(this.rules.values());
  }

  async deleteRule(ruleId: string): Promise<boolean> {
    const deleted = this.rules.delete(ruleId);
    if (deleted) {
      this.logger.info(`Deleted automation rule: ${ruleId}`);
    }
    return deleted;
  }

  getRuleCount(): number {
    return this.rules.size;
  }

  // Simple automation execution
  async executeRule(ruleId: string): Promise<void> {
    const rule = this.rules.get(ruleId);
    if (!rule || !rule.enabled) return;

    try {
      for (const action of rule.actions) {
        if (action.type === 'post_tweet') {
          await this.twitterService.postTweet(action.parameters.text);
        }
      }
      this.logger.info(`Executed rule: ${rule.name}`);
    } catch (error) {
      this.logger.error(`Failed to execute rule ${rule.name}:`, error);
    }
  }
} 