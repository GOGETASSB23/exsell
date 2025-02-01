// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import CreateListing from './pages/CreateListing';
import ViewListing from './pages/ViewListing';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/create" 
            element={isAuthenticated ? <CreateListing /> : <Navigate to="/" />} 
          />
          <Route path="/listing/:id" element={<ViewListing />} />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <Profile /> : <Navigate to="/" />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;