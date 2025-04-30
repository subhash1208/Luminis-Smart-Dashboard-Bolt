import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    leftIcon,
    rightIcon,
    disabled,
    ...props 
  }, ref) => {
    
    const variantClasses = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 border-primary-600',
      secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 border-secondary-600',
      outline: 'bg-transparent text-gray-700 hover:bg-gray-50 border-gray-300',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border-transparent',
      danger: 'bg-red-600 text-white hover:bg-red-700 border-red-600'
    };

    const sizeClasses = {
      sm: 'py-1 px-3 text-sm',
      md: 'py-2 px-4 text-base',
      lg: 'py-3 px-6 text-lg'
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          'inline-flex items-center justify-center',
          'font-medium rounded-md',
          'transition-colors duration-200',
          'border focus:outline-none focus:ring-2 focus:ring-offset-2',
          variantClasses[variant],
          sizeClasses[size],
          (isLoading || disabled) && 'opacity-70 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {isLoading && (
          <LoadingSpinner 
            size="small" 
            className="mr-2" 
          />
        )}
        
        {!isLoading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        
        {children}
        
        {!isLoading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;