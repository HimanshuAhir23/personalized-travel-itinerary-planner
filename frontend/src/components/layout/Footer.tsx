import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Heart, Globe, Mail, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1F380F] text-[#FFFFF0]/80 border-t border-[#4A7C23]/40 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#87A96B] flex items-center justify-center text-[#1F380F] font-bold">
                <Compass className="w-6 h-6" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FFFFF0]">
                WanderWise
              </span>
            </Link>
            <p className="text-sm text-[#FFFFF0]/70 leading-relaxed">
              Your AI-powered travel assistant crafting bespoke, day-by-day itineraries with smart budget allocation and local gems.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D4A017]">
              <Sparkles className="w-4 h-4" />
              <span>Powered by state-of-the-art AI planners</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#FFFFF0] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/trips/new" className="hover:text-[#B2D8A3] transition-colors">
                  AI Trip Generator
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#B2D8A3] transition-colors">
                  Travel Dashboard
                </Link>
              </li>
              <li>
                <a href="#destinations" className="hover:text-[#B2D8A3] transition-colors">
                  Popular Destinations
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#B2D8A3] transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#FFFFF0] mb-4">
              Trending Hubs
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <span>🇯🇵</span>
                <span className="hover:text-[#B2D8A3] transition-colors">Kyoto & Tokyo, Japan</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🇮🇹</span>
                <span className="hover:text-[#B2D8A3] transition-colors">Florence & Tuscany, Italy</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🇪🇸</span>
                <span className="hover:text-[#B2D8A3] transition-colors">Barcelona, Spain</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🇮🇸</span>
                <span className="hover:text-[#B2D8A3] transition-colors">Reykjavik, Iceland</span>
              </li>
            </ul>
          </div>

          {/* Security & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#FFFFF0] mb-4">
              Peace of Mind
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-[#FFFFF0]/70">
              <ShieldCheck className="w-4 h-4 text-[#87A96B] shrink-0 mt-0.5" />
              <span>Zero-spam guarantee. Your travel dates & itineraries are securely stored.</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#FFFFF0]/60">
              <Mail className="w-4 h-4 text-[#87A96B] shrink-0" />
              <span>support@wanderwise.ai</span>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D5016] text-[#B2D8A3] text-xs font-semibold">
                <Globe className="w-3.5 h-3.5" /> Global Multi-Currency Support
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#4A7C23]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FFFFF0]/50 gap-4">
          <p>© {new Date().getFullYear()} WanderWise AI. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#E8735A] fill-current" />
            <span>for curious travelers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
