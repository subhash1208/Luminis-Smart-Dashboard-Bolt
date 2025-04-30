import { Home, DoorOpen, Smartphone } from 'lucide-react';
import { cn } from '../../utils/cn';

type EmptyStateType = 'houses' | 'rooms' | 'devices';

interface EmptyStateProps {
  type: EmptyStateType;
  className?: string;
  message?: string;
}

const EmptyState = ({ type, className, message }: EmptyStateProps) => {
  const iconMap = {
    houses: Home,
    rooms: DoorOpen,
    devices: Smartphone
  };

  const messageMap = {
    houses: 'No houses available',
    rooms: 'No rooms available',
    devices: 'No devices available'
  };

  const Icon = iconMap[type];

  return (
    <div className={cn(
      'flex flex-col items-center justify-center',
      'p-12 bg-white rounded-lg shadow-sm',
      'text-center border border-gray-100',
      className
    )}>
      <div className="p-4 bg-gray-50 rounded-full mb-4">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {message || messageMap[type]}
      </h3>
      
      <p className="text-sm text-gray-500 max-w-md">
        {type === 'houses' && "You haven't added any houses yet. Get started by adding your first house."}
        {type === 'rooms' && "There are no rooms in this house yet. Add rooms to manage devices in them."}
        {type === 'devices' && "This room doesn't have any devices yet. Add devices to monitor and control them."}
      </p>
    </div>
  );
};

export default EmptyState;