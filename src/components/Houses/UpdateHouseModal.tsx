// UpdateHouseModal.tsx
import { useState } from'react';
import { X } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

interface UpdateHouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (houseName: string, location: string) => void;
  house: any;
}

const UpdateHouseModal = ({ isOpen, onClose, onUpdate, house }: UpdateHouseModalProps) => {
  if (!isOpen) return null;

  if (!house) {
    return <div>House not found</div>; // Add a message to display when the house is not found
  }
  const [houseName, setHouseName] = useState(house.HouseName);
  const [location, setLocation] = useState(house.Location);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    houseName: '',
    location: '',
  });

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors = {
      houseName: '',
      location: '',
    };

    if (!houseName.trim()) {
      newErrors.houseName = 'House name is required';
    }

    setErrors(newErrors);
    return!newErrors.houseName &&!newErrors.location;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onUpdate(houseName, location);
      setHouseName('');
      setLocation('');
    } catch (error) {
      console.error('Error updating house:', error);
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
                  Update House
                </h3>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <Input
                      label="House Name"
                      value={houseName}
                      onChange={(e) => setHouseName(e.target.value)}
                      placeholder="Enter house name"
                      error={errors.houseName}
                      required
                    />

                    <Input
                      label="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter location (optional)"
                      error={errors.location}
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

                    <Button type="submit" isLoading={isLoading}>
                      Update House
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

export default UpdateHouseModal;