import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSlot } from '../context/SlotContext';
import { Calendar, Clock, Check, X } from 'lucide-react';

const SlotBooking: React.FC = () => {
  const { user } = useAuth();
  const { timeSlots, bookSlot, getUserBooking, cancelBooking } = useSlot();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('');
  
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
    return timeSlots.filter(slot => 
      slot.date === date && slot.currentBookings < slot.maxCapacity
    );
  };

  const handleBookSlot = (slotId: string) => {
    const booking = bookSlot(slotId);
    if (booking) {
      alert('Slot booked successfully!');
    }
  };

  const handleCancelBooking = () => {
    if (userBooking) {
      cancelBooking(userBooking.id);
      alert('Booking cancelled successfully!');
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ration Collection Slot Booking</h1>
          <p className="mt-2 text-lg text-gray-600">Book a time slot to collect your ration</p>
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
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(userBooking.date)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Time
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatTime(userBooking.startTime)} - {formatTime(userBooking.endTime)}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Booking ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userBooking.id}</dd>
                </div>
              </dl>
              <div className="mt-6">
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
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Available Slots</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Select a date and time slot for ration collection
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="mb-6">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Select Date
                </label>
                <select
                  id="date"
                  name="date"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  <option value="">Select a date</option>
                  {availableDates.map((date) => (
                    <option key={date} value={date}>
                      {formatDate(date)}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDate && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Available Time Slots</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {getSlotsForDate(selectedDate).map((slot) => (
                      <div
                        key={slot.id}
                        className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {slot.maxCapacity - slot.currentBookings} spots available
                          </p>
                        </div>
                        <button
                          onClick={() => handleBookSlot(slot.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Book
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotBooking;