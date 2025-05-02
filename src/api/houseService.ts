import api from './axios';

export interface House {
  id: string;
  HouseName: string;
  Location: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateHouseData {
  HouseName: string;
  Location: string;
}

export interface UpdateHouseData {
  HouseName?: string;
  Location?: string;
}

const houseService = {
  getHouses: async (): Promise<House[]> => {
    const response = await api.get('/houses/');
    return response.data.map((house: any) => ({
      id: house.HouseID.S,
      HouseName: house.HouseName.S,
      Location: house.Location.S,
      createdAt: house.CreatedAt.S,
      updatedAt: house.UpdatedAt.S,
      userId: house.UserID.S,
    }));
  },

  createHouse: async (data: CreateHouseData): Promise<House> => {
    const response = await api.post('/houses/', data);
    if (response.data) {
      return {
        id: response.data.HouseID.S,
        HouseName: response.data.HouseName.S,
        Location: response.data.Location.S,
        createdAt: response.data.CreatedAt.S,
        updatedAt: response.data.UpdatedAt.S,
        userId: response.data.UserID.S,
      };
    } else {
      throw new Error('Failed to create house');
    }
  },

  updateHouse: async (id: string, data: UpdateHouseData): Promise<House> => {
    const response = await api.put(`/houses/${id}`, data);
    if (response.data) {
      return {
        id: response.data.HouseID.S,
        HouseName: response.data.HouseName.S,
        Location: response.data.Location.S,
        createdAt: response.data.CreatedAt.S,
        updatedAt: response.data.UpdatedAt.S,
        userId: response.data.UserID.S,
      };
    } else {
      throw new Error('Failed to update house');
    }
  },

  deleteHouse: async (id: string): Promise<void> => {
    console.log(`Deleting house with id: ${id}`);
    try {
      await api.delete(`/houses/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

export default houseService;