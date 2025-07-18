'use client';

import React from 'react';
import MapWithArea, { Pin } from "./MapWithArea";

const ParkingMap: React.FC = () => {
  // Classroom center coordinate
  const center: [number, number] = [37.376454, -122.028262];

  // Parking pins
  const pins: Pin[] = [
    { id: 1, position: [37.3764540, -122.0282622], label: '教室正对面 (临近餐厅，午/晚餐时段少，20:00后可用)' },
    { id: 2, position: [37.3768958, -122.0293411], label: '走路3min（临近餐厅，20:00后车位较多）' },
    { id: 3, position: [37.3777289, -122.0289914], label: '全天车位较多 (3min)' },
    { id: 4, position: [37.374625, -122.029546], label: 'Sunnyvale-McKinley Parking Lot (5min)' },
    { id: 5, position: [37.3787903, -122.0276932], label: '全天车位较多 (5min)' },
    { id: 6, position: [37.3752812, -122.0300536], label: '临近电影院 (6min，午/晚餐时段少)' },
    { id: 7, position: [37.3732134, -122.0311473], label: 'Whole Foods 停车场 (8min)' },
    { id: 8, position: [37.3738706, -122.0334163], label: 'Parking Pear 停车楼 (11min)' },
    { 
      id: 9,
      position: [37.376744, -122.027644],
      label: '120 Carroll St, Sunnyvale, CA 94086',
      type: 'destination'
    }
  ];

  return (
    <div>
      <h2 className="mt-6 text-xl font-bold mb-4">🅿️ Sunnyvale 教室停车指南</h2>
      <MapWithArea center={center} zoom={16} pins={pins} />
    </div>
  );
};

export default ParkingMap;
