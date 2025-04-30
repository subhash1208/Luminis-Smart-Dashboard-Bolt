import { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (roomName: string) => void;
  houseId: string;
}

const AddRoomModal = ({ isOpen, onClose, onAdd, houseId }: AddRoomModalProps) => {
  const [roomName, setRoomName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    if (!roomName.trim()) {
      setError('Room name is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await onAdd(roomName);
      setRoomName('');
    } catch (error) {
      console.error('Error adding room:', error);
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
                  Add New Room
                </h3>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <Input
                      label="Room Name"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="Enter room name"
                      error={error}
                      required
                    />
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
                      Add Room
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

export default AddRoomModal;