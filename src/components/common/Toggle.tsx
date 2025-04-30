import { useState } from 'react';
import { cn } from '../../utils/cn';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const Toggle = ({
  enabled,
  onChange,
  disabled = false,
  size = 'md',
  label,
  className,
}: ToggleProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleClick = () => {
    if (disabled || isTransitioning) return;
    
    setIsTransitioning(true);
    onChange(!enabled);
    
    // Reset transitioning state after animation completes
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const sizeClasses = {
    sm: {
      toggle: 'h-5 w-9',
      circle: 'h-3.5 w-3.5 translate-x-0.5',
      circleActive: 'translate-x-5',
    },
    md: {
      toggle: 'h-6 w-11',
      circle: 'h-4.5 w-4.5 translate-x-0.75',
      circleActive: 'translate-x-6',
    },
    lg: {
      toggle: 'h-7 w-14',
      circle: 'h-5.5 w-5.5 translate-x-0.75',
      circleActive: 'translate-x-8',
    },
  };

  return (
    <div className={cn('flex items-center', className)}>
      {label && (
        <span className="mr-3 text-sm font-medium text-gray-700">{label}</span>
      )}
      <button
        type="button"
        className={cn(
          'relative inline-flex flex-shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          enabled ? 'bg-primary-600' : 'bg-gray-200',
          sizeClasses[size].toggle
        )}
        onClick={handleClick}
        disabled={disabled}
        aria-pressed={enabled}
      >
        <span className="sr-only">
          {enabled ? 'Disable' : 'Enable'}
        </span>
        <span
          className={cn(
            'absolute rounded-full bg-white shadow transition-transform duration-300 ease-in-out',
            enabled ? sizeClasses[size].circleActive : sizeClasses[size].circle
          )}
          aria-hidden="true"
        />
      </button>
    </div>
  );
};

export default Toggle;