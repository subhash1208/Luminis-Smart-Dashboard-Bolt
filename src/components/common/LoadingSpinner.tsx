import { cn } from '../../utils/cn';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LoadingSpinner = ({ size = 'medium', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };

  return (
    <div className={cn(
      'relative animate-spin rounded-full border-solid border-gray-200',
      'border-t-transparent',
      sizeClasses[size],
      className
    )}>
      <div className="absolute inset-0 rounded-full border-t-primary-600 border-solid border-t-2"></div>
    </div>
  );
};

export default LoadingSpinner;