import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import houseService, { House } from '../../api/houseService';
import HouseCard from './HouseCard';
import EmptyState from '../common/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import AddHouseModal from './AddHouseModal';
import UpdateHouseModal from './UpdateHouseModal';
import DeleteHouseModal from './DeleteHouseModal';

const HouseList = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);

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
        Location: location,
      });
      fetchHouses();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding house:', error);
    }
  };

  const handleUpdateHouse = async (houseName: string, location: string) => {
    if (!selectedHouse) {
      console.error('Selected house is null');
      return;
    }

    try {
      await houseService.updateHouse(selectedHouse.id, {
        HouseName: houseName,
        Location: location,
      });
      fetchHouses();
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error('Error updating house:', error);
    }
  };

  const handleDeleteHouse = async () => {
    if (!selectedHouse) {
      console.error('Selected house is null');
      return;
    }

    try {
      await houseService.deleteHouse(selectedHouse.id);
      fetchHouses();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting house:', error);
    }
  };

  const handleUpdate = (house: House) => {
    setSelectedHouse(house);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (house: House) => {
    setSelectedHouse(house);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  console.log('Houses data:', houses); // Debug log to see the data structure
  
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
          {houses.map((house, index) => (
            <HouseCard
              key={house.id || `house-${index}`} // Fallback to index if id is undefined
              house={house}
              onUpdate={(h) => handleUpdate(h)}
              onDelete={(h) => handleDelete(h)}
            />
          ))}
        </div>
      )}

      <AddHouseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddHouse}
      />
      {selectedHouse && (
        <>
          <UpdateHouseModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            onUpdate={handleUpdateHouse}
            house={selectedHouse}
          />
          <DeleteHouseModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onDelete={handleDeleteHouse}
            house={selectedHouse}
          />
        </>
      )}
    </div>
  );
};

export default HouseList;