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
    console.log('API Response:', response.data); // Debug log to see actual response
    
    // Check if response.data is an array
    if (!Array.isArray(response.data)) {
      console.error('Expected array but got:', typeof response.data);
      return [];
    }
    
    return response.data.map((house: any) => {
      // Handle different response formats
      if (house.HouseID && house.HouseID.S) {
        // DynamoDB format with type indicators
        return {
          id: house.HouseID.S,
          HouseName: house.HouseName?.S || '',
          Location: house.Location?.S || '',
          createdAt: house.CreatedAt?.S || '',
          updatedAt: house.UpdatedAt?.S || '',
          userId: house.UserID?.S || '',
        };
      } else if (house.HouseID) {
        // Plain object without type indicators
        return {
          id: house.HouseID,
          HouseName: house.HouseName || '',
          Location: house.Location || '',
          createdAt: house.CreatedAt || '',
          updatedAt: house.UpdatedAt || '',
          userId: house.UserID || '',
        };
      } else {
        console.error('Unexpected house format:', house);
        return {
          id: house.id || 'unknown-id',
          HouseName: house.HouseName || 'Unnamed House',
          Location: house.Location || 'No location',
          createdAt: house.createdAt || '',
          updatedAt: house.updatedAt || '',
          userId: house.userId || '',
        };
      }
    });
  },

  createHouse: async (data: CreateHouseData): Promise<House> => {
    const response = await api.post('/houses/', data);
    console.log('Create Response:', response.data); // Debug log
    
    if (response.data) {
      // Handle DynamoDB format with type indicators
      if (response.data.HouseID && response.data.HouseID.S) {
        return {
          id: response.data.HouseID.S,
          HouseName: response.data.HouseName?.S || '',
          Location: response.data.Location?.S || '',
          createdAt: response.data.CreatedAt?.S || '',
          updatedAt: response.data.UpdatedAt?.S || '',
          userId: response.data.UserID?.S || '',
        };
      } else {
        // Handle plain object format
        return {
          id: response.data.HouseID || response.data.id,
          HouseName: response.data.HouseName || '',
          Location: response.data.Location || '',
          createdAt: response.data.CreatedAt || response.data.createdAt || '',
          updatedAt: response.data.UpdatedAt || response.data.updatedAt || '',
          userId: response.data.UserID || response.data.userId || '',
        };
      }
    } else {
      throw new Error('Failed to create house');
    }
  },

  updateHouse: async (id: string, data: UpdateHouseData): Promise<House> => {
    const response = await api.put(`/houses/${id}`, data);
    console.log('Update Response:', response.data); // Debug log
    
    if (response.data) {
      // Handle DynamoDB format with type indicators
      if (response.data.HouseID && response.data.HouseID.S) {
        return {
          id: response.data.HouseID.S,
          HouseName: response.data.HouseName?.S || '',
          Location: response.data.Location?.S || '',
          createdAt: response.data.CreatedAt?.S || '',
          updatedAt: response.data.UpdatedAt?.S || '',
          userId: response.data.UserID?.S || '',
        };
      } else {
        // Handle plain object format
        return {
          id: response.data.HouseID || response.data.id,
          HouseName: response.data.HouseName || '',
          Location: response.data.Location || '',
          createdAt: response.data.CreatedAt || response.data.createdAt || '',
          updatedAt: response.data.UpdatedAt || response.data.updatedAt || '',
          userId: response.data.UserID || response.data.userId || '',
        };
      }
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