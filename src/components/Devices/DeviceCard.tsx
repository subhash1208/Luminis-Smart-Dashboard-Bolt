import { useState, useEffect } from 'react';
import { Calendar, Clock, Info, RefreshCw } from 'lucide-react';
import Card from '../common/Card';
import Toggle from '../common/Toggle';
import { formatDateTime } from '../../utils/dateFormatter';
import deviceService, { Device, DeviceStatus } from '../../api/deviceService';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';

interface DeviceCardProps {
  device: Device;
  className?: string;
}

const DeviceCard = ({ device, className }: DeviceCardProps) => {
  const [status, setStatus] = useState<DeviceStatus | null>(null);
  const [isOn, setIsOn] = useState(device.Status === 'on' || device.Status === 'ON');
  const [isToggling, setIsToggling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDeviceStatus = async () => {
    if (isRefreshing) return;
    
    setIsLoading(true);
    try {
      const statusData = await deviceService.getDeviceStatus(device.id, device.RoomID);
      setStatus(statusData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching device status:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceStatus();
    // Refresh the status every 30 seconds
    const intervalId = setInterval(fetchDeviceStatus, 30000);
    return () => clearInterval(intervalId);
  }, [device.id, device.RoomID]);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await deviceService.controlDevice(device.id);
      setIsOn(!isOn);
      
      // Refresh the status after toggling
      setIsRefreshing(true);
      await fetchDeviceStatus();
      setIsRefreshing(false);
    } catch (error) {
      console.error('Error toggling device:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDeviceStatus();
    setIsRefreshing(false);
  };

  const getDeviceIcon = () => {
    // This is where we would have device-specific icons based on type
    // For now, we're just using Info as a placeholder
    return <Info className="w-6 h-6 text-primary-600" />;
  };

  return (
    <Card className={className}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-primary-50 p-2 rounded-full">
            {getDeviceIcon()}
          </div>
          
          <Toggle
            enabled={isOn}
            onChange={handleToggle}
            disabled={isToggling}
            size="md"
          />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {device.DeviceName || 'Unnamed Device'}
        </h3>
        
        <div className="grid gap-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium text-gray-900">{device.DeviceType}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Desired State:</span>
            <span className="font-medium text-gray-900">{device.Status || 'Unknown'}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Reported State:</span>
            {isLoading ? (
              <LoadingSpinner size="small" />
            ) : (
              <div className="flex items-center">
                <span className="font-medium text-gray-900 mr-2">
                  {status?.reportedState || 'Unknown'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0.5"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-4 mt-4 border-t border-gray-100">
          <div className="flex flex-col gap-1">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              <span>Created: {formatDateTime(device.createdAt)}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              <span>Updated: {formatDateTime(device.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DeviceCard;