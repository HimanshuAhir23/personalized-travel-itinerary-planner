import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, User as UserIcon, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !displayName) {
      setError('Please fill in your name and email address.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await signup(email, password, displayName);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
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
            Start Your Journey
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Create your free WanderWise account to generate personalized travel itineraries.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-[#E8735A]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name or Explorer Handle"
            placeholder="e.g. Alex Rivera"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            leftIcon={<UserIcon className="w-4 h-4 text-gray-400" />}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="alex@traveler.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4 text-gray-400" />}
          />

          <div className="flex items-start gap-2 pt-1 text-xs text-gray-500">
            <CheckCircle2 className="w-4 h-4 text-[#87A96B] shrink-0 mt-0.5" />
            <span>By signing up, you agree to generate unlimited AI travel blueprints with WanderWise.</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full py-3"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create My Account
          </Button>
        </form>

        <div className="pt-2 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#2D5016] hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
