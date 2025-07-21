import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSlot } from '../context/SlotContext';
import { PlusCircle, Edit, Trash2, Save, X, Calendar, Clock, Users } from 'lucide-react';

const ManageSlots: React.FC = () => {
  const { admin } = useAuth();
  const { timeSlots, bookings, addTimeSlot, updateTimeSlot, deleteTimeSlot } = useSlot();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    maxCapacity: 20
  });

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">Please login as admin to access this page</p>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'maxCapacity' ? parseInt(value) : value
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTimeSlot(formData);
    setFormData({ date: '', startTime: '', endTime: '', maxCapacity: 20 });
    setIsAdding(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateTimeSlot(editingId, formData);
      setEditingId(null);
    }
  };

  const startEditing = (slot: any) => {
    setEditingId(slot.id);
    setFormData({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      maxCapacity: slot.maxCapacity
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Group slots by date for better organization
  const slotsByDate = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, typeof timeSlots>);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Time Slots</h1>
          <p className="mt-2 text-lg text-gray-600">Add, update, or remove time slots for ration collection</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Time Slots</h3>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add New Slot
              </button>
            )}
          </div>

          {isAdding && (
            <div className="px-4 py-5 bg-gray-50 sm:px-6">
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      id="startTime"
                      required
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      id="endTime"
                      required
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700">
                      Max Capacity
                    </label>
                    <input
                      type="number"
                      name="maxCapacity"
                      id="maxCapacity"
                      required
                      min="1"
                      value={formData.maxCapacity}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Add Slot
                  </button>
                </div>
              </form>
            </div>
          )}

          {Object.keys(slotsByDate).length > 0 ? (
            Object.entries(slotsByDate)
              .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
              .map(([date, slots]) => (
                <div key={date} className="border-b border-gray-200 last:border-b-0">
                  <div className="px-4 py-3 bg-gray-50">
                    <h4 className="text-md font-medium text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(date)}
                    </h4>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {slots.map((slot) => (
                      <li key={slot.id} className="px-4 py-4 sm:px-6">
                        {editingId === slot.id ? (
                          <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                              <div>
                                <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700">
                                  Date
                                </label>
                                <input
                                  type="date"
                                  name="date"
                                  id="edit-date"
                                  required
                                  value={formData.date}
                                  onChange={handleInputChange}
                                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                              <div>
                                <label htmlFor="edit-startTime" className="block text-sm font-medium text-gray-700">
                                  Start Time
                                </label>
                                <input
                                  type="time"
                                  name="startTime"
                                  id="edit-startTime"
                                  required
                                  value={formData.startTime}
                                  onChange={handleInputChange}
                                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                              <div>
                                <label htmlFor="edit-endTime" className="block text-sm font-medium text-gray-700">
                                  End Time
                                </label>
                                <input
                                  type="time"
                                  name="endTime"
                                  id="edit-endTime"
                                  required
                                  value={formData.endTime}
                                  onChange={handleInputChange}
                                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                              <div>
                                <label htmlFor="edit-maxCapacity" className="block text-sm font-medium text-gray-700">
                                  Max Capacity
                                </label>
                                <input
                                  type="number"
                                  name="maxCapacity"
                                  id="edit-maxCapacity"
                                  required
                                  min={slot.currentBookings}
                                  value={formData.maxCapacity}
                                  onChange={handleInputChange}
                                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                              <button
                                type="button"
                                onClick={cancelEditing}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {slot.startTime} - {slot.endTime}
                                </h4>
                              </div>
                              <div className="mt-1 flex items-center">
                                <Users className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-sm text-gray-500">
                                  {slot.currentBookings} / {slot.maxCapacity} booked
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => startEditing(slot)}
                                className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteTimeSlot(slot.id)}
                                className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                disabled={slot.currentBookings > 0}
                                title={slot.currentBookings > 0 ? "Cannot delete slots with bookings" : ""}
                              >
                                <Trash2 className={`h-4 w-4 ${slot.currentBookings > 0 ? 'opacity-50' : ''}`} />
                              </button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
          ) : (
            <div className="px-4 py-5 text-center text-gray-500">
              No time slots available. Add some slots to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSlots;