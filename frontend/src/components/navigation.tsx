"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, TrendingUp, HandCoins } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Strategies", icon: Home },
    { href: "/portfolio", label: "Portfolio", icon: Wallet },
    { href: "/traders", label: "Traders", icon: HandCoins },
  ];

  return (
    <div className="w-full flex justify-center py-8 px-4">
      <div className="relative">
        <nav className="shadow-primary/10 inset-4 shadow-xl relative bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl px-12 py-4 min-w-[600px] max-w-4xl">
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="flex items-center space-x-3 group">
              <TrendingUp className="h-8 w-8 text-primary group-hover:scale-110 transition-all duration-300" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                BetFi
              </span>
            </Link>
          
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
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
