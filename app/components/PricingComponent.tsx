"use client";
import React, { useState } from 'react';
import { PencilIcon, CheckIcon, XIcon, PlusCircle, Trash2 } from 'lucide-react';
import { useEdit } from './EditContext';
import { PricingData } from './types';

interface PricingComponentProps {
  initialData: PricingData;
  onSave: (data: PricingData) => Promise<void>;
}

const PricingComponent: React.FC<PricingComponentProps> = ({ initialData, onSave }) => {
  const { isEditMode } = useEdit();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(initialData);

  const handleSave = async () => {
    try {
      await onSave(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving pricing info:', error);
    }
  };

  const addHourlyRate = () => {
    setEditData({
      ...editData,
      hourlyRates: [...editData.hourlyRates, { hours: '', rate: 0 }]
    });
  };

  const removeHourlyRate = (index: number) => {
    const newRates = [...editData.hourlyRates];
    newRates.splice(index, 1);
    setEditData({ ...editData, hourlyRates: newRates });
  };

  const addPaymentMethod = () => {
    setEditData({
      ...editData,
      paymentInfo: {
        ...editData.paymentInfo,
        paymentMethods: {
          ...editData.paymentInfo.paymentMethods,
          methods: [...editData.paymentInfo.paymentMethods.methods, '']
        }
      }
    });
  };

  const removePaymentMethod = (index: number) => {
    const newMethods = [...editData.paymentInfo.paymentMethods.methods];
    newMethods.splice(index, 1);
    setEditData({
      ...editData,
      paymentInfo: {
        ...editData.paymentInfo,
        paymentMethods: {
          ...editData.paymentInfo.paymentMethods,
          methods: newMethods
        }
      }
    });
  };

  if (isEditing && isEditMode) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">💰收费标准</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <XIcon size={20} />
              </button>
              <button
                onClick={handleSave}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
              >
                <CheckIcon size={20} />
              </button>
            </div>
          </div>

          {/* Special Rates Section */}
          <div className="mb-6 space-y-2">
            <h3 className="font-medium mb-2">特殊费率</h3>
            <div className="flex items-center gap-2">
              <span className="w-24">Drop in:</span>
              <input
                className="w-24 p-2 border rounded"
                type="number"
                value={editData.specialRates.dropIn}
                onChange={(e) => setEditData({
                  ...editData,
                  specialRates: {
                    ...editData.specialRates,
                    dropIn: Number(e.target.value)
                  }
                })}
              />
              <span>/小时</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-24">网课:</span>
              <input
                className="w-24 p-2 border rounded"
                type="number"
                value={editData.specialRates.online}
                onChange={(e) => setEditData({
                  ...editData,
                  specialRates: {
                    ...editData.specialRates,
                    online: Number(e.target.value)
                  }
                })}
              />
              <span>/小时</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-24">试课:</span>
              <input
                className="w-24 p-2 border rounded"
                type="number"
                value={editData.specialRates.trial}
                onChange={(e) => setEditData({
                  ...editData,
                  specialRates: {
                    ...editData.specialRates,
                    trial: Number(e.target.value)
                  }
                })}
              />
              <span>/小时</span>
            </div>
          </div>

          {/* Regular Hourly Rates Section */}
          <h3 className="font-medium mb-2">常规费率</h3>
          <div className="space-y-2">
            {editData.hourlyRates.map((rate, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  className="flex-1 p-2 border rounded"
                  placeholder="Hours"
                  value={rate.hours}
                  onChange={(e) => {
                    const newRates = [...editData.hourlyRates];
                    newRates[index].hours = e.target.value;
                    setEditData({ ...editData, hourlyRates: newRates });
                  }}
                />
                <input
                  className="w-24 p-2 border rounded"
                  type="number"
                  value={rate.rate}
                  onChange={(e) => {
                    const newRates = [...editData.hourlyRates];
                    newRates[index].rate = Number(e.target.value);
                    setEditData({ ...editData, hourlyRates: newRates });
                  }}
                />
                <button
                  onClick={() => removeHourlyRate(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={addHourlyRate}
              className="w-full p-2 mt-2 border-dashed border-2 border-gray-300 rounded flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50"
            >
              <PlusCircle size={16} />
              添加费率
            </button>
          </div>
        </div>

        {/* Payment Methods Section - Unchanged */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">付费方式</h2>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded">
              <input
                className="font-medium w-full p-2 rounded border mb-2"
                value={editData.paymentInfo.registration.title}
                onChange={(e) => setEditData({
                  ...editData,
                  paymentInfo: {
                    ...editData.paymentInfo,
                    registration: {
                      ...editData.paymentInfo.registration,
                      title: e.target.value
                    }
                  }
                })}
              />
              <div className="flex gap-2">
                <input
                  className="w-24 p-2 rounded border"
                  value={editData.paymentInfo.registration.fee}
                  onChange={(e) => setEditData({
                    ...editData,
                    paymentInfo: {
                      ...editData.paymentInfo,
                      registration: {
                        ...editData.paymentInfo.registration,
                        fee: e.target.value
                      }
                    }
                  })}
                />
                <input
                  className="flex-1 p-2 rounded border"
                  value={editData.paymentInfo.registration.note}
                  onChange={(e) => setEditData({
                    ...editData,
                    paymentInfo: {
                      ...editData.paymentInfo,
                      registration: {
                        ...editData.paymentInfo.registration,
                        note: e.target.value
                      }
                    }
                  })}
                />
              </div>
            </div>

            <div className="p-3 bg-green-50 rounded">
              <input
                className="font-medium w-full p-2 rounded border mb-2"
                value={editData.paymentInfo.paymentCycle.title}
                onChange={(e) => setEditData({
                  ...editData,
                  paymentInfo: {
                    ...editData.paymentInfo,
                    paymentCycle: {
                      ...editData.paymentInfo.paymentCycle,
                      title: e.target.value
                    }
                  }
                })}
              />
              <input
                className="w-full p-2 rounded border mb-2"
                value={editData.paymentInfo.paymentCycle.offline}
                onChange={(e) => setEditData({
                  ...editData,
                  paymentInfo: {
                    ...editData.paymentInfo,
                    paymentCycle: {
                      ...editData.paymentInfo.paymentCycle,
                      offline: e.target.value
                    }
                  }
                })}
              />
              <input
                className="w-full p-2 rounded border"
                value={editData.paymentInfo.paymentCycle.online}
                onChange={(e) => setEditData({
                  ...editData,
                  paymentInfo: {
                    ...editData.paymentInfo,
                    paymentCycle: {
                      ...editData.paymentInfo.paymentCycle,
                      online: e.target.value
                    }
                  }
                })}
              />
            </div>

            <div className="p-3 bg-gray-50 rounded">
              <input
                className="font-medium w-full p-2 rounded border mb-2"
                value={editData.paymentInfo.paymentMethods.title}
                onChange={(e) => setEditData({
                  ...editData,
                  paymentInfo: {
                    ...editData.paymentInfo,
                    paymentMethods: {
                      ...editData.paymentInfo.paymentMethods,
                      title: e.target.value
                    }
                  }
                })}
              />
              {editData.paymentInfo.paymentMethods.methods.map((method, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    className="flex-1 p-2 rounded border"
                    value={method}
                    onChange={(e) => {
                      const newMethods = [...editData.paymentInfo.paymentMethods.methods];
                      newMethods[index] = e.target.value;
                      setEditData({
                        ...editData,
                        paymentInfo: {
                          ...editData.paymentInfo,
                          paymentMethods: {
                            ...editData.paymentInfo.paymentMethods,
                            methods: newMethods
                          }
                        }
                      });
                    }}
                  />
                  <button
                    onClick={() => removePaymentMethod(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={addPaymentMethod}
                className="w-full p-2 mt-2 border-dashed border-2 border-gray-300 rounded flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50"
              >
                <PlusCircle size={16} />
                添加支付方式
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
      {isEditMode && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 p-2 text-gray-600 hover:text-blue-600"
        >
          <PencilIcon size={16} />
        </button>
      )}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          💰收费标准
        </h2>
        
        {/* Display Special Rates */}
        <div className="mb-6 space-y-2">
          <h3 className="font-medium mb-2">特殊费率</h3>
          <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
            <span>Drop in</span>
            <span className="font-medium">${editData.specialRates.dropIn}/小时</span>
          </div>
          <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
            <span>网课</span>
            <span className="font-medium">${editData.specialRates.online}/小时</span>
          </div>
          <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
            <span>试课</span>
            <span className="font-medium">${editData.specialRates.trial}/小时</span>
          </div>
        </div>

        {/* Display Regular Rates */}
        <h3 className="font-medium mb-2">常规费率</h3>
        <div className="space-y-2">
          {editData.hourlyRates.map((rate) => (
            <div key={rate.hours} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <span>每周{rate.hours}小时</span>
              <span className="font-medium">${rate.rate}/小时</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">付费方式</h2>
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 rounded">
            <p className="font-medium">{editData.paymentInfo.registration.title}</p>
            <p>${editData.paymentInfo.registration.fee}，{editData.paymentInfo.registration.note}</p>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <p className="font-medium">{editData.paymentInfo.paymentCycle.title}</p>
            <p>{editData.paymentInfo.paymentCycle.offline}</p>
            <p>{editData.paymentInfo.paymentCycle.online}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-medium">{editData.paymentInfo.paymentMethods.title}</p>
            <p>{editData.paymentInfo.paymentMethods.methods.join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingComponent;
