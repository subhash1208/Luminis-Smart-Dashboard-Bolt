import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import houseService, { House } from '../../api/houseService';
import HouseCard from './HouseCard';
import EmptyState from '../common/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import AddHouseModal from './AddHouseModal';

const HouseList = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchHouses = async () => {
    setIsLoading(true);
    try {
      const data = await houseService.getHouses();
      setHouses(data);
    } catch (error) {
      console.error('Error fetching houses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const handleAddHouse = async (houseName: string, location: string) => {
    try {
      await houseService.createHouse({
        HouseName: houseName,
        Location: location
      });
      fetchHouses();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding house:', error);
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Houses</h2>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add House
        </Button>
      </div>

      {houses.length === 0 ? (
        <EmptyState type="houses" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {houses.map((house) => (
            <HouseCard key={house.id} house={house} />
          ))}
        </div>
      )}

      <AddHouseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddHouse}
      />
    </div>
  );
};

export default HouseList;