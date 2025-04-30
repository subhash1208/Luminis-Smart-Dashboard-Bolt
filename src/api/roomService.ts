import api from './axios';

export interface Room {
  id: string;
  RoomName: string;
  HouseID: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomData {
  HouseID: string;
  RoomName: string;
}

export interface UpdateRoomData {
  RoomName?: string;
  HouseID?: string;
}

const roomService = {
  getRooms: async (houseID: string): Promise<Room[]> => {
    const response = await api.get(`/rooms/${houseID}`);
    return response.data;
  },
  
  createRoom: async (data: CreateRoomData): Promise<Room> => {
    const response = await api.post('/rooms/', data);
    return response.data;
  },
  
  updateRoom: async (roomID: string, data: UpdateRoomData): Promise<Room> => {
    const response = await api.put(`/rooms/${roomID}`, data);
    return response.data;
  },
  
  deleteRoom: async (roomID: string, houseID: string): Promise<void> => {
    await api.delete(`/rooms/${roomID}`, { 
      data: { HouseID: houseID } 
    });
  }
};

export default roomService;