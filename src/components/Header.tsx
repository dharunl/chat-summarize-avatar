
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Button from './shared/Button';
import geminiApi from '@/lib/api';
import { toast } from 'sonner';

const Header = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(geminiApi.getApiKey() || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveApiKey = () => {
    try {
      setIsSaving(true);
      
      if (!apiKey.trim()) {
        toast.error('Please enter a valid API key');
        return;
      }
      
      geminiApi.setApiKey(apiKey.trim());
      toast.success('API key saved successfully');
      setIsSettingsOpen(false);
    } catch (error) {
      toast.error('Failed to save API key');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <header className="w-full py-6 px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <h1 className="text-xl font-semibold">
            <span className="text-gradient">Gemini</span> Hub
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="relative"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span className="ml-2">Settings</span>
            
            {/* Settings Dropdown */}
            <div 
              className={cn(
                "absolute right-0 top-full mt-2 w-80 p-4 glass-panel z-50 transform transition-all duration-200 ease-in-out",
                isSettingsOpen 
                  ? "translate-y-0 opacity-100 pointer-events-auto" 
                  : "translate-y-2 opacity-0 pointer-events-none"
              )}
            >
              <h3 className="text-sm font-medium mb-3">API Settings</h3>
              <div className="mb-4">
                <label className="block text-xs text-muted-foreground mb-1">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your Gemini API key"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Your API key is stored only in your browser's local storage.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleSaveApiKey}
                  isLoading={isSaving}
                >
                  Save
                </Button>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
