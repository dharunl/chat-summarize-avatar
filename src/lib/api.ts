
// This is a simplified API client for Gemini API
// In a real application, you should move API keys to server-side
// or use proper authentication mechanisms

interface ApiOptions {
  apiKey?: string;
}

interface SummarizeParams {
  text: string;
  maxLength?: number;
}

interface ChatMessageParams {
  message: string;
  history?: Array<{role: string, content: string}>;
}

class GeminiApiClient {
  private apiKey: string | null = null;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  
  constructor(options?: ApiOptions) {
    if (options?.apiKey) {
      this.apiKey = options.apiKey;
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('gemini_api_key', apiKey);
  }

  getApiKey(): string | null {
    if (!this.apiKey) {
      const storedKey = localStorage.getItem('gemini_api_key');
      if (storedKey) {
        this.apiKey = storedKey;
      }
    }
    return this.apiKey;
  }
  
  async summarize({ text, maxLength = 200 }: SummarizeParams): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API key not set');
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Please provide a concise summary of the following text, aiming for a length of around ${maxLength} characters:\n\n${text}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 800,
            topP: 0.8,
            topK: 40
          }
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to summarize text');
      }
      
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Summarization error:', error);
      throw error;
    }
  }
  
  async sendChatMessage({ message, history = [] }: ChatMessageParams): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API key not set');
    }
    
    try {
      // Convert history to Gemini format
      const formattedHistory = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      
      // Add current message
      const contents = [
        ...formattedHistory,
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ];
      
      const response = await fetch(`${this.baseUrl}/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
            topP: 0.9,
            topK: 40
          }
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get chat response');
      }
      
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const geminiApi = new GeminiApiClient();
export default geminiApi;
