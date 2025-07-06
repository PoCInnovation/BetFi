import { useState } from 'react';

interface AIResponse {
  message: string;
  suggestions?: string[];
  error?: string;
  isStreaming?: boolean;
}

export const useAIService = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingResponse, setStreamingResponse] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const sendMessage = async (message: string, onStream?: (text: string) => void): Promise<AIResponse> => {
    setIsLoading(true);
    setError(null);
    setStreamingResponse('');
    setIsStreaming(true);
    
    try {
      // Use Gemini model with simulated streaming
      const response = await callGemini(message);
      
      // Simulate streaming the response
      if (response.message && onStream) {
        // Ensure long words are properly broken
        const formattedMessage = response.message.replace(/(\S{30,})/g, (match) => {
          // Add zero-width spaces to allow breaking of very long words/URLs
          return match.replace(/(.{15})/g, '$1\u200B');
        });
        await simulateStreamingText(formattedMessage, onStream);
      }
      
      return {
        ...response,
        isStreaming: false
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error in sendMessage:', errorMessage);
      
      // Use fallback response instead of returning an empty message
      const fallbackMessage = getFallbackResponse(message);
      
      // Still simulate streaming for the fallback message
      if (onStream) {
        await simulateStreamingText(fallbackMessage, onStream);
      }
      
      return {
        message: fallbackMessage,
        suggestions: generateSuggestions(message),
        error: errorMessage,
        isStreaming: false
      };
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };
  
  // Helper function to simulate streaming text
  const simulateStreamingText = async (text: string, onStream: (text: string) => void) => {
    // Split into chunks (could be words, sentences, or smaller chunks for more granular control)
    const chunks = text.match(/[^.!?]+[.!?]|\S+|\s+/g) || [];
    let currentText = '';
    
    for (const chunk of chunks) {
      currentText += chunk;
      setStreamingResponse(currentText);
      onStream(currentText);
      
      // More sophisticated random delay that's longer after punctuation
      const hasPunctuation = /[.!?,]$/.test(chunk);
      const baseDelay = hasPunctuation ? 100 : 20;
      const randomFactor = hasPunctuation ? 50 : 20;
      
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * randomFactor) + baseDelay));
    }
    
    return currentText;
  };

  return {
    sendMessage,
    isLoading,
    error,
    streamingResponse,
    isStreaming,
  };
};

// Gemini API implementation
const callGemini = async (message: string): Promise<AIResponse> => {
  // Use the API key from environment variables, with fallback to the provided key
  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyCqy6Riultj9Ah1nrOoIh8veovd9-qHjqE';
  
  try {
    // Use a valid model name with apiVersion
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user", 
            parts: [
              {
                text: message
              }
            ]
          }
        ],
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          }
        ],
        systemInstruction: {
          parts: [
            {
              text: "You are a helpful assistant for a DeFi betting platform called BetFi. Provide helpful, concise responses about DeFi strategies, betting, and crypto."
            }
          ]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
          topK: 40,
          topP: 0.95
        }
      })
    });
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API error response:', data);
      throw new Error(data.error?.message || `Error calling Gemini API: ${response.status}`);
    }
    
    // Log the response for debugging
    console.log('Gemini API response:', data);
    
    // Extract the response from Gemini's response format
    let geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    // If we still don't get a response, use mock response
    if (!geminiText) {
      console.warn("No response content from Gemini, using fallback response");
      geminiText = getFallbackResponse(message);
    }
    
    return {
      message: geminiText,
      suggestions: generateSuggestions(message)
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Instead of retrying with an alternative model, use fallback response
    console.log('Using fallback response instead of retrying');
    return {
      message: getFallbackResponse(message),
      suggestions: generateSuggestions(message)
    };
  }
};

// Removed retry with alternative model function as we're using fallbacks instead

// Fallback response in case Gemini doesn't respond
const getFallbackResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! Welcome to BetFi. How can I help you with DeFi strategies or betting today?";
  }
  
  if (lowerMessage.includes('strategy')) {
    return "In BetFi, a strategy is a well-defined plan to achieve specific financial goals through DeFi betting. Strategies can include parameters like risk level, target returns, timeframe, and the specific assets or markets you're focusing on. Would you like me to explain some popular strategies?";
  }
  
  if (lowerMessage.includes('risk')) {
    return "Risk management is crucial in DeFi betting. You can minimize risks by: 1) Diversifying across multiple strategies, 2) Setting appropriate stop losses, 3) Starting with smaller amounts, and 4) Choosing traders with high reputation scores. What specific aspect of risk management would you like to learn more about?";
  }
  
  if (lowerMessage.includes('bet') || lowerMessage.includes('betting')) {
    return "BetFi enables you to participate in DeFi betting markets where you can place bets on various outcomes in crypto markets. These can range from price movements to protocol performance metrics. Would you like to learn how to place your first bet?";
  }
  
  return "I'm here to help you with any questions about BetFi's DeFi strategies and betting options. You can ask about specific strategies, risk management, portfolio analytics, or how to get started.";
};

// Helper function to generate contextual suggestions
const generateSuggestions = (message: string): string[] => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('strategy')) {
    return ['How to create a strategy?', 'What are the best strategies?', 'Strategy risks explained'];
  }
  
  if (lowerMessage.includes('bet') || lowerMessage.includes('betting')) {
    return ['How to place a bet?', 'What are the odds?', 'Bet risks explained'];
  }
  
  if (lowerMessage.includes('defi') || lowerMessage.includes('finance')) {
    return ['DeFi basics', 'BetFi vs traditional betting', 'DeFi risks'];
  }
  
  // Default suggestions
  return ['Tell me about BetFi', 'How to get started?', 'Popular strategies'];
};
