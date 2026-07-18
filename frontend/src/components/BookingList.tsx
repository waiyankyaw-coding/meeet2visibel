import React, { useState } from "react";
import BookingsAPI from "../api/bookingApi";
import { useUser } from "../context/userContext";
import type { Booking } from "../types/type";

interface Props {
  bookings: Booking[];
  onChanged: () => void;
}

const getUserId = (userId: Booking["userId"]) =>
  typeof userId === "string" ? userId : userId?.id || userId?._id;

const getUserName = (booking: Booking) =>
  booking.userName ||
  (typeof booking.userId === "string" ? booking.userId : booking.userId?.name) ||
  "Unknown";

const BookingList: React.FC<Props> = ({ bookings, onChanged }) => {
  const { currentUser } = useUser();
  const [error, setError] = useState("");

  if (!currentUser) return null;

  const canDelete = (booking: Booking) => {
    if (currentUser.role === "admin" || currentUser.role === "owner") return true;
    return getUserId(booking.userId) === currentUser.id;
  };

  const handleDelete = async (id: string) => {
    setError("");
    try {
      await BookingsAPI.remove(id, currentUser.id, currentUser.role);
      onChanged();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete booking");
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-5 sm:p-6">
      <h2 className="text-base font-semibold text-white mb-3 drop-shadow-sm">
        Bookings
      </h2>

      {error && (
        <p className="mb-3 text-sm text-red-100 bg-red-500/30 border border-red-300/40 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {bookings.length === 0 ? (
        <p className="text-sm text-white/70">No bookings yet.</p>
      ) : (
        <>
          {/* Desktop / tablet: table */}
          <table className="hidden sm:table w-full text-sm">
            <thead>
              <tr className="border-b border-white/30 text-left text-white/70">
                <th className="py-2 font-medium">User</th>
                <th className="py-2 font-medium">Start</th>
                <th className="py-2 font-medium">End</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="py-2.5 text-white/90">{getUserName(b)}</td>
                  <td className="py-2.5 text-white/80">
                    {new Date(b.startTime).toLocaleString()}
                  </td>
                  <td className="py-2.5 text-white/80">
                    {new Date(b.endTime).toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right">
                    {canDelete(b) && (
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="text-xs text-white border border-red-300/50 bg-red-800 px-3 py-1 rounded-lg hover:bg-red-500/50 transition"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile: stacked cards */}
          <div className="sm:hidden space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="border border-white/30 rounded-xl p-3 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/90">
                    {getUserName(b)}
                  </span>
                  {canDelete(b) && (
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="text-xs text-white border border-red-300/50 bg-red-500/30 px-2.5 py-1 rounded-lg hover:bg-red-500/50 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <span className="text-xs text-white/70">
                  {new Date(b.startTime).toLocaleString()} →{" "}
                  {new Date(b.endTime).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BookingList;