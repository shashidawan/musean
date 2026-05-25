export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  volume: string;
  price: number;
  rating: number;
  imageAlt: string;
  shelf: number; // 1 to 4 (top to bottom on the Krone trolley)
}

export interface Stylist {
  id: string;
  name: string;
  role: string;
  experience: string;
  rating: number;
  image: string;
  specialty: string;
  availableDays: string[]; // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  timeSlots: string[]; // e.g. ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"]
}

export interface ServicePackage {
  id: string;
  title: string;
  duration: string;
  price: number;
  description: string;
  includes: string[];
  isRecommended?: boolean;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  stylist: Stylist;
  service: ServicePackage;
  date: string;
  timeSlot: string;
  addons: Product[];
  totalPrice: number;
  status: 'confirmed' | 'pending';
  timestamp: string;
}
