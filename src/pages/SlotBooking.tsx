import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSlot } from '../context/SlotContext';
import { Calendar, Clock, Check, X, Users, MapPin, AlertCircle, Info } from 'lucide-react';

const SlotBooking: React.FC = () => {
  const { user } = useAuth();
  const { timeSlots, bookSlot, getUserBooking, cancelBooking } = useSlot();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [showHelp, setShowHelp] = useState(false);
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">Please login to book a slot</p>
      </div>
    );
  }

  const userBooking = getUserBooking();
  const availableDates = [...new Set(timeSlots.map(slot => slot.date))].sort();
  
  const getSlotsForDate = (date: string) => {
    return timeSlots.filter(slot => slot.date === date);
  };

  const getSlotAvailability = (slot: any) => {
    const available = slot.maxCapacity - slot.currentBookings;
    const percentage = (available / slot.maxCapacity) * 100;

    if (percentage === 0) return { status: 'full', color: 'bg-red-100 text-red-800 border-red-200', text: 'Full' };
    if (percentage <= 25) return { status: 'low', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: `${available} left` };
    return { status: 'available', color: 'bg-green-100 text-green-800 border-green-200', text: `${available} spots` };
  };

  const handleSlotSelection = (slot: any) => {
    setSelectedSlot(slot);
    setShowConfirmation(true);
  };

  const confirmBooking = () => {
    if (selectedSlot) {
      const booking = bookSlot(selectedSlot.id);
      if (booking) {
        setShowConfirmation(false);
        setSelectedSlot(null);
      }
    }
  };

  const cancelSelection = () => {
    setShowConfirmation(false);
    setSelectedSlot(null);
  };

  const handleCancelBooking = () => {
    if (userBooking && window.confirm('Are you sure you want to cancel your booking? This action cannot be undone.')) {
      cancelBooking(userBooking.id);
    }
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

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ration Collection Slot Booking</h1>
          <p className="mt-2 text-lg text-gray-600">Book a time slot to collect your ration safely and efficiently</p>
          <div className="mt-4 flex justify-center">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 max-w-2xl">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Slots are available for the next 7 days. Please arrive on time to avoid delays.
              </p>
            </div>
          </div>
        </div>

        {userBooking ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6 bg-green-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                Your Confirmed Booking
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Date
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">{formatDate(userBooking.date)}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Time
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {formatTime(userBooking.startTime)} - {formatTime(userBooking.endTime)}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Location
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">Central Ration Distribution Center</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Booking ID</dt>
                    <dd className="mt-1 text-sm font-mono text-gray-900 bg-white px-2 py-1 rounded">{userBooking.id}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex">
                  <Info className="h-5 w-5 text-blue-400" />
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Important:</strong> Please arrive 15 minutes before your scheduled time.
                      Bring your ID and this booking confirmation. Generate your QR code from the dashboard.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  View QR Code
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Help Section */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200">
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <Info className="h-4 w-4 mr-2" />
                  How to book a slot?
                  <span className="ml-2">{showHelp ? '▼' : '▶'}</span>
                </button>
              </div>
              {showHelp && (
                <div className="px-4 py-3 bg-gray-50">
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Select a date from the calendar below</li>
                    <li>Choose an available time slot</li>
                    <li>Confirm your booking</li>
                    <li>Visit the center during your scheduled time</li>
                  </ol>
                </div>
              )}
            </div>

            {/* Date Selection */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Select Date</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Choose a date for your ration collection
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableDates.map((date) => {
                    const isSelected = selectedDate === date;
                    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
                    const dayNum = new Date(date).getDate();
                    const month = new Date(date).toLocaleDateString('en-US', { month: 'short' });

                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          isSelected
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="text-xs font-medium">{dayName}</div>
                        <div className="text-lg font-bold">{dayNum}</div>
                        <div className="text-xs">{month}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Available Time Slots
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {formatDate(selectedDate)}
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getSlotsForDate(selectedDate).map((slot) => {
                      const availability = getSlotAvailability(slot);
                      const isAvailable = slot.currentBookings < slot.maxCapacity;

                      return (
                        <div
                          key={slot.id}
                          className={`relative rounded-lg border-2 p-4 transition-all ${
                            isAvailable
                              ? 'border-gray-200 hover:border-green-300 hover:shadow-md cursor-pointer'
                              : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-75'
                          }`}
                          onClick={() => isAvailable && handleSlotSelection(slot)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {formatTime(slot.startTime)}
                              </h4>
                              <p className="text-sm text-gray-500">
                                to {formatTime(slot.endTime)}
                              </p>
                              <div className="mt-2 flex items-center">
                                <Users className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="text-sm text-gray-600">
                                  {slot.currentBookings}/{slot.maxCapacity} booked
                                </span>
                              </div>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${availability.color}`}>
                              {availability.text}
                            </div>
                          </div>

                          {!isAvailable && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-lg">
                              <span className="text-sm font-medium text-gray-500">Fully Booked</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {getSlotsForDate(selectedDate).length === 0 && (
                    <div className="text-center py-8">
                      <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No slots available</h3>
                      <p className="mt-1 text-sm text-gray-500">Please select a different date.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Confirmation Modal */}
      {showConfirmation && selectedSlot && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={cancelSelection}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-2">Confirm Booking</h3>
              <div className="mt-4 text-left bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Date:</strong> {formatDate(selectedSlot.date)}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Time:</strong> {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Location:</strong> Central Ration Distribution Center
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={confirmBooking}
                  className="px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 mb-2"
                >
                  Confirm Booking
                </button>
                <button
                  onClick={cancelSelection}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotBooking;
