import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import SemestersPage from './pages/SemestersPage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import SearchPage from './pages/SearchPage';
import SemesterDetailPage from './pages/SemesterDetailPage'; 

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/semesters" element={<SemestersPage />} />
            <Route path="/semester/:semesterId" element={<SemesterDetailPage />} /> {/* New route */}
            <Route path="/module/:moduleId" element={<ModuleDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;