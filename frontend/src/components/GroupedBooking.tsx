import React from "react";
import type { Booking } from "../types/type";

interface Props {
  bookings: Booking[];
}

const getUserName = (booking: Booking) =>
  booking.userName ||
  (typeof booking.userId === "string" ? booking.userId : booking.userId?.name) ||
  "Unknown";

const getUserId = (userId: Booking["userId"]) =>
  typeof userId === "string" ? userId : userId?.id || userId?._id || "unknown";

const GroupedBookings: React.FC<Props> = ({ bookings }) => {

  const grouped = bookings.reduce<Record<string, { name: string; bookings: Booking[] }>>(
    (acc, booking) => {
      const uid = getUserId(booking.userId);
      const uname = getUserName(booking);
      if (!acc[uid]) {
        acc[uid] = { name: uname, bookings: [] };
      }
      acc[uid].bookings.push(booking);
      return acc;
    },
    {}
  );

  const groups = Object.values(grouped);

  return (
    <div className="bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-5 sm:p-6">
      <h2 className="text-base font-semibold text-white mb-3 drop-shadow-sm">
        Bookings by User
      </h2>

      {groups.length === 0 ? (
        <p className="text-sm text-white/70">No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.name} className="border border-white/30 rounded-xl p-3">
              <h3 className="text-sm font-semibold text-white/90 mb-2">
                {group.name}{" "}
                <span className="text-xs font-normal text-white/60">
                  ({group.bookings.length} booking{group.bookings.length !== 1 ? "s" : ""})
                </span>
              </h3>
              <ul className="space-y-1">
                {group.bookings.map((b) => (
                  <li key={b.id} className="text-xs text-white/70">
                    {new Date(b.startTime).toLocaleString()} {" "}
                    {new Date(b.endTime).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupedBookings;