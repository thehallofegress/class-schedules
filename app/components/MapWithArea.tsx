'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast, { Toaster } from 'react-hot-toast';

// Pin definition
export interface Pin {
  id: number;
  position: [number, number];
  label: string;
  type?: 'default' | 'destination';
}

// Props for the map component
interface MapWithAreaProps {
  center: [number, number];
  zoom?: number;
  pins: Pin[];
}

const destinationIcon = L.divIcon({
  html: `
    <div style="
      width: 40px;
      height: 40px;
      background: #f06292;
      border-radius: 50% 50% 50% 50%;
      position: relative;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">
      <div style="
        content: '';
        position: absolute;
        bottom: -12px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 12px solid #f06292;
      "></div>
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 20px;
        font-weight: bold;
      ">⭐</div>
    </div>
  `,
  className: '',
  iconAnchor: [20, 52], // Anchor at bottom of the "tail"
  popupAnchor: [0, -50],
});



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
}) => {
  const [lat, lng] = center
  const shiftedCenter: [number,number] = [lat, lng - 0.002]
  const handleCopy = async (value: string | [number, number]) => {
    const textToCopy =
      typeof value === 'string'
        ? value
        : `${value[0].toFixed(6)}, ${value[1].toFixed(6)}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success(`已复制: ${textToCopy}`);
    } catch {
      toast.error('复制失败，请手动长按复制');
    }
  };

  return (
    <>
      {/* Toaster provides non-blocking notifications */}
      <Toaster position="top-right" />

      <MapContainer center={shiftedCenter} zoom={zoom} className="w-full h-[30rem] sm:h-[75vh] md:h-[85vh]">
        {/* Base map */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Numbered pins with copy functionality */}
        {pins.map(pin => (
          <Marker key={pin.id} position={pin.position} icon={ pin.type === 'destination' ? destinationIcon: createNumberedIcon(pin.id)
    }>
            <Popup>
              <div className="flex flex-col">
                <span className="font-semibold mb-2">{pin.label}</span>
                <button
                  onClick={() => handleCopy(pin.type === 'destination' ? pin.label : pin.position)}
                  className="mt-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  {pin.type === 'destination' ? '复制地址' : '复制坐标'}
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
