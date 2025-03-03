
import { useState } from 'react';
import Header from '@/components/Header';
import Summarizer from '@/components/Summarizer';
import Chatbot from '@/components/Chatbot';
import Avatar from '@/components/Avatar';
import { cn } from '@/lib/utils';

const Index = () => {
  const [currentTab, setCurrentTab] = useState<'summarize' | 'chat'>('summarize');
  const [avatarText, setAvatarText] = useState<string>('');
  const [isAvatarTalking, setIsAvatarTalking] = useState(false);
  
  const handleSummaryGenerated = (summary: string) => {
    setAvatarText(summary);
    setIsAvatarTalking(true);
    
    // Stop avatar talking after a reasonable time
    const wordsCount = summary.split(' ').length;
    const talkingTime = Math.min(wordsCount * 200, 10000); // ~200ms per word, max 10 seconds
    
    setTimeout(() => {
      setIsAvatarTalking(false);
    }, talkingTime);
  };
  
  const handleChatMessageReceived = (message: string) => {
    setAvatarText(message);
    setIsAvatarTalking(true);
    
    // Stop avatar talking after a reasonable time
    const wordsCount = message.split(' ').length;
    const talkingTime = Math.min(wordsCount * 200, 10000); // ~200ms per word, max 10 seconds
    
    setTimeout(() => {
      setIsAvatarTalking(false);
    }, talkingTime);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-2">
            Gemini-Powered <span className="text-gradient">AI Assistant</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Summarize text, chat with AI, and watch your responses come to life with our lip-syncing avatar.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="lg:order-2 flex justify-center">
            <div className="glass-panel p-6 w-full max-w-md h-[500px] flex flex-col items-center justify-center transform transition-all duration-300 hover:shadow-xl animate-fade-in">
              <div className="flex items-center mb-4">
                <span className="feature-chip mr-3">AI Avatar</span>
                <h2 className="text-xl font-medium">Lip-Sync Animation</h2>
              </div>
              
              <div className="flex-1 flex items-center justify-center w-full">
                <Avatar 
                  text={avatarText} 
                  isAnimating={isAvatarTalking}
                />
              </div>
            </div>
          </div>
          
          <div className="lg:order-1">
            <div className="mb-6 flex justify-center">
              <div className="inline-flex rounded-md border border-border p-1">
                <button
                  className={cn(
                    "inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
                    currentTab === 'summarize' 
                      ? "bg-primary text-white shadow-sm" 
                      : "hover:bg-muted"
                  )}
                  onClick={() => setCurrentTab('summarize')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                    <path d="M9 9l1 0"></path>
                    <path d="M9 13l6 0"></path>
                    <path d="M9 17l6 0"></path>
                  </svg>
                  Summarizer
                </button>
                <button
                  className={cn(
                    "inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
                    currentTab === 'chat' 
                      ? "bg-primary text-white shadow-sm" 
                      : "hover:bg-muted"
                  )}
                  onClick={() => setCurrentTab('chat')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M14 9a2 2 0 0 1 -2 2h-7"></path>
                    <path d="M13 13a2 2 0 0 1 -2 2h-7"></path>
                    <path d="M13 5a2 2 0 0 1 -2 2h-7"></path>
                    <path d="M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                    <path d="M17 17v.01"></path>
                  </svg>
                  Chatbot
                </button>
              </div>
            </div>
            
            <div className="transition-all duration-500 ease-in-out">
              <div className={cn(
                "transition-opacity duration-500", 
                currentTab === 'summarize' ? 'opacity-100' : 'opacity-0 hidden'
              )}>
                <Summarizer onSummaryGenerated={handleSummaryGenerated} />
              </div>
              
              <div className={cn(
                "transition-opacity duration-500", 
                currentTab === 'chat' ? 'opacity-100' : 'opacity-0 hidden'
              )}>
                <Chatbot onMessageReceived={handleChatMessageReceived} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
