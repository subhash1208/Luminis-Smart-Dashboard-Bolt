import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import roomService, { Room } from '../../api/roomService';
import RoomCard from './RoomCard';
import EmptyState from '../common/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import Breadcrumbs from '../common/Breadcrumbs';
import AddRoomModal from './AddRoomModal';

const RoomList = () => {
  const { houseId } = useParams<{ houseId: string }>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchRooms = async () => {
    if (!houseId) return;
    
    setIsLoading(true);
    try {
      const data = await roomService.getRooms(houseId);
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [houseId]);

  const handleAddRoom = async (roomName: string) => {
    if (!houseId) return;
    
    try {
      await roomService.createRoom({
        HouseID: houseId,
        RoomName: roomName
      });
      fetchRooms();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding room:', error);
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
          { label: 'Rooms' }
        ]}
        className="mb-6"
      />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Rooms</h2>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Room
        </Button>
      </div>

      {rooms.length === 0 ? (
        <EmptyState type="rooms" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}

      <AddRoomModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddRoom}
        houseId={houseId || ''}
      />
    </div>
  );
};

export default RoomList;