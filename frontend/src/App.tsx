import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedLayout } from './layouts/ProtectedLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateTripPage } from './pages/CreateTripPage';
import { TripDetailPage } from './pages/TripDetailPage';
import { SharedTripPage } from './pages/SharedTripPage';
import { NotFoundPage } from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Pages with Default Layout */}
            <Route
              path="/"
              element={
                <Layout>
                  <LandingPage />
                </Layout>
              }
            />
            <Route
              path="/login"
              element={
                <Layout showFooter={false}>
                  <LoginPage />
                </Layout>
              }
            />
            <Route
              path="/register"
              element={
                <Layout showFooter={false}>
                  <RegisterPage />
                </Layout>
              }
            />
            <Route
              path="/share/:id"
              element={
                <Layout>
                  <SharedTripPage />
                </Layout>
              }
            />

            {/* Authenticated Protected Pages */}
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/trips/new" element={<CreateTripPage />} />
              <Route path="/trips/:id" element={<TripDetailPage />} />
            </Route>

            {/* 404 Not Found Catch-All */}
            <Route
              path="*"
              element={
                <Layout>
                  <NotFoundPage />
                </Layout>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
