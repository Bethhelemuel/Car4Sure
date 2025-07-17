import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Policies from './pages/Policies';
import AddPolicy from './pages/AddPolicy';
import EditPolicy from './pages/EditPolicy';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Addresses from './pages/Addresses';

// Helper component to handle redirects based on auth state
const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const location = useLocation();

  // If not logged in, redirect to login for any route except /login or /register
  if (!token || !user) {
    if (location.pathname !== '/login' && location.pathname !== '/register') {
      return <Navigate to="/login" replace />;
    }
  } else {
    // If logged in, redirect from /login or /register to /home
    if (location.pathname === '/login' || location.pathname === '/register') {
      return <Navigate to="/home" replace />;
    }
  }
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthRedirect>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/home" element={<Home />} />
                      <Route path="/policies" element={<Policies />} />
                      <Route path="/add-policy" element={<AddPolicy />} />
                      <Route path="/edit-policy" element={<EditPolicy />} />
                      <Route path="/vehicles" element={<Vehicles />} />
                      <Route path="/drivers" element={<Drivers />} />
                      <Route path="/addresses" element={<Addresses />} />
                      <Route path="*" element={<Navigate to="/home" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthRedirect>
      </Router>
    </AuthProvider>
  );
}

export default App;
