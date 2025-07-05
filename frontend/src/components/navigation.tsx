"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, TrendingUp, HandCoins, Plus, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Strategies", icon: Home },
    { href: "/portfolio", label: "Portfolio", icon: Wallet },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <div className="w-full flex justify-center py-8 px-4">
      <div className="relative">
        <nav className="shadow-primary/5 inset-4 shadow-xl relative bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl px-12 py-4 min-w-[600px] max-w-4xl">
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
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
