'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast, { Toaster } from 'react-hot-toast';

// Pin definition
export interface Pin {
  id: number;
  position: [number, number];
  label: string;
}

// Props for the map component
interface MapWithAreaProps {
  center: [number, number];
  zoom?: number;
  pins: Pin[];
  areaPolygon: [number, number][];
}

// Create a custom numbered DivIcon
function createNumberedIcon(num: number): L.DivIcon {
  return new L.DivIcon({
    html: `
      <div style="
        background: #c62828;
        color: white;
        font-weight: bold;
        border-radius: 4px;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 2px rgba(0,0,0,0.5);
      ">
        ${num}
      </div>
    `,
    className: '',        // remove default styles
    iconAnchor: [14, 28], // bottom-center anchor
  });
}

// Map component with area overlay and numbered pins
const MapWithArea: React.FC<MapWithAreaProps> = ({
  center,
  zoom = 15,
  pins,
  areaPolygon,
}) => {
  const handleCopy = async (position: [number, number]) => {
    const coordText = `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`;
    try {
      await navigator.clipboard.writeText(coordText);
      toast.success(`已复制坐标: ${coordText}`);
    } catch {
      toast.error('复制失败，请手动长按复制');
    }
  };

  return (
    <>
      {/* Toaster provides non-blocking notifications */}
      <Toaster position="top-right" />

      <MapContainer center={center} zoom={zoom} className="w-full h-64 sm:h-80 md:h-96">
        {/* Base map */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Polygon area overlay */}
        <Polygon
          positions={areaPolygon}
          pathOptions={{ color: '#2e7d32', fillColor: '#a5d6a7', fillOpacity: 0.3, weight: 2 }}
        />

        {/* Numbered pins with copy functionality */}
        {pins.map(pin => (
          <Marker key={pin.id} position={pin.position} icon={createNumberedIcon(pin.id)}>
            <Popup>
              <div className="flex flex-col">
                <span className="font-semibold mb-2">{pin.label}</span>
                <button
                  onClick={() => handleCopy(pin.position)}
                  className="mt-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  复制坐标
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default MapWithArea;
