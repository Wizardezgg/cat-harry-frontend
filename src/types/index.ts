export interface IUser {
  _id: string;
  name: string;
  email: string;
  photoUrl?: string;
  role: 'creator' | 'host' | 'admin';
}

export interface IStudioLocation {
  address: string;
  city: string;
  state: string;
  zip: string;
}

export type StudioCategory = 
  | 'Photo Studio'
  | 'Film Stage'
  | 'Podcast Lounge'
  | 'Music Suite'
  | 'Art Workshop';

export interface IStudio {
  _id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: IStudioLocation;
  imageUrl: string;
  gallery: string[];
  amenities: string[];
  overview: string;
  ownerName: string;
  ownerEmail: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface IBooking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioHourlyRate: number;
  userEmail: string;
  userName: string;
  userPhone?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  totalAmount: number;
  status: BookingStatus;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}
