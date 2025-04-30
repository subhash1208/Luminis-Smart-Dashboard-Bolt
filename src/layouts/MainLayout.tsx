import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, LogOut, Menu, X, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../utils/cn';
import { useState } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

const MainLayout = ({ children, title, className }: MainLayoutProps) => {
  const { logout, userInfo } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/houses')}
                className="flex items-center"
              >
                <div className="bg-primary-600 p-2 rounded-full">
                  <HomeIcon className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-900">Luminis</span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <div className="mr-3 text-right">
                      <p className="text-sm font-medium text-gray-900">{userInfo?.givenName || 'User'}</p>
                      <p className="text-xs text-gray-500">{userInfo?.email || ''}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="pt-2 pb-3 space-y-1 border-t border-gray-200">
            <button
              onClick={() => {
                navigate('/houses');
                setMenuOpen(false);
              }}
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 w-full text-left"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
              }}
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 w-full text-left"
            >
              Profile
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
              }}
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 w-full text-left"
            >
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="block pl-3 pr-4 py-2 text-base font-medium text-red-600 hover:bg-gray-50 hover:text-red-700 w-full text-left"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {title && (
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>
        )}
        <div className={cn(className)}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Luminis Smart Home
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;