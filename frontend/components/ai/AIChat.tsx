'use client';

import React, { useState } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, Check } from 'lucide-react';
import { api } from '@/services/api';
import { useCustomizerStore } from '@/store/customizerStore';
import { VoiceButton } from './VoiceButton';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Namaste! I am Astra, your atelier AI. Say things like "Black shirt bana do", "Isko oversized kar do", or ask for summer styling suggestions.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const { applyAIChanges } = useCustomizerStore();

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendAICommand(query);

      if (res.action === 'UPDATE_CUSTOMIZATION' && res.changes) {
        applyAIChanges(res.changes);
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.reply }
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Apologies, I encountered an error. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Black shirt bana do',
    'Isko oversized kar do',
    'White shirt with black buttons',
    'Summer ke liye kuch suggest karo'
  ];

  return (
    <>
      {/* Floating Orb Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-obsidian hover:bg-gold text-porcelain hover:text-obsidian p-3.5 rounded-full shadow-2xl border border-border-dark flex items-center gap-2 font-mono text-xs font-bold transition-all"
        title="Open Astra AI Concierge"
      >
        <Sparkles size={18} className="text-gold" />
        <span className="hidden sm:inline">ASTRA AI</span>
      </button>

      {/* Floating Panel */}
      {isOpen && (
        <div className="fixed bottom-[88px] right-4 z-50 w-96 max-w-[calc(100vw-32px)] h-[520px] max-h-[calc(100dvh-120px)] bg-porcelain rounded-2xl border border-border-light shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-obsidian text-porcelain flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                <Bot size={16} />
              </div>
              <div>
                <h4 className="font-headline font-bold text-xs tracking-wider">ASTRA CONCIERGE</h4>
                <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE ✦ GPT-ASTRA
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2 bg-alabaster border-b border-border-light flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 bg-porcelain hover:bg-gold/10 border border-border-light rounded-full text-[10px] font-mono whitespace-nowrap text-gray-700 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-vermillion text-porcelain rounded-br-none font-medium'
                      : 'bg-alabaster text-obsidian rounded-bl-none border border-border-light font-body'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-alabaster p-3 rounded-xl text-xs font-mono text-gray-500 border border-border-light flex items-center gap-2">
                  <Sparkles size={13} className="animate-spin text-gold" />
                  <span>Astra is calibrating tailoring...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Row */}
          <div className="p-3 bg-alabaster border-t border-border-light flex items-center gap-2">
            <VoiceButton
              onFeedback={(msg) => {
                setMessages((prev) => [...prev, { role: 'assistant', content: msg }]);
              }}
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="e.g. Black shirt bana do..."
              className="flex-1 px-3 py-2 bg-porcelain border border-border-light rounded-lg text-xs font-mono text-obsidian focus:outline-none focus:border-gold"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 bg-obsidian hover:bg-gold text-porcelain hover:text-obsidian rounded-lg transition-colors"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
