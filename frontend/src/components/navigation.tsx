"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, TrendingUp, Plus, Trophy, ChevronDown, LogOut, Copy, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [showConnectors, setShowConnectors] = useState(false);

  const navItems = [
    { href: "/", label: "Strategies", icon: Home },
    { href: "/portfolio", label: "Portfolio", icon: Wallet },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      // Vous pouvez ajouter une notification toast ici
    }
  };

  const openEtherscan = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, '_blank');
    }
  };

  return (
    <div className="w-full flex justify-center py-8 px-4">
      <div className="relative">
        <nav className="shadow-primary/5 inset-4 shadow-xl relative bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl px-12 py-4 min-w-[600px] max-w-fit">
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="flex items-center space-x-3 group">
              <TrendingUp className="h-8 w-8 text-primary group-hover:scale-110 transition-all duration-300" />
              <span className="text-2xl font-bold bg-white bg-clip-text text-transparent">
                BetFi
              </span>
            </Link>
          
            <div className="ml-10 md:ml-20 flex items-center space-x-8">
              <div className="flex space-x-6">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "relative px-1 flex items-center space-x-2 py-3 text-sm font-medium transition-all duration-300 group",
                        isActive
                          ? "border-b-2 border-primary/65"
                          : "text-muted-foreground hover:border-b-2 hover:border-primary/30"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Bouton Create Strategy */}
                <Button
                  asChild
                  className={cn(
                    "glow-effect-button",
                    "bg-primary/80 hover:bg-primary",
                    "border-0 font-bold shadow-lg hover:shadow-xl transition-all duration-300",
                    "hover:scale-105 active:scale-95"
                  )}
                >
                  <Link href="/create-strategy" className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Create Strategy</span>
                  </Link>
                </Button>

                {/* Wallet Connection */}
                {!isConnected ? (
                  <div className="relative">
                    <Button
                      onClick={() => setShowConnectors(!showConnectors)}
                      disabled={isPending}
                      className={cn(
                        "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
                        "border-0 font-bold shadow-lg hover:shadow-xl transition-all duration-300",
                        "hover:scale-105 active:scale-95",
                        "flex items-center space-x-2"
                      )}
                    >
                      <Wallet className="h-4 w-4" />
                      <span>{isPending ? 'Connexion...' : 'Connect Wallet'}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    
                    {showConnectors && (
                      <div className="absolute right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border/50 rounded-lg shadow-lg z-50 min-w-[200px]">
                        {connectors.map((connector) => (
                          <button
                            key={connector.id}
                            onClick={() => {
                              connect({ connector });
                              setShowConnectors(false);
                            }}
                            className="block w-full text-left px-4 py-3 hover:bg-primary/10 first:rounded-t-lg last:rounded-b-lg transition-colors text-sm font-medium"
                          >
                            {connector.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "bg-card/50 border-primary/20 hover:bg-primary/10",
                          "font-bold shadow-lg hover:shadow-xl transition-all duration-300",
                          "hover:scale-105 active:scale-95",
                          "flex items-center space-x-2"
                        )}
                      >
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                        <span>{formatAddress(address!)}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="w-56 bg-card/95 backdrop-blur-xl border border-border/50"
                    >
                      <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onClick={copyAddress}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Copy className="h-4 w-4" />
                        <span>Copy adresss</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        onClick={openEtherscan}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>See on Etherscan</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onClick={() => disconnect()}
                        className="flex items-center space-x-2 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Déconnecter</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
