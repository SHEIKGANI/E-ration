export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  address: string;
  documents: Document[];
  rationCard?: string;
  bookedSlot?: SlotBooking | null;
}

export interface Document {
  id: string;
  name: string;
  url: string;
}

export interface Stock {
  id: string;
  name: string;
  quantity: number;
  price: number;
  unit: string;
}

export interface Admin {
  id: string;
  username: string;
  password: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  currentBookings: number;
}

export interface SlotBooking {
  id: string;
  userId: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'completed';
}