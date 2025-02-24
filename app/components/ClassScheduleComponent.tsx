"use client"; 
import React, { useEffect, useState} from 'react';
import ScheduleGrid from './ScheduleGrid';
import FilterComponent from './FilterComponent';
import LocationComponent from './LocationComponent';
import PasswordModal from './PasswordModal';
import { useEdit } from './EditContext';
import { Settings } from 'lucide-react';
import ContactComponent from './ContactComponent';
import PricingComponent from './PricingComponent';
import { ClassType, ContactInfo, DaySchedule, LocationData, PricingData, ScheduleData } from './types';
import { useClassSchedule } from '@/app/hooks/useClassSchedule';
import { saveData } from '@/app/utils/saveData';
import {parseTime} from '@/app/utils/handleTime';

const extractClassTypes = (schedule?: DaySchedule) => {
  if (!schedule) return [];

  const classNames = Object.values(schedule)
    .flat()
    .map((item) => (item.name ? item.name.replace(/\s*\(.*?\)/, "") : "")) // Safeguard against undefined name
    .filter((name) => name !== ""); // Remove empty strings

  const uniqueClassTypes = Array.from(new Set(classNames));

  return [
    { id: "all", name: "所有课程" },
    ...uniqueClassTypes.map((className) => ({ id: className, name: className })),
  ];
};

const ClassScheduleComponent = () => {
  const {
    schedule,
    scheduleLastUpdated,
    contactData,
    pricingData,
    locationData,
    setScheduleData,
    setContactData,
    setPricingData,
    setLocationData,
    setScheduleLastUpdated,
    setContactLastUpdated,
    setPricingLastUpdated,
    setLocationLastUpdated,
    isLoading,
    error,
  } = useClassSchedule();

  const [selectedClassType, setSelectedClassType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('schedule');

  const [classTypes, setClassTypes] = useState<ClassType[]>([]);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { isEditMode, setIsEditMode } = useEdit();

  useEffect(() => {
    setClassTypes(extractClassTypes(schedule));
  }, [schedule]);

  const formattedLastUpdated = scheduleLastUpdated
  ? new Date(scheduleLastUpdated).toLocaleDateString() : "未更新";

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const TabButton = ({ id, label, icon }: { id: string; label: string; icon?: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === id ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

    // Show loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading schedule...</p>
          </div>
        </div>
      );
    }
  
    // Show error state
    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    const saveScheduleData = async (newSchedule: DaySchedule) => {
      // Sort each day's schedule before saving
      const sortedSchedule = Object.fromEntries(
        Object.entries(newSchedule).map(([day, classes]) => [
          day,
          [...classes].sort((a, b) => parseTime(a.time) - parseTime(b.time)),
        ])
      );
    
      const updatedSchedule: ScheduleData = {
        schedule: sortedSchedule,
        lastUpdated: new Date().toISOString(),
      };
    
      await saveData("class-schedule.json", updatedSchedule, setScheduleData, setScheduleLastUpdated);
    };
    
    const saveContactData = async (newContactData: ContactInfo) => {
      const updatedContact = {
        ...newContactData, // Spread the existing fields
        lastUpdated: new Date().toISOString(), // ✅ Add lastUpdated separately
      };
    
      await saveData("class-contact.json", updatedContact, setContactData, setContactLastUpdated);
    };

    const savePricingData = async (newPricingData: PricingData) => {
      const updatedPricing = {
        ...newPricingData,
        lastUpdated: new Date().toISOString(),
      };
      await saveData("class-pricing.json", updatedPricing, setPricingData, setPricingLastUpdated);
    };
    
    const saveLocationData = async (newLocationData: LocationData) => {
      const updatedLocation = {
        ...newLocationData,
        lastUpdated: new Date().toISOString(),
      };
      await saveData("class-locations.json", updatedLocation, setLocationData, setLocationLastUpdated);
    };
    
    
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">成人班2025年课程表</h1>
        <p className="text-gray-600">授课老师: 王晓明</p>
        <p className="text-gray-500 text-sm"> {formattedLastUpdated} 更新版</p>

        {!isEditMode && (
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="absolute top-0 right-0 p-2 text-gray-600 hover:text-blue-600"
          >
            <Settings size={20} />
          </button>
        )}
                {isEditMode && (
          <button
            onClick={() => setIsEditMode(false)}
            className="absolute top-0 right-0 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Exit Edit Mode
          </button>
        )}
      </header>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-4 mb-6">
        <TabButton id="schedule" label="📅 课程表" />
        <TabButton id="location" label="📍 地点信息" />
        <TabButton id="contact" label="💬 联系方式"/>
        <TabButton id="pricing" label="💰 收费信息" />
      </div>

      {activeTab === 'schedule' && (
        <>
          {/* Filters */}
          <FilterComponent
            selectedClassType={selectedClassType}
            setSelectedClassType={setSelectedClassType}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            classTypes={classTypes}
          />
          {/* Schedule Grid */}
          <ScheduleGrid 
            weekDays={weekDays}
            schedule={schedule}
            selectedClassType={selectedClassType}
            selectedLocation={selectedLocation}
            onSaveSchedule={saveScheduleData}
          />
          <div className="mt-8 bg-yellow-50 p-4 rounded-lg">
            <h2 className="font-bold mb-2 flex items-center gap-2">
            💬 报课注意事项
            </h2>
            <ol className="list-decimal pl-5 space-y-1 text-left">
              <li>周二上午、周四、周日基本功课适合包含零基础在内的所有同学，周五、周六基本功课更适合有一定基础的同学</li>
              <li>剑舞课、水袖课、身韵课 不能随时加入新生</li>
            </ol>
          </div>
        </>
      )}

      {activeTab === 'location' && (
        <LocationComponent 
          initialData={locationData}
          onSave={saveLocationData}
        />
      )}

    {activeTab === 'contact' && (
      <ContactComponent 
        initialData={contactData}
        onSave={saveContactData}
      />
    )}

    {activeTab === 'pricing' && (
      <PricingComponent
        initialData={pricingData}
        onSave={savePricingData}
      />
    )}
    
    <PasswordModal
      isOpen={isPasswordModalOpen}
      onClose={() => setIsPasswordModalOpen(false)}
    />
    </div>
  );
};

export default ClassScheduleComponent;
