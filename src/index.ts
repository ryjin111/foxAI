import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ElizaOS } from './elizaos/core';
import { TwitterPlugin } from './elizaos/plugins/twitter';
import { CryptoPlugin } from './elizaos/plugins/crypto';
import { Logger } from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const logger = new Logger('Main');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize ElizaOS
const elizaOS = new ElizaOS();

// Initialize plugins
const twitterConfig = {
  apiKey: process.env.TWITTER_API_KEY || '',
  apiSecret: process.env.TWITTER_API_SECRET || '',
  accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || '',
  bearerToken: process.env.TWITTER_BEARER_TOKEN || ''
};

const twitterPlugin = new TwitterPlugin(twitterConfig);
const cryptoPlugin = new CryptoPlugin(process.env.HYPERLIQUID_API_URL);

// Register plugins
elizaOS.registerPlugin(twitterPlugin);
elizaOS.registerPlugin(cryptoPlugin);

// API Routes
app.get('/api/status', async (req, res) => {
  try {
    const status = elizaOS.getStatus();
    res.json(status);
  } catch (error) {
    logger.error('Error getting status:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
});

app.post('/api/start', async (req, res) => {
  try {
    await elizaOS.start();
    res.json({ success: true, message: 'ElizaOS started successfully' });
  } catch (error) {
    logger.error('Error starting ElizaOS:', error);
    res.status(500).json({ error: 'Failed to start ElizaOS' });
  }
});

app.post('/api/stop', async (req, res) => {
  try {
    await elizaOS.stop();
    res.json({ success: true, message: 'ElizaOS stopped successfully' });
  } catch (error) {
    logger.error('Error stopping ElizaOS:', error);
    res.status(500).json({ error: 'Failed to stop ElizaOS' });
  }
});

app.post('/api/message', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await elizaOS.processMessage(message);
    res.json({ success: true, response });
  } catch (error) {
    logger.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

app.post('/api/execute', async (req, res) => {
  try {
    const { pluginId, action, params } = req.body;
    if (!pluginId || !action) {
      return res.status(400).json({ error: 'Plugin ID and action are required' });
    }

    const result = await elizaOS.executePlugin(pluginId, action, params);
    res.json({ success: true, result });
  } catch (error) {
    logger.error('Error executing plugin:', error);
    res.status(500).json({ error: 'Failed to execute plugin' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  logger.info(`ElizaOS server running on port ${port}`);
  logger.info('Available endpoints:');
  logger.info('  GET  /api/status - Get ElizaOS status');
  logger.info('  POST /api/start - Start ElizaOS');
  logger.info('  POST /api/stop - Stop ElizaOS');
  logger.info('  POST /api/message - Send message to ElizaOS');
  logger.info('  POST /api/execute - Execute plugin action');
  logger.info('  GET  /health - Health check');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down ElizaOS...');
  await elizaOS.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down ElizaOS...');
  await elizaOS.stop();
  process.exit(0);
}); 