import React, { useEffect, useState } from "react";
import BookingsAPI from "../api/bookingApi";
import { useUser } from "../context/userContext";
import Navbar from "../components/Navbar";
import BookingForm from "../components/BookingForm";
import BookingList from "../components/BookingList";
import AdminPanel from "../components/Adminpannel";
import type { Booking, UsageSummaryItem } from "../types/type";
import GroupedBookings from "../components/GroupedBooking";

const Dashboard: React.FC = () => {
  const { currentUser } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [summary, setSummary] = useState<UsageSummaryItem[] | null>(null);

  const loadBookings = () => {
    BookingsAPI.list()
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]));
  };

  const loadSummary = () => {
    if (currentUser?.role === "owner" || currentUser?.role === "admin") {
      BookingsAPI.summary()
        .then((res) => setSummary(res.data))
        .catch(() => setSummary(null));
    }
  };

  useEffect(() => {
    loadBookings();
    loadSummary();
  }, []);

  const refresh = () => {
    loadBookings();
    loadSummary();
  };

  if (!currentUser) return null;

  return (
    <>
      <Navbar />
      <div
        className="relative min-h-screen pt-20 pb-10 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: "url('/d1ff15adde9729d2bb47f9daa49fd44b.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-4 items-start mt-12.5">
          {/* Left column */}
          <BookingList bookings={bookings} onChanged={refresh} />

          {/* Right column */}
          {(currentUser.role === "owner" || currentUser.role === "admin") && summary && (
            <div className="bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-5 sm:p-6">
              <h2 className="text-base font-semibold text-white mb-3 drop-shadow-sm">
                Meeting Logs / summary
              </h2>
              <ul className="divide-y divide-white/30">
                {summary.map((s) => (
                  <li
                    key={s.userId}
                    className="flex items-center justify-between py-2 text-sm"
                  >
                    <span className="text-white/90">{s.userName || s.userId}</span>
                    <span className="text-white/70">{s.totalBookings} bookings</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(currentUser.role === "owner" || currentUser.role === "admin") && (
            <GroupedBookings bookings={bookings} />
          )}

          <BookingForm onCreated={refresh} />

          {currentUser.role === "admin" && <AdminPanel />}
        </div>
      </div>
    </>
  );
};

export default Dashboard;