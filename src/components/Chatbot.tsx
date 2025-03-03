
import React, { useState, useRef, useEffect } from 'react';
import Button from './shared/Button';
import geminiApi from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotProps {
  onMessageReceived?: (message: string) => void;
}

const Chatbot = ({ onMessageReceived }: ChatbotProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    if (!geminiApi.getApiKey()) {
      toast.error('Please set your Gemini API key in settings first');
      return;
    }
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    try {
      setIsLoading(true);
      
      // Convert messages to history format expected by API
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const response = await geminiApi.sendChatMessage({
        message: inputMessage,
        history
      });
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (onMessageReceived) {
        onMessageReceived(response);
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get a response. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
      
      // Focus input for next message
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return (
    <div className="glass-panel w-full max-w-2xl mx-auto h-[500px] flex flex-col transform transition-all duration-300 hover:shadow-xl animate-fade-in">
      <div className="p-4 border-b border-border">
        <div className="flex items-center">
          <span className="feature-chip mr-3">AI Assistant</span>
          <h2 className="text-xl font-medium">Chat with AI</h2>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-center p-6 animate-pulse-slow">
            <div>
              <p className="mb-2 font-medium">Start a conversation with the AI</p>
              <p className="text-sm">Ask questions, get explanations, or just chat!</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index}
              className={cn(
                "flex items-start max-w-[85%] animate-fade-in",
                message.role === 'user' ? 'ml-auto' : 'mr-auto'
              )}
            >
              <div 
                className={cn(
                  "rounded-lg p-3",
                  message.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-secondary text-foreground rounded-tl-none'
                )}
              >
                <p className="whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-start max-w-[85%] mr-auto animate-fade-in">
            <div className="rounded-lg p-3 bg-secondary text-foreground rounded-tl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-primary/80 animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            isLoading={isLoading}
            disabled={!inputMessage.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
