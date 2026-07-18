export interface User {
  id: string
  name: string
  role: 'admin' | 'owner' | 'user'
}

export interface Booking {
  id: string;
  userId: string | { _id: string; id: string; name: string; role: string };
  userName?: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}
export interface UsageSummaryItem {
  userId: string;
  userName?: string;
  totalBookings: number;
}