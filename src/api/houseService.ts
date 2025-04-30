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
    return response.data;
  },
  
  createHouse: async (data: CreateHouseData): Promise<House> => {
    const response = await api.post('/houses/', data);
    return response.data;
  },
  
  updateHouse: async (id: string, data: UpdateHouseData): Promise<House> => {
    const response = await api.put(`/houses/${id}`, data);
    return response.data;
  },
  
  deleteHouse: async (id: string): Promise<void> => {
    await api.delete(`/houses/${id}`);
  }
};

export default houseService;