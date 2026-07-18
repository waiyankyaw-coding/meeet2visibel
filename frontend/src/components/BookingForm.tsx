import React, { useState, type FormEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BookingsAPI from "../api/bookingApi";
import { useUser } from "../context/userContext";

interface Props {
  onCreated: () => void;
}

const BookingForm: React.FC<Props> = ({ onCreated }) => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useUser();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!currentUser) {
      setError("You must be signed in to book a room");
      return;
    }

    if (!startTime || !endTime) {
      setError("Please select both start and end time");
      return;
    }
    if (startTime >= endTime) {
      setError("Start time must be before end time");
      return;
    }
    if (startTime < new Date()) {
      setError("Cannot book a time in the past");
      return;
    }

    setLoading(true);
    try {
      await BookingsAPI.create({
        userId: currentUser.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });
      setStartTime(null);
      setEndTime(null);
      onCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const pickerInputClass =
    "w-full border border-white/40 rounded-lg px-3 py-2 text-sm text-white bg-white/10 backdrop-blur-sm " +
    "placeholder:text-white/60 " +
    "focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-transparent";

  return (
    <div className="bg-white/30 z-50 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-5 sm:p-6">
      <h2 className="text-base font-semibold text-white mb-4 drop-shadow-sm">
        New Booking
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-white/80 mb-1.5">
              Start
            </label>
            <DatePicker
              selected={startTime}
              onChange={(date: Date | null) => setStartTime(date)}
              showTimeSelect
              timeIntervals={30}
              dateFormat="MMM d, yyyy h:mm aa"
              placeholderText="Select start time"
              className={pickerInputClass}
              wrapperClassName="w-full"
               popperClassName="!z-50"
              popperPlacement="bottom-start"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-white/80 mb-1.5">
              End
            </label>
            <DatePicker
              selected={endTime}
              onChange={(date: Date | null) => setEndTime(date)}
              showTimeSelect
              timeIntervals={30}
              dateFormat="MMM d, yyyy h:mm aa"
              placeholderText="Select end time"
              minDate={startTime ?? undefined}
              className={pickerInputClass}
              wrapperClassName="w-full"
              popperClassName="!z-50"
              popperPlacement="bottom-start"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg
              hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition
              whitespace-nowrap"
          >
            {loading ? "Booking..." : "Book Room"}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-3 text-sm text-red-100 bg-red-500/30 border border-red-300/40 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
};

export default BookingForm;