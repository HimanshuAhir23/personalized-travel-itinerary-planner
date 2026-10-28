import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your email address.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await login('alex.traveler@wanderwise.ai', 'demo1234');
      navigate('/dashboard', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-[#E8F0E4] space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#2D5016] text-[#FFFFF0] flex items-center justify-center mx-auto shadow-md">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A2E]">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Sign in to access your saved itineraries and personalized trips.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-[#E8735A]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="explorer@wanderwise.ai"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4 text-gray-400" />}
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full py-3"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        {/* Demo Fast Login */}
        <div className="pt-2 border-t border-gray-100 space-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-2.5 text-xs font-semibold bg-[#FFF8DC]/50 border-[#87A96B]/40"
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />}
          >
            Instant Demo Account Access
          </Button>

          <p className="text-center text-xs text-gray-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#2D5016] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
