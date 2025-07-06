"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, MessageCircle, Move } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAIService } from "@/services/ai-service";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface Position {
  x: number;
  y: number;
}

// Maximum number of messages to keep in the chat history
// When this limit is reached, older messages will fade out and disappear
// Setting to 6 (3 exchanges) for better UX with limited space
const MAX_MESSAGES = 6;

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  // Position par défaut - initialisée après le montage
  const [position, setPosition] = useState<Position>({ x: 24, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI trading advisor. Ask me about strategies, risks, or get personalized recommendations!",
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>(['Tell me about strategies', 'How do I start?', 'Explain risks']);
  
  // Use our AI service hook
  const { sendMessage, isLoading, error } = useAIService();
  
  // Display error in console if any
  useEffect(() => {
    if (error) {
      console.error("AI Service Error:", error);
    }
  }, [error]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    const userInput = inputValue;
    // Strictly enforce the message limit when adding new messages
    // This ensures messages stay below the search bar by removing older ones
    
    // First, check if we need to remove messages to stay under limit
    // We'll need to accommodate both the user message and the upcoming AI response
    const needToRemove = messages.length + 2 > MAX_MESSAGES;
    const removeCount = needToRemove ? messages.length + 2 - MAX_MESSAGES : 0;
    
    // Add the user message, potentially removing old messages
    setMessages(prev => {
      const filtered = removeCount > 0 ? prev.slice(removeCount) : prev;
      return [...filtered, userMessage];
    });
    
    setInputValue("");
    
    // Create a placeholder for the streaming message
    const streamingId = (Date.now() + 1).toString();
    const streamingMessage: Message = {
      id: streamingId,
      type: 'ai',
      content: '',
      timestamp: new Date().toISOString(),
    };
    
    // Add the AI message placeholder, which should always fit now
    setMessages(prev => [...prev, streamingMessage]);
    
    try {
      // Call our AI service with streaming callback
      const aiResponse = await sendMessage(userInput, (streamText) => {
        // Update the streaming message in place
        setMessages(prev => 
          prev.map(msg => 
            msg.id === streamingId ? { ...msg, content: streamText } : msg
          )
        );
      });
      
      // Update suggestions from AI response
      if (aiResponse.suggestions && aiResponse.suggestions.length > 0) {
        setSuggestions(aiResponse.suggestions);
        console.log("Updated suggestions:", aiResponse.suggestions);
      }
      
      // If there was an error but we still got a response (using fallback)
      if (aiResponse.error) {
        console.warn("AI responded with fallback due to error:", aiResponse.error);
      }
    } catch (err) {
      console.error("Error getting AI response:", err);
      
      // This should rarely happen now since our AI service handles errors internally
      // and provides fallback responses, but keeping as an extra safety measure
      setMessages(prev => 
        prev.map(msg => 
          msg.id === streamingId 
            ? { ...msg, content: "Sorry, I'm having trouble responding right now. Please try again later." } 
            : msg
        )
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Fonctions d'animation optimisées
  const openChatbot = () => {
    if (!hasDragged && !isAnimating) {
      setIsAnimating(true);
      setIsOpen(true);
      setTimeout(() => setIsAnimating(false), 200);
    }
  };

  const closeChatbot = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsOpen(false);
      setTimeout(() => setIsAnimating(false), 150);
    }
  };

  // Fonctions de drag & drop optimisées
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (chatbotRef.current) {
      const rect = chatbotRef.current.getBoundingClientRect();
      setIsDragging(true);
      setHasDragged(false);
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Marquer qu'il y a eu un drag si mouvement significatif (plus de 5px)
      const currentPos = position;
      if (Math.abs(newX - currentPos.x) > 5 || Math.abs(newY - currentPos.y) > 5) {
        setHasDragged(true);
      }
      
      // Contraintes optimisées
      const width = isOpen ? 500 : 56;
      const height = isOpen ? 600 : 56;
      const maxX = window.innerWidth - width;
      const maxY = window.innerHeight - height;
      
      const constrainedX = Math.max(0, Math.min(newX, maxX));
      const constrainedY = Math.max(0, Math.min(newY, maxY));
      
      // Mise à jour directe du DOM pour éviter les re-renders
      if (chatbotRef.current) {
        chatbotRef.current.style.transform = `translate(${constrainedX}px, ${constrainedY}px)`;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Mettre à jour le state seulement à la fin
      if (chatbotRef.current) {
        const transform = chatbotRef.current.style.transform;
        const matches = transform.match(/translate\((-?\d+(?:\.\d+)?)px, (-?\d+(?:\.\d+)?)px\)/);
        if (matches) {
          setPosition({
            x: parseFloat(matches[1]),
            y: parseFloat(matches[2])
          });
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset.x, dragOffset.y, isOpen]);

  // Auto-scroll to bottom when messages change and manage message limit
  useEffect(() => {
    // Auto-scroll to bottom - force immediate scroll for best user experience
    if (messagesEndRef.current) {
      // Using scrollIntoView with behavior: 'auto' for immediate scrolling
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
    
    // Strictly enforce the message limit with each message change
    if (messages.length > MAX_MESSAGES) {
      // Immediately remove excess messages - no delay
      setMessages(prev => prev.slice(prev.length - MAX_MESSAGES));
    }
  }, [messages]);

  // Position initiale et ajustements
  useEffect(() => {
    // Définir la position initiale en bas à droite après le montage
    const updatePosition = () => {
      const width = isOpen ? 500 : 56;
      const height = isOpen ? 600 : 56;
      
      setPosition(prev => {
        // Si c'est la première fois ou si on dépasse les limites, repositionner
        const maxX = window.innerWidth - width - 24; // 24px de marge
        const maxY = window.innerHeight - height - 24;
        
        return {
          x: Math.min(prev.x, maxX),
          y: Math.min(prev.y, maxY),
        };
      });
    };

    updatePosition();

    // Gérer le redimensionnement de la fenêtre
    const handleResize = () => updatePosition();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Montage du composant et position initiale
  useEffect(() => {
    setIsMounted(true);
    // Définir la position initiale en bas à droite
    const initializePosition = () => {
      setPosition({
        x: window.innerWidth - 80, // 56px bouton + 24px marge
        y: window.innerHeight - 80
      });
    };
    
    initializePosition();
  }, []);

  // Fonction pour repositionner en bas à droite
  const repositionToBottomRight = () => {
    if (!isMounted) return;
    
    const width = isOpen ? 500 : 56;
    const newPosition = {
      x: window.innerWidth - width - 24,
      y: window.innerHeight - (isOpen ? 600 : 56) - 24
    };
    setPosition(newPosition);
    
    // Mise à jour immédiate du DOM pour animation fluide
    if (chatbotRef.current) {
      chatbotRef.current.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;
    }
  };

  // Repositionner lors de la fermeture
  useEffect(() => {
    if (!isOpen) {
      repositionToBottomRight();
    }
  }, [isOpen]);

  // Ne pas rendre avant le montage pour éviter l'hydratation mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div
      ref={chatbotRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: 50,
      }}
      className={cn(
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
    >
      {!isOpen ? (
        /* Toggle Button */
        <Button
          ref={buttonRef}
          onClick={openChatbot}
          onMouseDown={handleMouseDown}
          className={cn(
            "h-14 w-14 rounded-full shadow-2xl transition-all duration-100 ease-out",
            "bg-primary/80 hover:bg-primary",
            "border-2 border-primary/30 hover:scale-110 active:scale-95",
            "hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:rotate-12",
            isDragging ? "scale-110 shadow-3xl" : "",
            isAnimating ? "animate-pulse" : ""
          )}
        >
          <MessageCircle className={cn(
            "h-6 w-6 text-white transition-transform duration-300",
            isAnimating ? "scale-0" : "scale-100"
          )} />
        </Button>
      ) : (
        /* Chatbot Panel */
        <div 
          className={cn(
            "w-[500px] h-[600px] transition-all duration-200 ease-out",
            isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"
          )}
        >
          <Card className={cn(
            "crypto-card border-2 border-primary/20 shadow-2xl h-full flex flex-col overflow-hidden",
            "transition-all duration-200 ease-out"
          )}>
            <CardHeader 
              className="pb-3 cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
            >
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span className="bg-foreground bg-clip-text text-transparent">
                    AI Strategy Advisor
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Move className="h-4 w-4 text-muted-foreground" />
                  <Button
                    onClick={closeChatbot}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-destructive/20 hover:scale-110 transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0 flex-1 flex flex-col overflow-hidden relative">
              {/* Messages container with auto overflow and fixed height */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-0 space-y-4 relative max-h-[calc(100%-140px)] scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                {/* Stronger top fade effect - using sticky to ensure it stays at top during scroll */}
                <div className="sticky top-0 left-0 right-0 h-16 bg-gradient-to-b from-card to-transparent z-10 pointer-events-none -mt-4 mb-[-16px]"></div>
                
                {/* Bottom shadow to indicate scroll area - using sticky to ensure it stays at bottom during scroll */}
                <div className="sticky bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card via-card/80 to-transparent z-10 pointer-events-none mt-[-8px]"></div>
                
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex transition-all duration-300",
                      message.type === 'user' ? 'justify-end' : 'justify-start',
                      // Simplified animations - just fade new messages in
                      index === messages.length - 1 
                        ? 'animate-in fade-in-0 slide-in-from-bottom-3 duration-300' 
                        : ''
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] p-3 rounded-2xl text-sm break-words",
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-primary to-red-500 text-white ml-4'
                          : 'bg-muted text-foreground mr-4'
                      )}
                    >
                      <div className="whitespace-pre-line overflow-hidden">
                        {message.content}
                        {/* Show cursor at the end when streaming */}
                        {message.type === 'ai' && isLoading && message.id === messages[messages.length - 1]?.id && (
                          <span className="ml-1 inline-block w-2 h-4 bg-primary animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && messages[messages.length - 1]?.type !== 'ai' && (
                  <div className="flex justify-start animate-in slide-in-from-bottom-2 fade-in-0 duration-300">
                    <div className="bg-muted text-foreground max-w-[85%] p-3 rounded-2xl mr-4 animate-pulse">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-muted-foreground">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                {/* Scroll anchor with enough height to ensure proper scrolling past the fade */}
                <div ref={messagesEndRef} className="h-10 mb-4" />
              </div>

              {/* Input - fixed height for consistent layout with shadow overlay */}
              <div className="p-4 pt-2 border-t border-border bg-card/90 mt-auto relative z-20">
                {/* Suggestion buttons */}
                {messages.length > 0 && messages[messages.length - 1].type === 'ai' && !isLoading && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs py-1 px-2 h-auto bg-muted/40 hover:bg-muted/80 border-primary/20 text-muted-foreground hover:text-foreground transition-all"
                        onClick={() => {
                          setInputValue(suggestion);
                          // Optional: auto-send after a short delay
                          setTimeout(() => {
                            handleSendMessage();
                          }, 100);
                        }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about strategies..."
                    className="flex-1 bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-100"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={isLoading || !inputValue.trim()}
                    className={cn(
                      "bg-primary/80 hover:bg-primary",
                      "rounded-full transition-all duration-100 hover:scale-110 active:scale-95",
                      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    )}
                  >
                    <Send className={cn(
                      "h-4 w-4 transition-transform duration-100",
                      isLoading ? "animate-spin" : "group-hover:translate-x-0.5"
                    )} />
                  </Button>
                </div>
              </div>    
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;
