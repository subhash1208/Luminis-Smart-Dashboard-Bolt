import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RoomList from '../components/Rooms/RoomList';
import MainLayout from '../layouts/MainLayout';
import houseService, { House } from '../api/houseService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RoomListPage = () => {
  const { houseId } = useParams<{ houseId: string }>();
  const [house, setHouse] = useState<House | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHouse = async () => {
      if (!houseId) return;
      
      setIsLoading(true);
      try {
        // In a real implementation, you would have a getHouse endpoint
        // For now, we'll fetch all houses and find the one we need
        const houses = await houseService.getHouses();
        const currentHouse = houses.find(h => h.id === houseId) || null;
        setHouse(currentHouse);
      } catch (error) {
        console.error('Error fetching house:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHouse();
  }, [houseId]);

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
    <MainLayout title={house ? `${house.HouseName} - Rooms` : 'Rooms'}>
      <RoomList />
    </MainLayout>
  );
};

export default RoomListPage;