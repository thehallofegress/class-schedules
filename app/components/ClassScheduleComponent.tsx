"use client";
import React, { useEffect, useState } from 'react';
import ScheduleGrid from './ScheduleGrid';
import FilterComponent from './FilterComponent';
import LocationComponent from './LocationComponent';
import PasswordModal from './PasswordModal';
import { useEdit } from './EditContext';
import { Settings } from 'lucide-react';
import PricingComponent from './PricingComponent';
import { ClassType, ContactInfo, DaySchedule, LocationInfo, PricingInfo, ScheduleData, TABLES } from './types';
import { useClassSchedule } from '@/app/hooks/useClassSchedule';
import { saveDataWithUpsert } from '@/app/api/saveData';
import { parseTime } from '@/app/utils/handleTime';
import AnnouncementsContainer from './AnnouncementsContainer';
import AnnouncementsManagement from './AnnouncementsManagement';
import TabButton, { TabEnum } from './TabButton';
import ContactComponent from './ContactComponent';

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
    scheduleData,
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
    fetchData,
    isLoading,
    error,
  } = useClassSchedule();

  const [selectedClassType, setSelectedClassType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<TabEnum>(TabEnum.Schedule);

  const [classTypes, setClassTypes] = useState<ClassType[]>([]);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { isEditMode, setIsEditMode } = useEdit();

  useEffect(() => {
    setClassTypes(extractClassTypes(scheduleData?.schedule));
  }, [scheduleData]);

  const handleExit = () => {
    setIsEditMode(false); // Set edit mode to false, assuming exit means leaving edit mode
  
    if (activeTab === TabEnum.Announcement) {
      setActiveTab(TabEnum.Schedule);
    }
  };

  const formattedLastUpdated = scheduleData?.lastUpdated
    ? new Date(scheduleData?.lastUpdated).toLocaleDateString() : "未更新";

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
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
      id: scheduleData.id,
      schedule: sortedSchedule,
      lastUpdated: new Date().toISOString(),
    };

    await saveDataWithUpsert(
      TABLES.schedule,
      updatedSchedule,
      setScheduleData,
      setScheduleLastUpdated,
      "id",
      () => {
        console.log("Schedule saved successfully");
        fetchData(true);
      }
    );
  };

  const saveContactData = async (newContactData: ContactInfo) => {
    const updatedContactData = {
      id: contactData.id,
      contact: newContactData,
      lastUpdated: new Date().toISOString(),
    };

    await saveDataWithUpsert(
      TABLES.contact,
      updatedContactData,
      setContactData,
      setContactLastUpdated,
      "id",
      () => {
        console.log("Contact info saved successfully");
        fetchData(true);
      }
    );
  };

  const savePricingData = async (newPricingData: PricingInfo) => {
    const updatedPricing = {
      id: pricingData.id,
      pricing: newPricingData,
      lastUpdated: new Date().toISOString(),
    };

    await saveDataWithUpsert(
      TABLES.pricing,
      updatedPricing,
      setPricingData,
      setPricingLastUpdated,
      "id",
      () => {
        console.log("Pricing info saved successfully");
        fetchData(true);
      }
    );
  };

  const saveLocationData = async (newLocationData: LocationInfo[]) => {
    const updatedLocation = {
      id: locationData.id,
      locations: newLocationData,
      lastUpdated: new Date().toISOString(),
    };

    await saveDataWithUpsert(
      TABLES.locations,
      updatedLocation,
      setLocationData,
      setLocationLastUpdated,
      "id",
      () => {
        console.log("Location info saved successfully");
        fetchData(true);
      }
    );
  };

  const uniqueCities = locationData?.locations
  ? Array.from(new Set(locationData.locations.map(location => location.city)))
  : ["San jose", "Sunnyvale"];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <header className="text-center mb-8 relative">
        <h2 className="text-3xl font-bold mb-2">SVDA成人班课程表</h2>
        <p className="text-gray-900"> 🕺授课老师: 王晓明🤸 </p>
        
        {!isEditMode && (
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="absolute top-0 right-0 m-[-10px] text-gray-600 hover:text-blue-600"
          >
            <Settings size={20} />
          </button>
        )}
        {isEditMode && (
          <button
            onClick={handleExit}
            className="absolute top-0 right-0 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            退出编辑模式
          </button>
        )}
      </header>
      <AnnouncementsContainer />

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
        <TabButton id={TabEnum.Schedule} label="📅 课程表" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id={TabEnum.Locations} label="📍 地点信息" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id={TabEnum.Contact} label="💬 联系方式" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id={TabEnum.Pricing} label="💰 收费信息" activeTab={activeTab} setActiveTab={setActiveTab} />
        {isEditMode && <TabButton id={TabEnum.Announcement} label="📢 通知管理" activeTab={activeTab} setActiveTab={setActiveTab} />}
      </div>

      {activeTab === TabEnum.Schedule && (
        <>
          {/* Filters */}
          <FilterComponent
            selectedClassType={selectedClassType}
            setSelectedClassType={setSelectedClassType}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            classTypes={classTypes}
            locationCities={uniqueCities}
          />
          {/* Schedule Grid */}
          <ScheduleGrid
            weekDays={weekDays}
            schedule={scheduleData.schedule}
            selectedClassType={selectedClassType}
            selectedLocation={selectedLocation}
            onSaveSchedule={saveScheduleData}
            locationCities={uniqueCities}
          />
          <div className="mt-4 bg-blue-50 p-4 rounded-lg">
            <h2 className="font-bold mb-2 flex items-center gap-2">
              👯 补课规则指南 💪
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-left">
            <li>补课必须在 <span className="bg-blue-200 px-1 rounded font-semibold">自报名之日起四个月内</span> 完成。</li>
            <li>补课需在 <span className="bg-blue-200 px-1 rounded font-semibold">已报课的前提下</span> 进行，新学期 <span className="bg-blue-200 px-1 rounded font-semibold">不可仅补课而不报课</span>。</li>
            <li>如在规定时间内未完成补课，学校将 <span className="bg-blue-200 px-1 rounded font-semibold">不予退款</span>，且课时费用 <span className="bg-blue-200 px-1 rounded font-semibold">不得用于未来抵扣</span>。</li>
            <li>若有疑问，请及时向老师咨询🫶。</li>
          </ul>
          </div>
          <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
            <h2 className="font-bold mb-2 flex items-center gap-2">
              💬 报课注意事项
            </h2>
            <ol className="list-decimal pl-5 space-y-1 text-left">
              <li>基本功（初级）课适合包含零基础在内的所有同学，基本功（中高级）课更适合有一定基础的同学</li>
              <li>剑舞课、水袖课、身韵课 不能随时加入新生</li>
            </ol>
          </div>
        </>
      )}

      {activeTab === TabEnum.Locations && (
        <LocationComponent
          initialData={locationData.locations}
          onSave={saveLocationData}
        />
      )}

      {activeTab === TabEnum.Contact && (
        <ContactComponent
          initialData={contactData.contact}
          onSave={saveContactData}
        />
      )}

      {activeTab === TabEnum.Pricing && (
        <PricingComponent
          initialData={pricingData.pricing}
          onSave={savePricingData}
        />
      )}

      {isEditMode && activeTab === TabEnum.Announcement && (
        <AnnouncementsManagement />
      )}

      <footer className="mt-10 text-center text-gray-500 text-sm py-4">
        <p>© {formattedLastUpdated} 更新版</p>
      </footer>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default ClassScheduleComponent;
