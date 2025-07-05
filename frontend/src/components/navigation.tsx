"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bot, Wallet, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Strategies", icon: Home },
    { href: "/ai", label: "AI Advisor", icon: Bot },
    { href: "/portfolio", label: "Portfolio", icon: Wallet },
  ];

  return (
    <nav className="bg-card border-b border-border backdrop-blur-sm bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <TrendingUp className="h-8 w-8 text-primary group-hover:glow-green transition-all duration-300" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                BetFi
              </span>
            </Link>
          </div>
          <div className="flex space-x-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;