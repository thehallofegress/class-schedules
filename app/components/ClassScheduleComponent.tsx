"use client"; 
import React, { useState, useEffect } from 'react';
import ScheduleGrid from './ScheduleGrid';
import FilterComponent from './FilterComponent';
import LocationComponent from './LocationComponent';
import PasswordModal from './PasswordModal';
import { useEdit } from './EditContext';
import { Settings } from 'lucide-react';
import ContactComponent from './ContactComponent';
import PricingComponent from './PricingComponent';
import { ContactInfo, LocationData, PricingData } from './types';

interface ClassSchedule {
  time: string;
  name: string;
  location: string;
}

interface DaySchedule {
  [key: string]: ClassSchedule[];
}

export interface ClassType {
  id: string;
  name: string;
}

const extractClassTypes = (schedule?: DaySchedule) => {
  // Get all class names
  if (!schedule) {
    return []
  }
  const classNames = Object.values(schedule)
    .flat() // Flatten into a single array
    .map((item) => item.name.replace(/\s*\(.*?\)/, "")); // Remove any level indicators (e.g., "(中高级)")
  // Create a unique list
  const uniqueClassTypes = Array.from(new Set(classNames));
  // Format it into the required structure
  return [
    { id: "all", name: "所有课程" }, // Default option
    ...uniqueClassTypes.map((className) => ({
      id: className,
      name: className,
    })),
  ];
};

const ClassScheduleComponent = () => {
  const [selectedClassType, setSelectedClassType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('schedule');

  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [schedule, setSchedule] = useState<DaySchedule>({});
  const [contactData, setContactData] = useState<ContactInfo>({
    zoomInfo: {
      title: "网课信息",
      zoomId: "",
      zoomLink: ""
    },
    teacherInfo: {
      title: "老师联系方式",
      name: "",
      wechatId: ""
    }
  });
  
  const [pricingData, setPricingData] = useState<PricingData>({
    hourlyRates: [],
    specialRates: {
      dropIn: 0,
      online: 0,
      trial: 0,
    },
    paymentInfo: {
      registration: {
        title: "新生报名",
        fee: "",
        note: ""
      },
      paymentCycle: {
        title: "付款周期",
        offline: "",
        online: ""
      },
      paymentMethods: {
        title: "支付方式",
        methods: []
      }
    }
  });

  const [locationData, setLocationdata] = useState<LocationData>({locations:[]})
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { isEditMode, setIsEditMode, isAuthenticated } = useEdit();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [scheduleResponse, priceResponse, contactReponse, locationResponse] = await Promise.all([
          fetch('/class-schedule.json'),
          fetch('/class-pricing.json'),
          fetch('/class-contact.json'),
          fetch('./class-locations.json')
        ]);

        if (!scheduleResponse.ok) {
          throw new Error('Failed to fetch schedule data');
        }
        if (!priceResponse.ok) {
          throw new Error('Failed to fetch price data');
        }
        if (!contactReponse.ok) {
          throw new Error('Failed to fetch contact data');
        }
        if (!locationResponse.ok) {
          throw new Error('Failed to fetch location data');
        }
        const scheduleData = await scheduleResponse.json();
        setSchedule(scheduleData.schedule);
        setClassTypes(extractClassTypes(scheduleData.schedule))
        
        // Fetch price / contact info
        const priceData = await priceResponse.json();
        setPricingData(priceData)

        const contactData = await contactReponse.json();
        setContactData(contactData.contact);

        const locationData = await locationResponse.json();
        setLocationdata(locationData)
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load class data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
      try {
        setIsLoading(true);
        
        const response = await fetch('/api/saveJson', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: 'class-schedule.json',
            data: { schedule: newSchedule },
          })
        });
    
        if (!response.ok) {
          throw new Error('Failed to save schedule');
        }
    
        setSchedule(newSchedule);
        // Optional: Show success message
        alert('Schedule saved successfully');
        
      } catch (error) {
        console.error('Error saving schedule:', error);
        // Show error message to user
        alert('Failed to save schedule. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    const saveContactData = async (newContactData: ContactInfo) => {
      try {
        const response = await fetch('/api/saveJson', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: 'class-contact.json',
            data: {contact : newContactData}
          })
        });
    
        if (!response.ok) {
          throw new Error('Failed to save contact information');
        }
        
        setContactData(newContactData);
      } catch (error) {
        console.error('Error saving contact data:', error);
        alert('Failed to save contact information. Please try again.');
        throw error;
      }
    };
    
    const savePricingData = async (newPricingData: PricingData) => {
      try {
        const response = await fetch('/api/saveJson', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: 'class-pricing.json',
            data: newPricingData
          })
        });
    
        if (!response.ok) {
          throw new Error('Failed to save pricing information');
        }
        
        setPricingData(newPricingData);
      } catch (error) {
        console.error('Error saving pricing data:', error);
        alert('Failed to save pricing information. Please try again.');
        throw error;
      }
    };

    const saveLocationData = async (newLocationData: LocationData) => {
      try {
        const response = await fetch('/api/saveJson', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: 'class-pricing.json',
            data: newLocationData
          })
        });
    
        if (!response.ok) {
          throw new Error('Failed to save location information');
        }
        
        setLocationdata(newLocationData);
      } catch (error) {
        console.error('Error saving location data:', error);
        alert('Failed to save location information. Please try again.');
        throw error;
      }
    };
 
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">成人班2025年课程表</h1>
        <p className="text-gray-600">授课老师: 王晓明</p>
        <p className="text-gray-500 text-sm">2024.12.01 更新版</p>

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
