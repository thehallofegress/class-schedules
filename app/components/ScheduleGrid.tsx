"use client";
import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit2, Trash2, Clock } from 'lucide-react';
import { useEdit } from './EditContext';
import { ClassSchedule, DaySchedule } from './types';
import { useMediaQuery } from '@/app/hooks/useMediaQuery';

interface ScheduleGridProps {
  weekDays: string[];
  schedule: DaySchedule;
  selectedClassType: string;
  selectedLocation: string;
  onSaveSchedule: (updatedSchedule: DaySchedule) => void;
  locationCities: string[];
}

interface EditingClass extends ClassSchedule {
  day: string;
  index?: number;
  duration?: string;
}

// Function to calculate class duration from time string
const calculateDuration = (timeStr: string): string => {
  try {
    // Extract start and end times from format like "9:30 AM - 11:30 AM"
    const times = timeStr.split('-').map(t => t.trim());
    
    if (times.length !== 2) return "";
    
    // Parse the time strings (handle both 12-hour and 24-hour formats)
    const parseTimeString = (timeString: string): Date => {
      const today = new Date();
      let timeDate = new Date(today.toDateString());
      
      // Check if the time is in 12-hour format with AM/PM
      if (timeString.includes('AM') || timeString.includes('PM')) {
        try {
          timeDate = new Date(today.toDateString() + ' ' + timeString);
        } catch (e) {
          console.error("Error parsing 12-hour time format:", e);
        }
      } else {
        // Assume 24-hour format (HH:MM)
        try {
          const [hours, minutes] = timeString.split(':').map(Number);
          timeDate.setHours(hours, minutes);
        } catch (e) {
          console.error("Error parsing 24-hour time format:", e);
        }
      }
      
      return timeDate;
    };
    
    const startTime = parseTimeString(times[0]);
    const endTime = parseTimeString(times[1]);
    
    // Handle cases where end time is the next day
    if (endTime < startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }
    
    // Calculate duration in minutes
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    
    // Format the duration
    if (durationMinutes >= 60) {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    } else {
      return `${durationMinutes}m`;
    }
  } catch (e) {
    console.error("Error calculating duration:", e);
    return "";
  }
};

const ClassEditForm: React.FC<{
  editingClass: EditingClass;
  onSave: (classData: EditingClass) => void;
  onCancel: () => void;
  existingClassNames: string[];
  locationCities: string[];
}> = ({ editingClass, onSave, onCancel, existingClassNames, locationCities}) => {
  console.log("locationCities: ", locationCities)
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [formData, setFormData] = useState(editingClass);
  // Parse initial time values if they exist
  const parseInitialTime = (timeString: string, isStart: boolean) => {
    if (!timeString) return { hour: isStart ? '9' : '10', minute: '00', period: isStart ? 'AM' : 'AM' };
    
    try {
      const parts = timeString.split('-');
      const timePart = isStart ? parts[0].trim() : parts[1]?.trim();
      
      if (!timePart) return { hour: isStart ? '9' : '10', minute: '00', period: isStart ? 'AM' : 'AM' };
      
      // Check for AM/PM format
      const hasPeriod = timePart.includes('AM') || timePart.includes('PM');
      const period = timePart.includes('PM') ? 'PM' : 'AM';
      
      // Extract hours and minutes
      let [hourMin] = timePart.split(' ');
      if (hasPeriod) {
        [hourMin] = timePart.split(' ');
      }
      
      const [hour, minute] = hourMin.split(':');
      
      return {
        hour: hour || (isStart ? '9' : '10'),
        minute: minute || '00',
        period: period
      };
    } catch (e) {
      console.error("Error parsing time:", e);
      return { hour: isStart ? '9' : '10', minute: '00', period: isStart ? 'AM' : 'AM' };
    }
  };

  const initialStart = parseInitialTime(formData.time, true);
  const initialEnd = parseInitialTime(formData.time, false);
  
  const [startHour, setStartHour] = useState(initialStart.hour);
  const [startMinute, setStartMinute] = useState(initialStart.minute);
  const [startPeriod, setStartPeriod] = useState(initialStart.period);
  
  const [endHour, setEndHour] = useState(initialEnd.hour);
  const [endMinute, setEndMinute] = useState(initialEnd.minute);
  const [endPeriod, setEndPeriod] = useState(initialEnd.period);

  // Generate hours options (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
  // Generate minutes options (00, 15, 30, 45)
  const minutes = ['00', '15', '30', '45'];

  // Update the full time string when any time component changes
  useEffect(() => {
    const startTimeStr = `${startHour}:${startMinute} ${startPeriod}`;
    const endTimeStr = `${endHour}:${endMinute} ${endPeriod}`;
    setFormData({ ...formData, time: `${startTimeStr} - ${endTimeStr}` });
  }, [startHour, startMinute, startPeriod, endHour, endMinute, endPeriod]);

  const renderTimeSelectors = () => {
    if (isMobile) {
      // Mobile layout - stacked time selectors
      return (
        <>
          {/* Start Time - Mobile */}
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1">开始时间</label>
            <div className="flex">
              <select 
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
                className="w-1/3 p-2 border rounded-l"
              >
                {hours.map(h => (
                  <option key={`start-hour-${h}`} value={h}>{h}</option>
                ))}
              </select>
              <select
                value={startMinute}
                onChange={(e) => setStartMinute(e.target.value)}
                className="w-1/3 p-2 border-t border-b"
              >
                {minutes.map(m => (
                  <option key={`start-min-${m}`} value={m}>{m}</option>
                ))}
              </select>
              <select
                value={startPeriod}
                onChange={(e) => setStartPeriod(e.target.value)}
                className="w-1/3 p-2 border rounded-r"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          
          {/* End Time - Mobile */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">结束时间</label>
            <div className="flex">
              <select 
                value={endHour}
                onChange={(e) => setEndHour(e.target.value)}
                className="w-1/3 p-2 border rounded-l"
              >
                {hours.map(h => (
                  <option key={`end-hour-${h}`} value={h}>{h}</option>
                ))}
              </select>
              <select
                value={endMinute}
                onChange={(e) => setEndMinute(e.target.value)}
                className="w-1/3 p-2 border-t border-b"
              >
                {minutes.map(m => (
                  <option key={`end-min-${m}`} value={m}>{m}</option>
                ))}
              </select>
              <select
                value={endPeriod}
                onChange={(e) => setEndPeriod(e.target.value)}
                className="w-1/3 p-2 border rounded-r"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        </>
      );
    }
    
    // Desktop layout - side by side time selectors
    return (
      <div className="grid grid-cols-2 gap-4">
        {/* Start Time - Desktop */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">开始时间</label>
          <div className="flex">
            <select 
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              className="w-1/3 p-2 border rounded-l"
            >
              {hours.map(h => (
                <option key={`start-hour-${h}`} value={h}>{h}</option>
              ))}
            </select>
            <select
              value={startMinute}
              onChange={(e) => setStartMinute(e.target.value)}
              className="w-1/3 p-2 border-t border-b"
            >
              {minutes.map(m => (
                <option key={`start-min-${m}`} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={startPeriod}
              onChange={(e) => setStartPeriod(e.target.value)}
              className="w-1/3 p-2 border rounded-r"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
        
        {/* End Time - Desktop */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">结束时间</label>
          <div className="flex">
            <select 
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
              className="w-1/3 p-2 border rounded-l"
            >
              {hours.map(h => (
                <option key={`end-hour-${h}`} value={h}>{h}</option>
              ))}
            </select>
            <select
              value={endMinute}
              onChange={(e) => setEndMinute(e.target.value)}
              className="w-1/3 p-2 border-t border-b"
            >
              {minutes.map(m => (
                <option key={`end-min-${m}`} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={endPeriod}
              onChange={(e) => setEndPeriod(e.target.value)}
              className="w-1/3 p-2 border rounded-r"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg p-4 sm:p-6 w-full ${isMobile ? 'max-w-sm' : 'max-w-md'}`}>
        <h3 className="text-lg font-bold mb-4">
          {editingClass.index !== undefined ? '编辑课程' : '添加新课程'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">时间</label>
            {renderTimeSelectors()}
            <div className="text-xs text-gray-500 mt-1">
              时间: {formData.time}
            </div>
          </div>
          
          {/* Class Name */}
          <div>
            <label className="block text-sm font-medium mb-1">课程名称</label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="基本功"
                list="class-names"
              />
              <datalist id="class-names">
                {existingClassNames.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>
            {existingClassNames.length > 0 && (
              <div className="mt-1">
                <label className="block text-xs text-gray-500 mb-1">常用课程:</label>
                <div className="flex flex-wrap gap-1">
                  {existingClassNames.slice(0, 5).map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setFormData({ ...formData, name })}
                      className={`text-xs px-2 py-1 rounded-full ${
                        formData.name === name
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1">地点</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="">选择地点</option>
              {locationCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          
          {/* Action Buttons - Optimized for mobile */}
          <div className={`${isMobile ? 'grid grid-cols-2' : 'flex justify-end'} gap-2 pt-4`}>
            <button
              onClick={onCancel}
              className={`px-4 py-2 text-gray-600 hover:bg-gray-100 rounded ${isMobile ? 'order-2' : ''}`}
            >
              取消
            </button>
            <button
              onClick={() => onSave(formData)}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${isMobile ? 'order-1' : ''}`}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  weekDays,
  schedule,
  selectedClassType,
  selectedLocation,
  onSaveSchedule,
  locationCities,
}) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { isEditMode } = useEdit();
  const [editingClass, setEditingClass] = useState<EditingClass | null>(null);
  const [localSchedule, setLocalSchedule] = useState<DaySchedule>(schedule);
  const [existingClassNames, setExistingClassNames] = useState<string[]>([]);

  useEffect(() => {
    setLocalSchedule(schedule);
    
    // Extract unique class names from the schedule
    if (schedule) {
      const classNames = Object.values(schedule)
        .flat()
        .map(cls => cls.name)
        .filter((name): name is string => !!name);
      
      setExistingClassNames([...new Set(classNames)]);
    }
  }, [schedule]);

  if (!schedule) {
    return null;
  }
  
  const filteredSchedule = (day: string): ClassSchedule[] => {
    return (localSchedule[day] || []).filter(class_ => {
      const matchesType = selectedClassType === 'all' || class_.name.includes(selectedClassType);
      const matchesLocation = selectedLocation === 'all' || class_.location === selectedLocation;
      return matchesType && matchesLocation;
    });
  };

  const handleAddClass = (day: string) => {
    setEditingClass({
      day,
      time: '',
      name: '',
      location: ''
    });
  };

  const handleEditClass = (day: string, classData: ClassSchedule, index: number) => {
    setEditingClass({
      ...classData,
      day,
      index
    });
  };

  const handleDeleteClass = (day: string, index: number) => {
    const newSchedule = { ...localSchedule };
    newSchedule[day] = [...(newSchedule[day] || [])];
    newSchedule[day].splice(index, 1);
    setLocalSchedule(newSchedule);
    onSaveSchedule(newSchedule);
  };

  const handleSaveClass = (classData: EditingClass) => {
    const newSchedule = { ...localSchedule };
  
    if (!newSchedule[classData.day]) {
      newSchedule[classData.day] = [];
    }
  
    const updatedClass: ClassSchedule = {
      time: classData.time,
      name: classData.name,
      location: classData.location,
    };
  
    if (typeof classData.index === "number") {
      newSchedule[classData.day][classData.index] = updatedClass;
    } else {
      newSchedule[classData.day].push(updatedClass);
    }
  
    setLocalSchedule(newSchedule);
    onSaveSchedule(newSchedule);
    setEditingClass(null);
  };
  
  const ClassCard: React.FC<{
    class_: ClassSchedule;
    day: string;
    index: number;
  }> = ({ class_, day, index }) => {
    const duration = calculateDuration(class_.time);
    const isDesktop = useMediaQuery('(min-width: 768px)');
    
    return (
      <div
        className={`relative group ${
          class_.location === 'San Jose' 
            ? 'bg-green-50 border border-green-100' 
            : 'bg-blue-50 border border-blue-100'
        } p-3 rounded-lg transition-all hover:shadow-md`}
      >
        {isDesktop ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">{class_.time}</span>
            </div>
            
            {duration && (
              <span className="text-xs text-gray-600 flex items-center gap-1">
                <Clock size={10} />
                {duration}
              </span>
            )}
            <div className="text-sm font-medium mb-2">{class_.name}</div>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <span>📍{class_.location}</span>
            </div>
          </>
        ) : (
          // Mobile layout with duration as a pill next to time
          <>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-sm font-medium">{class_.time}</span>
              {duration && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full flex items-center gap-1">
                  <Clock size={12} />
                  {duration}
                </span>
              )}
            </div>
            <div className="text-sm font-medium mb-2">{class_.name}</div>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <span>📍{class_.location}</span>
            </div>
          </>
        )}
        
        {isEditMode && (
          <div className="absolute top-2 right-2 hidden group-hover:flex gap-1 bg-white rounded-lg shadow-sm p-1">
            <button
              onClick={() => handleEditClass(day, class_, index)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => handleDeleteClass(day, index)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const CalendarView: React.FC = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="grid grid-cols-7 bg-gray-800 text-white rounded-t-lg">
        {weekDays.map((day) => (
          <div key={day} className="p-3 text-center font-medium relative">
            {day}
            {isEditMode && (
              <button
                onClick={() => handleAddClass(day)}
                className="absolute top-1 right-1 text-white hover:text-blue-200"
              >
                <PlusCircle size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {weekDays.map((day) => (
          <div key={day} className="border p-2 min-h-48">
            {filteredSchedule(day).map((class_, index) => (
              <div key={index} className="mb-2">
                <ClassCard class_={class_} day={day} index={index} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const MobileView: React.FC = () => (
    <div className="space-y-4">
      {weekDays.map((day) => {
        const classes = filteredSchedule(day);
        if (classes.length === 0 && !isEditMode) return null;

        return (
          <div key={day} className="bg-white rounded-lg shadow">
            <div className="bg-gray-800 text-white p-3 rounded-t-lg font-medium flex justify-between items-center">
              {day}
              {isEditMode && (
                <button
                  onClick={() => handleAddClass(day)}
                  className="text-white hover:text-blue-200"
                >
                  <PlusCircle size={16} />
                </button>
              )}
            </div>
            <div className="p-2 space-y-2">
              {classes.map((class_, index) => (
                <ClassCard key={index} class_={class_} day={day} index={index} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {isDesktop ? <CalendarView /> : <MobileView />}
      {editingClass && (
        <ClassEditForm
          editingClass={editingClass}
          onSave={handleSaveClass}
          onCancel={() => setEditingClass(null)}
          existingClassNames={existingClassNames}
          locationCities={locationCities}
        />
      )}
    </>
  );
};

export default ScheduleGrid;
