import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Layout } from '../components/layout/Layout';

export const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Layout showFooter={false}>
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" message="Checking your travel explorer credentials..." />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
