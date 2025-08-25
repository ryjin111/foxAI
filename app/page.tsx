'use client';

import { useState, useEffect } from 'react';
import { 
  PlayIcon, 
  StopIcon, 
  ChatBubbleLeftRightIcon,
  CogIcon,
  ChartBarIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface ElizaOSStatus {
  isActive: boolean;
  personality: {
    name: string;
    traits: string[];
    goals: string[];
  };
  state: {
    mood: string;
    energy: number;
    currentTask?: string;
    lastAction?: string;
  };
  plugins: Array<{
    id: string;
    name: string;
    isEnabled: boolean;
  }>;
  workflows: Array<{
    id: string;
    name: string;
    isActive: boolean;
    lastRun?: string;
  }>;
  recentMemories: Array<{
    id: string;
    timestamp: string;
    type: string;
    content: string;
  }>;
}

export default function Dashboard() {
  const [status, setStatus] = useState<ElizaOSStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const [sending, setSending] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_ELIZAOS_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/status`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    } finally {
      setLoading(false);
    }
  };

  const startElizaOS = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/start`, { method: 'POST' });
      if (response.ok) {
        await fetchStatus();
      }
    } catch (error) {
      console.error('Failed to start ElizaOS:', error);
    }
  };

  const stopElizaOS = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/stop`, { method: 'POST' });
      if (response.ok) {
        await fetchStatus();
      }
    } catch (error) {
      console.error('Failed to stop ElizaOS:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    setSending(true);
    const userMessage = message;
    setMessage('');
    
    // Add user message to chat
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    
    try {
      const response = await fetch(`${apiUrl}/api/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      
      if (response.ok) {
        const data = await response.json();
        setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fox-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gradient">🦊 FoxAI ElizaOS</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${status?.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {status?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Control Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Agent Status</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={startElizaOS}
                    disabled={status?.isActive}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <PlayIcon className="w-4 h-4" />
                    <span>Start</span>
                  </button>
                  <button
                    onClick={stopElizaOS}
                    disabled={!status?.isActive}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <StopIcon className="w-4 h-4" />
                    <span>Stop</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Current State</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mood:</span>
                      <span className="font-medium capitalize">{status?.state.mood}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Energy:</span>
                      <span className="font-medium">{status?.state.energy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Task:</span>
                      <span className="font-medium">{status?.state.currentTask || 'None'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Personality</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{status?.personality.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Traits:</span>
                      <span className="font-medium">{status?.personality.traits.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Goals:</span>
                      <span className="font-medium">{status?.personality.goals.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Chat with ElizaOS</h2>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto mb-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Start a conversation with ElizaOS</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chatHistory.map((msg, index) => (
                      <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.role === 'user' 
                            ? 'bg-fox-500 text-white' 
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {sending && (
                      <div className="flex justify-start">
                        <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fox-500 focus:border-transparent"
                  disabled={sending}
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim() || sending}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plugins Status */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <CogIcon className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Plugins</h2>
              </div>
              <div className="space-y-3">
                {status?.plugins.map((plugin) => (
                  <div key={plugin.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{plugin.name}</span>
                    <span className={plugin.isEnabled ? 'status-active' : 'status-inactive'}>
                      {plugin.isEnabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflows */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <ChartBarIcon className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Workflows</h2>
              </div>
              <div className="space-y-3">
                {status?.workflows.map((workflow) => (
                  <div key={workflow.id} className="border-b border-gray-100 pb-2 last:border-b-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{workflow.name}</span>
                      <span className={workflow.isActive ? 'status-active' : 'status-inactive'}>
                        {workflow.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {workflow.lastRun && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <ClockIcon className="w-3 h-3" />
                        <span>Last run: {new Date(workflow.lastRun).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Memories */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <BellIcon className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="space-y-3">
                {status?.recentMemories.slice(0, 5).map((memory) => (
                  <div key={memory.id} className="border-b border-gray-100 pb-2 last:border-b-0">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0 mt-1">
                        {memory.type === 'conversation' && <ChatBubbleLeftRightIcon className="w-4 h-4 text-blue-500" />}
                        {memory.type === 'action' && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
                        {memory.type === 'system' && <CogIcon className="w-4 h-4 text-gray-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{memory.content}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(memory.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 