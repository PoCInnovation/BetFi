"use client";

import { useState } from "react";
import { Send, Bot, User, Star, TrendingUp, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockStrategies } from "@/lib/mock-data";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  recommendations?: typeof mockStrategies;
}

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Welcome! I'm your AI trading advisor. Ask me questions like 'What should I bet on?' or 'Which strategies have the highest alpha?'",
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateAIResponse = (userMessage: string): { content: string; recommendations?: typeof mockStrategies } => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('parier') || lowerMessage.includes('recommand') || lowerMessage.includes('conseil')) {
      return {
        content: "Basé sur l'analyse des données actuelles, voici mes recommandations :\n\n• **SafeTrader** : Excellente réputation (95/100) avec une stratégie conservative, idéal pour les débutants\n• **TechAnalyst** : Bon rendement actuel (+9.8%) avec une analyse technique solide\n• **DefiMaster** : Stratégie d'arbitrage DeFi avec un risque contrôlé\n\nJe recommande de diversifier vos paris et de commencer avec des montants plus petits.",
        recommendations: mockStrategies.filter(s => ['SafeTrader', 'TechAnalyst', 'DefiMaster'].includes(s.trader))
      };
    }
    
    if (lowerMessage.includes('risque') || lowerMessage.includes('sécur')) {
      return {
        content: "Pour minimiser les risques :\n\n• Privilégiez les traders avec une réputation élevée (>90/100)\n• Diversifiez vos paris sur plusieurs stratégies\n• Commencez avec des montants faibles\n• Évitez les stratégies à très haut rendement promis (>20%)\n• Analysez l'historique du trader avant de parier",
        recommendations: mockStrategies.filter(s => s.risk === 'low' || s.traderReputation > 90)
      };
    }
    
    if (lowerMessage.includes('meilleur') || lowerMessage.includes('top')) {
      return {
        content: "Les meilleures stratégies actuellement :\n\n• **TechAnalyst** : +9.8% de rendement actuel, proche de son objectif\n• **SafeTrader** : +4.8% avec un risque très faible\n• **CryptoWizard** : +8.5% mais plus risqué\n\nLes critères importants : réputation du trader, rendement actuel, et temps restant.",
        recommendations: mockStrategies.filter(s => s.currentReturn > 0).sort((a, b) => b.currentReturn - a.currentReturn)
      };
    }
    
    return {
      content: "Je peux vous aider à analyser les stratégies disponibles, évaluer les risques, et vous donner des recommandations personnalisées. Que souhaitez-vous savoir spécifiquement sur les stratégies de trading ?"
    };
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

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date().toISOString(),
        recommendations: aiResponse.recommendations,
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            AI Strategy Advisor
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get personalized recommendations powered by advanced on-chain analytics and market intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span>Chat avec l'IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {message.type === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                          <span className="text-sm font-medium">
                            {message.type === 'user' ? 'Vous' : 'IA Conseiller'}
                          </span>
                        </div>
                        <div className="text-sm whitespace-pre-line">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted text-muted-foreground max-w-[70%] p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4" />
                          <span className="text-sm">L'IA réfléchit...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tapez votre question..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Questions Fréquentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setInputValue("Sur quoi parier ?")}
                >
                  Sur quoi parier ?
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setInputValue("Quelles sont les stratégies les plus sûres ?")}
                >
                  Stratégies les plus sûres ?
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setInputValue("Comment minimiser les risques ?")}
                >
                  Comment minimiser les risques ?
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setInputValue("Quels sont les meilleurs traders ?")}
                >
                  Meilleurs traders ?
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Conseils du Jour</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">TechAnalyst</div>
                    <div className="text-xs text-muted-foreground">
                      Proche de l'objectif (+9.8%)
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">SafeTrader</div>
                    <div className="text-xs text-muted-foreground">
                      Très faible risque, idéal débutants
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommendations Section */}
        {messages.some(m => m.recommendations) && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Recommandations de l'IA</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {messages
                .filter(m => m.recommendations)
                .slice(-1)[0]
                ?.recommendations?.map((strategy) => (
                  <StrategyCard key={strategy.id} strategy={strategy} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
