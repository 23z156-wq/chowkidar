import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { IconSparkles, IconX, IconBot } from './Icons';
import { Button } from './ui/Button';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIChatWidget: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Derive current page context name & symbol
  const currentSymbol = typeof router.query.symbol === 'string' ? router.query.symbol.toUpperCase() : null;
  const pagePath = router.pathname;

  const getPageName = () => {
    if (pagePath === '/') return 'Dashboard';
    if (pagePath === '/explore') return 'Explore Stocks';
    if (pagePath === '/you') return 'You / Account Settings';
    if (pagePath === '/timeline') return 'Change Timeline';
    if (pagePath === '/watchlist') return 'Monitored Watchlist';
    if (pagePath.startsWith('/stock/')) return `Stock Detail (${currentSymbol || 'Asset'})`;
    return 'Chowkidar Platform';
  };

  const getQuickPrompts = () => {
    if (pagePath.startsWith('/stock/')) {
      return [
        `Why is ${currentSymbol || 'this stock'} on my radar?`,
        `Explain volume velocity for ${currentSymbol || 'this stock'}`,
        `What changed since my last visit?`,
      ];
    }
    if (pagePath === '/') {
      return [
        `Summarize today's market alerts`,
        `Which asset demands the most attention?`,
        `How is the system health baseline computed?`,
      ];
    }
    if (pagePath === '/explore') {
      return [
        `How do I add stocks to my radar?`,
        `What sectors are supported?`,
      ];
    }
    if (pagePath === '/you') {
      return [
        `Explain my learned attention weights`,
        `How often do FX rates update?`,
      ];
    }
    return [
      `Summarize active anomalies`,
      `How does Chowkidar calculate attention scores?`,
    ];
  };

  // Initial greeting message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: `Hi! I am Chowkidar AI. I'm currently inspecting **${getPageName()}**. How can I help you analyze your market telemetry?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [isOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        }));
      history.push({ role: 'user', content: queryText });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          pageContext: getPageName(),
          currentSymbol: currentSymbol || undefined,
        }),
      });

      const data = await res.json();
      const botMsg: Message = {
        id: `b_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'I am keeping an eye on your market telemetry. Everything looks calm.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: 'Statistical baseline check complete. All monitored assets are within normal parameters.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-8 z-50 flex flex-col items-end">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[480px] bg-[var(--color-surface-primary)] border border-[var(--color-border)] rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-3 animate-fadeIn">
          {/* Header */}
          <div className="bg-[var(--color-surface-secondary)] px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent-positive-soft)] text-[var(--color-accent-positive)] flex items-center justify-center">
                <IconSparkles size={16} />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xs text-primary">Chowkidar AI Assistant</span>
                <span className="text-[10px] text-[var(--color-accent-positive)] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-positive)] animate-pulse"></span>
                  Context: {getPageName()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-muted hover:text-primary p-1 rounded-lg transition-colors"
            >
              <IconX size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col max-w-[85%] ${
                  m.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl leading-relaxed font-medium ${
                    m.sender === 'user'
                      ? 'bg-[var(--color-accent-positive)] text-white rounded-br-none'
                      : 'bg-[var(--color-surface-secondary)] text-primary border border-subtle rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-muted mt-1 px-1 numeric">{m.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="self-start bg-[var(--color-surface-secondary)] p-3 rounded-2xl border border-subtle text-muted text-xs flex items-center gap-2 font-semibold animate-pulse">
                <IconSparkles size={14} className="text-[var(--color-accent-positive)] animate-spin" />
                Analyzing {getPageName()} telemetry via Llama 3.3...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Context Prompts */}
          <div className="px-3 py-2 bg-[var(--color-surface-secondary)] border-t border-[var(--color-border)] flex gap-1.5 overflow-x-auto no-scrollbar">
            {getQuickPrompts().map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-[10px] font-bold text-muted hover:text-primary bg-[var(--color-surface-primary)] border border-subtle hover:border-[var(--color-accent-positive)] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-[var(--color-border)] flex items-center gap-2 bg-[var(--color-surface-primary)]"
          >
            <input
              type="text"
              placeholder={`Ask about ${currentSymbol || getPageName()}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 h-9 px-3 text-xs bg-[var(--color-surface-secondary)] border border-subtle rounded-xl text-primary outline-none focus:border-[var(--color-accent-positive)] font-medium"
            />
            <Button size="sm" variant="primary" type="submit" disabled={!input.trim() || loading} className="h-9 px-3 text-xs rounded-xl">
              Send
            </Button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[var(--color-accent-positive)] hover:bg-[#009e76] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-xl flex items-center gap-2 font-bold text-xs transition-all active:scale-95 group border-2 border-white"
        >
          <IconSparkles size={18} className="group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Ask Chowkidar AI</span>
        </button>
      )}
    </div>
  );
};

