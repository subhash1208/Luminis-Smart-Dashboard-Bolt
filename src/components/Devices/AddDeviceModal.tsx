import { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (deviceName: string, deviceType: string, status: string) => void;
  roomId: string;
}

const deviceTypes = ['Light', 'Thermostat', 'Switch', 'Sensor', 'Lock', 'Camera'];

const AddDeviceModal = ({ isOpen, onClose, onAdd, roomId }: AddDeviceModalProps) => {
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState(deviceTypes[0]);
  const [status, setStatus] = useState('off');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    deviceName: '',
    deviceType: '',
    status: ''
  });

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors = {
      deviceName: '',
      deviceType: '',
      status: ''
    };
    
    if (!deviceName.trim()) {
      newErrors.deviceName = 'Device name is required';
    }
    
    if (!deviceType) {
      newErrors.deviceType = 'Device type is required';
    }
    
    setErrors(newErrors);
    return !newErrors.deviceName && !newErrors.deviceType && !newErrors.status;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await onAdd(deviceName, deviceType, status);
      setDeviceName('');
      setDeviceType(deviceTypes[0]);
      setStatus('off');
    } catch (error) {
      console.error('Error adding device:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-left sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                  Add New Device
                </h3>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <Input
                      label="Device Name"
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                      placeholder="Enter device name"
                      error={errors.deviceName}
                      required
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Device Type
                      </label>
                      <select
                        value={deviceType}
                        onChange={(e) => setDeviceType(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        {deviceTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {errors.deviceType && (
                        <p className="mt-1 text-sm text-red-600">{errors.deviceType}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Initial Status
                      </label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio text-primary-600"
                            name="status"
                            value="on"
                            checked={status === 'on'}
                            onChange={() => setStatus('on')}
                          />
                          <span className="ml-2">On</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio text-primary-600"
                            name="status"
                            value="off"
                            checked={status === 'off'}
                            onChange={() => setStatus('off')}
                          />
                          <span className="ml-2">Off</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    
                    <Button
                      type="submit"
                      isLoading={isLoading}
                    >
                      Add Device
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDeviceModal;