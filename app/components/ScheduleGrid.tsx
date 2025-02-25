"use client";

import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import { useEdit } from './EditContext';
import { ClassSchedule, DaySchedule } from './types';

interface ScheduleGridProps {
  weekDays: string[];
  schedule: DaySchedule;
  selectedClassType: string;
  selectedLocation: string;
  onSaveSchedule: (updatedSchedule: DaySchedule) => void;
}

interface EditingClass extends ClassSchedule {
  day: string;
  index?: number;
}

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

const ClassEditForm: React.FC<{
  editingClass: EditingClass;
  onSave: (classData: EditingClass) => void;
  onCancel: () => void;
}> = ({ editingClass, onSave, onCancel }) => {
  const [formData, setFormData] = useState(editingClass);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">
          {editingClass.index !== undefined ? '编辑课程' : '添加新课程'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">时间</label>
            <input
              type="text"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="9:30 AM - 11:30 AM"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">课程名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="基本功"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">地点</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="">选择地点</option>
              <option value="San Jose">San Jose</option>
              <option value="Mountain View">Mountain View</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              取消
            </button>
            <button
              onClick={() => onSave(formData)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
}) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { isEditMode } = useEdit();
  const [editingClass, setEditingClass] = useState<EditingClass | null>(null);
  const [localSchedule, setLocalSchedule] = useState<DaySchedule>(schedule);

  useEffect(() => {
    setLocalSchedule(schedule);
  }, [schedule]);

  if (!schedule) {
    return
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
  }> = ({ class_, day, index }) => (
    <div
      className={`relative group ${
        class_.location === 'San Jose' 
          ? 'bg-green-50 border border-green-100' 
          : 'bg-blue-50 border border-blue-100'
      } p-3 rounded-lg transition-all hover:shadow-md`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium">{class_.time}</span>
      </div>
      <div className="text-sm font-medium mb-2">{class_.name}</div>
      <div className="flex items-center gap-1 text-xs text-gray-600">
        <span>📍{class_.location}</span>
      </div>
      
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
        />
      )}
    </>
  );
};

export default ScheduleGrid;
