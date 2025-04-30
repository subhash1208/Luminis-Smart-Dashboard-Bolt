import HouseList from '../components/Houses/HouseList';
import MainLayout from '../layouts/MainLayout';

const HouseListPage = () => {
  return (
    <MainLayout title="Your Houses">
      <HouseList />
    </MainLayout>
  );
};

export default HouseListPage;