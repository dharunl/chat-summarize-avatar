
import React, { useState, useRef } from 'react';
import TextInput from './shared/TextInput';
import Button from './shared/Button';
import geminiApi from '@/lib/api';
import { toast } from 'sonner';
import avatarLipSync from '@/lib/avatarAnimation';

interface SummarizerProps {
  onSummaryGenerated?: (summary: string) => void;
}

const Summarizer = ({ onSummaryGenerated }: SummarizerProps) => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  
  const handleSummarize = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to summarize');
      return;
    }
    
    if (!geminiApi.getApiKey()) {
      toast.error('Please set your Gemini API key in settings first');
      return;
    }
    
    try {
      setIsLoading(true);
      const result = await geminiApi.summarize({ text: inputText });
      setSummary(result);
      
      if (onSummaryGenerated) {
        onSummaryGenerated(result);
      }
      
      toast.success('Text summarized successfully!');
    } catch (error) {
      console.error('Summarization error:', error);
      toast.error('Failed to summarize text. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="glass-panel p-6 w-full max-w-2xl mx-auto transform transition-all duration-300 hover:shadow-xl animate-fade-in">
      <div className="flex items-center mb-4">
        <span className="feature-chip mr-3">AI Summarizer</span>
        <h2 className="text-xl font-medium">Text Summarization</h2>
      </div>
      
      <TextInput
        label="Enter text to summarize"
        placeholder="Paste or type your long text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="min-h-32 mb-4"
        helperText="Enter any text, article, or notes to generate a concise summary."
        isLoading={isLoading}
      />
      
      <div className="flex justify-end mb-6">
        <Button
          onClick={handleSummarize}
          isLoading={isLoading}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"></path>
              <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
              <path d="M18 10h.01"></path>
              <path d="M18 14h.01"></path>
              <path d="M22 10v4"></path>
            </svg>
          }
        >
          Summarize
        </Button>
      </div>
      
      {summary && (
        <div 
          className="bg-accent p-4 rounded-lg mt-2 animate-fade-in"
          ref={summaryRef}
        >
          <h3 className="text-sm font-medium mb-2">Summary:</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground whitespace-pre-line">{summary}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Summarizer;
