"use client";
import React, { useState, useEffect } from "react";
import EditableSection from "./EditableSection";
import { Location, LocationData } from "./types"; // ✅ Import Location

interface LocationComponentProps {
  initialData: LocationData;
  onSave: (data: LocationData) => Promise<void>;
}

const getGoogleMapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const LocationComponent: React.FC<LocationComponentProps> = ({ initialData, onSave }) => {
  const [locations, setLocations] = useState<Location[]>(initialData.locations || []);

  useEffect(() => {
    setLocations(initialData.locations);
  }, [initialData]);

  const handleSave = async () => {
    try {
      await onSave({ locations }); // ✅ Use the latest locations state
    } catch (error) {
      console.error("Error saving locations:", error);
    }
  };

  const handleUpdateLocation = (index: number, newCity: string, newAddress: string) => {
    setLocations((prev) =>
      prev.map((location, i) =>
        i === index ? { city: newCity, address: newAddress } : location
      )
    );
  };

  const handleAddLocation = () => {
    setLocations([...locations, { city: "New Location", address: "Enter Address Here" }]);
  };

  return (
    <EditableSection
      title="📍 Locations"
      onSave={handleSave} // ✅ Now correctly calls handleSave()
      editForm={
        <div className="space-y-4">
          {locations.map((location, index) => (
            <div key={index} className="flex gap-4 items-center">
              <input
                className="flex-[1] p-2 border rounded w-1/3"
                value={location.city}
                onChange={(e) => handleUpdateLocation(index, e.target.value, location.address)}
              />
              <input
                className="flex-[2] p-2 border rounded w-2/3"
                value={location.address}
                onChange={(e) => handleUpdateLocation(index, location.city, e.target.value)}
              />
            </div>
          ))}
          <button
            onClick={handleAddLocation}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add Location
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {locations.map((location, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              📍 {location.city}
            </h3>
            <a
              href={getGoogleMapsUrl(location.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {location.address}
            </a>
          </div>
        ))}
      </div>
    </EditableSection>
  );
};

export default LocationComponent;
