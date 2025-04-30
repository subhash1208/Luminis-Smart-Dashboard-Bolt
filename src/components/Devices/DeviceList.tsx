import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import deviceService, { Device } from '../../api/deviceService';
import DeviceCard from './DeviceCard';
import EmptyState from '../common/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import Breadcrumbs from '../common/Breadcrumbs';
import AddDeviceModal from './AddDeviceModal';

const DeviceList = () => {
  const { houseId, roomId } = useParams<{ houseId: string; roomId: string }>();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchDevices = async () => {
    if (!roomId) return;
    
    setIsLoading(true);
    try {
      const data = await deviceService.getDevices(roomId);
      setDevices(data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [roomId]);

  const handleAddDevice = async (deviceName: string, deviceType: string, status: string) => {
    if (!roomId) return;
    
    try {
      await deviceService.createDevice({
        RoomID: roomId,
        DeviceName: deviceName,
        DeviceType: deviceType,
        Status: status
      });
      fetchDevices();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding device:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Houses', path: '/houses' },
          { label: 'Rooms', path: `/houses/${houseId}` },
          { label: 'Devices' }
        ]}
        className="mb-6"
      />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Devices</h2>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Device
        </Button>
      </div>

      {devices.length === 0 ? (
        <EmptyState type="devices" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      )}

      <AddDeviceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddDevice}
        roomId={roomId || ''}
      />
    </div>
  );
};

export default DeviceList;