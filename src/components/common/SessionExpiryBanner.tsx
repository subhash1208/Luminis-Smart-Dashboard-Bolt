import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';

const SessionExpiryBanner = () => {
  const { logout } = useAuth();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white py-2 px-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span className="font-medium">Session expiring soon — please log in again.</span>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white hover:bg-gray-100 text-yellow-800"
            onClick={() => logout()}
          >
            Log in again
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-yellow-600"
            onClick={() => setIsVisible(false)}
          >
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiryBanner;