import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TimeSlot, SlotBooking, User } from '../types';
import { useAuth } from './AuthContext';

interface SlotContextType {
  timeSlots: TimeSlot[];
  bookings: SlotBooking[];
  addTimeSlot: (slot: Omit<TimeSlot, 'id' | 'currentBookings'>) => void;
  updateTimeSlot: (id: string, slot: Partial<TimeSlot>) => void;
  deleteTimeSlot: (id: string) => void;
  bookSlot: (slotId: string) => SlotBooking | null;
  cancelBooking: (bookingId: string) => void;
  getUserBooking: () => SlotBooking | null;
  getSlotById: (slotId: string) => TimeSlot | undefined;
  getAvailableSlots: () => TimeSlot[];
}

// Mock initial data - next 7 days with morning and afternoon slots
const generateInitialSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    
    // Morning slot: 9 AM - 12 PM
    slots.push({
      id: `morning-${dateString}`,
      date: dateString,
      startTime: '09:00',
      endTime: '12:00',
      maxCapacity: 20,
      currentBookings: 0
    });
    
    // Afternoon slot: 2 PM - 5 PM
    slots.push({
      id: `afternoon-${dateString}`,
      date: dateString,
      startTime: '14:00',
      endTime: '17:00',
      maxCapacity: 20,
      currentBookings: 0
    });
  }
  
  return slots;
};

const initialTimeSlots = generateInitialSlots();
const initialBookings: SlotBooking[] = [];

const SlotContext = createContext<SlotContextType | undefined>(undefined);

export const SlotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(initialTimeSlots);
  const [bookings, setBookings] = useState<SlotBooking[]>(initialBookings);
  const { user, admin } = useAuth();

  const addTimeSlot = (slot: Omit<TimeSlot, 'id' | 'currentBookings'>) => {
    const newSlot = {
      ...slot,
      id: Date.now().toString(),
      currentBookings: 0
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  const updateTimeSlot = (id: string, updatedSlot: Partial<TimeSlot>) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? { ...slot, ...updatedSlot } : slot
    ));
  };

  const deleteTimeSlot = (id: string) => {
    // Check if there are any bookings for this slot
    const hasBookings = bookings.some(booking => booking.slotId === id);
    
    if (hasBookings) {
      alert('Cannot delete a slot that has bookings');
      return;
    }
    
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const getSlotById = (slotId: string) => {
    return timeSlots.find(slot => slot.id === slotId);
  };

  const bookSlot = (slotId: string): SlotBooking | null => {
    if (!user) {
      alert('Please login to book a slot');
      return null;
    }

    // Check if user already has a booking
    const existingBooking = bookings.find(booking => 
      booking.userId === user.id && booking.status === 'confirmed'
    );

    if (existingBooking) {
      alert('You already have a confirmed booking');
      return null;
    }

    const selectedSlot = timeSlots.find(slot => slot.id === slotId);
    
    if (!selectedSlot) {
      alert('Selected slot not found');
      return null;
    }

    if (selectedSlot.currentBookings >= selectedSlot.maxCapacity) {
      alert('This slot is fully booked');
      return null;
    }

    // Create new booking
    const newBooking: SlotBooking = {
      id: Date.now().toString(),
      userId: user.id,
      slotId: selectedSlot.id,
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      bookingDate: new Date().toISOString(),
      status: 'confirmed'
    };

    // Update bookings
    setBookings([...bookings, newBooking]);

    // Update slot capacity
    updateTimeSlot(slotId, {
      currentBookings: selectedSlot.currentBookings + 1
    });

    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) {
      alert('Booking not found');
      return;
    }

    if (booking.status === 'completed') {
      alert('Cannot cancel a completed booking');
      return;
    }

    // Update booking status
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, status: 'cancelled' } : b
    ));

    // Update slot capacity
    const slot = timeSlots.find(s => s.id === booking.slotId);
    if (slot && booking.status === 'confirmed') {
      updateTimeSlot(booking.slotId, {
        currentBookings: Math.max(0, slot.currentBookings - 1)
      });
    }
  };

  const getUserBooking = (): SlotBooking | null => {
    if (!user) return null;
    
    const userBooking = bookings.find(booking => 
      booking.userId === user.id && booking.status === 'confirmed'
    );
    
    return userBooking || null;
  };

  const getAvailableSlots = () => {
    return timeSlots.filter(slot => slot.currentBookings < slot.maxCapacity);
  };

  return (
    <SlotContext.Provider value={{ 
      timeSlots, 
      bookings, 
      addTimeSlot, 
      updateTimeSlot, 
      deleteTimeSlot, 
      bookSlot, 
      cancelBooking, 
      getUserBooking, 
      getSlotById,
      getAvailableSlots
    }}>
      {children}
    </SlotContext.Provider>
  );
};

export const useSlot = () => {
  const context = useContext(SlotContext);
  if (context === undefined) {
    throw new Error('useSlot must be used within a SlotProvider');
  }
  return context;
};