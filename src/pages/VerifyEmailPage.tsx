import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Mail, Key, HomeIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import authService from '../api/authService';

const VerifyEmailPage = () => {
  const location = useLocation();
  const { isLoading, verifyEmail } = useAuth();
  
  // Get email from location state or localStorage
  const [email, setEmail] = useState(() => {
    const locationEmail = location.state?.email;
    const storedEmail = localStorage.getItem('pendingVerificationEmail');
    return locationEmail || storedEmail || '';
  });
  
  const [verificationCode, setVerificationCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    // Store email in localStorage in case the user refreshes the page
    if (email) {
      localStorage.setItem('pendingVerificationEmail', email);
    }
  }, [email]);

  useEffect(() => {
    // Countdown for resend cooldown
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Email is required');
      return;
    }
    
    if (!verificationCode) {
      toast.error('Verification code is required');
      return;
    }
    
    try {
      await verifyEmail({
        email,
        code: verificationCode
      });
      
      localStorage.removeItem('pendingVerificationEmail');
      // Note: The navigation is handled in the AuthContext
      
    } catch (error: any) {
      console.error('Verification error:', error);
      // Toast errors will be handled by the AuthContext
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    try {
      await authService.resendVerificationCode({ email });
      
      toast.success('A new verification code has been sent to your email');
      setResendCooldown(60); // Set cooldown to 60 seconds
      
    } catch (error: any) {
      console.error('Failed to resend code:', error);
      toast.error('Failed to resend code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-primary-600 p-3 rounded-full">
              <HomeIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the verification code sent to your email
          </p>
        </div>
        
        {/* Toast notifications will be handled by react-hot-toast */}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              leftIcon={<Mail className="w-5 h-5 text-gray-400" />}
              disabled={!!location.state?.email}
              required
            />
            
            <Input
              label="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              leftIcon={<Key className="w-5 h-5 text-gray-400" />}
              required
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
          >
            Verify Email
          </Button>
          
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendCooldown > 0 || isLoading}
              className="text-sm font-medium text-primary-600 hover:text-primary-500 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0 
                ? `Resend code (${resendCooldown}s)` 
                : 'Resend verification code'}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already verified?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;