import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';
import SessionExpiryBanner from './components/common/SessionExpiryBanner';
import ProtectedRoute from './routes/ProtectedRoute';

// Lazy loading pages for better performance
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const HouseListPage = lazy(() => import('./pages/HouseListPage'));
const RoomListPage = lazy(() => import('./pages/RoomListPage'));
const DeviceListPage = lazy(() => import('./pages/DeviceListPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  const { isSessionExpiringSoon } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {isSessionExpiringSoon && <SessionExpiryBanner />}
      
      <Suspense fallback={
        <div className="h-screen flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      }>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/houses" replace />} />
            <Route path="houses" element={<HouseListPage />} />
            <Route path="houses/:houseId" element={<RoomListPage />} />
            <Route path="houses/:houseId/rooms/:roomId" element={<DeviceListPage />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;