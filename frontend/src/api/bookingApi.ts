import api from "./axios/axios";
import type { Booking, UsageSummaryItem } from "../types/type";

const BookingsAPI = {
  list: () => api.get<Booking[]>("/bookings"),
  summary: () => api.get<UsageSummaryItem[]>("/bookings/summary"),
  create: (data: { userId: string; startTime: string; endTime: string }) =>
    api.post<Booking>("/bookings", data),
  remove: (id: string, userId: string, role: string) =>
    api.delete(`/bookings/${id}`, { params: { userId, role } }),
};

export default BookingsAPI;
