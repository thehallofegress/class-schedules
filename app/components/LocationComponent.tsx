"use client";
import React, { useState, useEffect } from "react";
import EditableSection from "./EditableSection";
import { LocationInfo} from "./types";
import { Trash2 } from "lucide-react";
import { useEdit } from "./EditContext";

interface LocationComponentProps {
  initialData: LocationInfo[];
  onSave: (data: LocationInfo[]) => Promise<void>;
}

const getGoogleMapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const LocationComponent: React.FC<LocationComponentProps> = ({ initialData, onSave }) => {
  const [locations, setLocations] = useState<LocationInfo[]>(initialData || []);
  const { isEditMode } = useEdit(); // Get edit mode state

  useEffect(() => {
    setLocations(initialData);
  }, [initialData]);

  const handleSave = async () => {
    try {
      await onSave(locations);
    } catch (error) {
      console.error("Error saving locations:", error);
    }
  };

  const handleUpdateLocation = (index: number, newCity: string, newAddress: string, newName?: string) => {
    setLocations((prev) =>
      prev.map((location, i) =>
        i === index ? { city: newCity, address: newAddress, name: newName ?? location.name } : location
      )
    );
  };

  const handleAddLocation = () => {
    setLocations([...locations, { city: "New Location", address: "Enter Address Here", name: "Enter Name Here" }]);
  };

  const handleDeleteLocation = (index: number) => {
    const updatedLocations = locations.filter((_, i) => i !== index);
    setLocations(updatedLocations);
  };

  return (
    <EditableSection title="📍 Locations" onSave={handleSave} editForm={(isEditing) => (
      <div className="space-y-4">
        {locations.map((location, index) => (
          <div key={index} className="flex gap-4 items-center">
            <input
              className="flex-[1] p-2 border rounded w-1/3"
              value={location.city}
              onChange={(e) => handleUpdateLocation(index, e.target.value, location.address, location.name)}
            />
            <input
              className="flex-[1] p-2 border rounded w-1/3"
              value={location.name}
              onChange={(e) => handleUpdateLocation(index, location.city, location.address, e.target.value)}
            />
            <input
              className="flex-[2] p-2 border rounded w-2/3"
              value={location.address}
              onChange={(e) => handleUpdateLocation(index, location.city, e.target.value)}
            />
            {isEditMode && isEditing && (
              <button
                onClick={() => handleDeleteLocation(index)}
                 className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        <button onClick={handleAddLocation} className="px-4 py-2 bg-blue-600 text-white rounded">
          Add Location
        </button>
      </div>
  )}
  >
      <div className="space-y-6">
        {locations.map((location, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              📍 {location.city}
              </h3>
              <p>
                {location.name ? `${location.name}` : ''}
              </p>
              <a
                href={getGoogleMapsUrl(location.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {location.address}
              </a>
            </div>
          </div>
        ))}
      </div>
    </EditableSection>
  );
};

export default LocationComponent;
