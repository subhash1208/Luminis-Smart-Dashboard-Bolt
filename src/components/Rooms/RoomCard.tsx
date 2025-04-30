import { useNavigate } from 'react-router-dom';
import { DoorOpen, Calendar, Clock } from 'lucide-react';
import Card from '../common/Card';
import { formatDateTime } from '../../utils/dateFormatter';
import { Room } from '../../api/roomService';

interface RoomCardProps {
  room: Room;
  className?: string;
}

const RoomCard = ({ room, className }: RoomCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      clickable 
      className={className}
      onClick={() => navigate(`/houses/${room.HouseID}/rooms/${room.id}`)}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-secondary-50 p-2 rounded-full">
            <DoorOpen className="w-6 h-6 text-secondary-600" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {room.RoomName || 'Unnamed Room'}
        </h3>
        
        <div className="pt-4 mt-4 border-t border-gray-100">
          <div className="flex flex-col gap-1">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              <span>Created: {formatDateTime(room.createdAt)}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              <span>Updated: {formatDateTime(room.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RoomCard;