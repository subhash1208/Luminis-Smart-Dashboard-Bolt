import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DeviceList from '../components/Devices/DeviceList';
import MainLayout from '../layouts/MainLayout';
import roomService, { Room } from '../api/roomService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DeviceListPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) return;
      
      setIsLoading(true);
      try {
        // In a real implementation, you would have a getRoom endpoint
        // For now, we'll assume the room data is available from another source
        // or we could fetch it from the rooms list of the house
        setRoom({ id: roomId, RoomName: 'Room', HouseID: '', createdAt: '', updatedAt: '' });
      } catch (error) {
        console.error('Error fetching room:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={room ? `${room.RoomName} - Devices` : 'Devices'}>
      <DeviceList />
    </MainLayout>
  );
};

export default DeviceListPage;