//import { useState } from'react';
import { useNavigate } from'react-router-dom';
import { Home, MapPin, Calendar, Clock } from 'lucide-react';
import Card from '../common/Card';
import { formatDateTime } from '../../utils/dateFormatter';
import { House } from '../../api/houseService';

interface HouseCardProps {
  house: House;
  className?: string;
  onUpdate: (house: House) => void;
  onDelete: (house: House) => void;
}

const HouseCard = ({ house, className, onUpdate, onDelete }: HouseCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      clickable
      className={className}
      onClick={() => navigate(`/houses/${house.id}`)}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-primary-50 p-2 rounded-full">
            <Home className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(house);
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Update
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(house);
              }}
              className="text-sm text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {house.HouseName || 'Unnamed House'}
        </h3>

        <div className="grid gap-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>{house.Location || 'No location set'}</span>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-gray-100">
          <div className="flex flex-col gap-1">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              <span>Created: {formatDateTime(house.createdAt)}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              <span>Updated: {formatDateTime(house.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HouseCard;