import api from './axios';

export interface Device {
  id: string;
  DeviceName: string;
  DeviceType: string;
  Status: string;
  RoomID: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceStatus {
  reportedState: string;
  timestamp: string;
}

export interface CreateDeviceData {
  RoomID: string;
  DeviceName: string;
  DeviceType: string;
  Status: string;
}

export interface UpdateDeviceData {
  DeviceName?: string;
  Status?: string;
  RoomID?: string;
}

const deviceService = {
  getDevices: async (roomID: string): Promise<Device[]> => {
    const response = await api.get(`/device-management/${roomID}`);
    return response.data;
  },
  
  createDevice: async (data: CreateDeviceData): Promise<Device> => {
    const response = await api.post('/device-management/', data);
    return response.data;
  },
  
  updateDevice: async (deviceID: string, data: UpdateDeviceData): Promise<Device> => {
    const response = await api.put(`/device-management/${deviceID}`, data);
    return response.data;
  },
  
  deleteDevice: async (deviceID: string, roomID: string): Promise<void> => {
    await api.delete(`/device-management/${deviceID}`, {
      data: { RoomID: roomID }
    });
  },
  
  controlDevice: async (deviceID: string): Promise<void> => {
    await api.post(`/devices/${deviceID}/control`);
  },
  
  getDeviceStatus: async (deviceID: string, roomID: string): Promise<DeviceStatus> => {
    const response = await api.get(`/devices/${deviceID}/status`, {
      params: { roomId: roomID }
    });
    return response.data;
  }
};

export default deviceService;