import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, LayoutDashboard } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 rounded-3xl bg-[#E8F0E4] flex items-center justify-center text-[#2D5016] mb-6 shadow-inner animate-bounce">
        <Compass className="w-10 h-10" />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017] mb-2">
        Error 404
      </span>

      <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A1A2E] mb-3">
        Lost in the Wilderness?
      </h1>

      <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
        The destination or travel page you are searching for might have moved, or never existed on our map.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link to="/">
          <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
            Return Home
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="outline" leftIcon={<LayoutDashboard className="w-4 h-4 text-[#2D5016]" />}>
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
