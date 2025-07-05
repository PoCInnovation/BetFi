"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, MessageCircle, Move } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI trading advisor. Ask me about strategies, risks, or get personalized recommendations!",
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('bet') || lowerMessage.includes('recommend') || lowerMessage.includes('strategy')) {
      return "Based on current market analysis:\n\n• **SafeTrader**: Excellent reputation (95/100) with conservative approach\n• **TechAnalyst**: Strong performance (+9.8%) with solid technical analysis\n• **DefiMaster**: DeFi arbitrage with controlled risk\n\nI recommend diversifying and starting with smaller amounts.";
    }
    
    if (lowerMessage.includes('risk') || lowerMessage.includes('safe')) {
      return "To minimize risks:\n\n• Choose traders with high reputation (>90/100)\n• Diversify across multiple strategies\n• Start with small amounts\n• Avoid strategies promising >20% returns\n• Check trader history before betting";
    }
    
    if (lowerMessage.includes('best') || lowerMessage.includes('top')) {
      return "Top performing strategies right now:\n\n• **TechAnalyst**: +9.8% current return\n• **SafeTrader**: +4.8% with low risk\n• **CryptoWizard**: +8.5% but higher risk\n\nKey factors: trader reputation, current performance, and time remaining.";
    }
    
    return "I can help you analyze available strategies, assess risks, and provide personalized recommendations. What specific aspect of trading strategies would you like to know about?";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
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
            "crypto-card border-2 border-primary/20 shadow-2xl h-full flex flex-col",
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
            
            <CardContent className="p-0 flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] p-3 rounded-2xl text-sm",
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-primary to-red-500 text-white ml-4'
                          : 'bg-muted text-foreground mr-4'
                      )}
                    >
                      <div className="whitespace-pre-line">{message.content}</div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
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
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-card/50">
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
