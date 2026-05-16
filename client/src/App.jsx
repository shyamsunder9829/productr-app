import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OtpPage from './pages/OtpPage';
import ProductsPage from './pages/ProductsPage';
import Layout from './components/Layout';

/**
 * Protected route component - Redirects to login if user is not authenticated
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Components to render if user is authenticated
 * @returns {React.ReactElement} Protected route wrapper
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a8a]"></div>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/products" replace />;
};

/**
 * Application routes configuration
 * @component
 * @returns {React.ReactElement} Routes component with all application routes
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/products" element={<ProtectedRoute><Layout><ProductsPage /></Layout></ProtectedRoute>} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

/**
 * Main App component - Sets up authentication, routing, and global notifications
 * @component
 * @returns {React.ReactElement} Main application component
 */
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: '10px', padding: '12px 16px', fontSize: '14px' }
          }}
        />
      </Router>
    </AuthProvider>
  );
}