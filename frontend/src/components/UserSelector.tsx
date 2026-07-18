import React, { useEffect, useState } from "react";
import { UsersAPI } from "../api/userApi";
import { useUser } from "../context/userContext";
import type { User } from "../types/type";

const roleStyles: Record<string, string> = {
  admin: " bg-red-50 text-red-700 ",
  owner: " bg-blue-50 text-blue-700 ",
  user: " bg-green-50 text-green-700",
};

const roleBadge: Record<string, string> = {
  admin: "bg-black",
  owner: "bg-black",
  user: "bg-black",
};

const UserSelector: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const { login } = useUser();

  useEffect(() => {
    UsersAPI.list()
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  const handleLogin = () => {
    const user = users.find((u) => u.id === selectedId);
    if (user) login(user);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{
        backgroundImage: "url('/d1ff15adde9729d2bb47f9daa49fd44b.jpg')",
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md mb-2">
          Meet2visibel
        </h1>
        <p className="text-white/80 text-sm md:text-base max-w-md mx-auto">
          Book, manage, and track meeting room reservations for your team, all in one place.
        </p>
      </div>

      {/* Glass card */}
      <div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-1">Sign in</h2>
        <p className="text-sm text-white/70 mb-5">Select a user to continue</p>

        <div className="space-y-2 max-h-72 overflow-y-auto mb-5 pr-1">
          {users.length === 0 && (
            <p className="text-sm text-white">No users found.</p>
          )}

          {users.map((u) => {
            const isSelected = selectedId === u.id;
            const style = roleStyles[u.role] ?? roleStyles.user;
            const badge = roleBadge[u.role] ?? roleBadge.user;

            return (
              <button
                key={u.id}
                type="button"
                onClick={() => setSelectedId(u.id)}
                 className={`w-full flex items-center justify-between border rounded-lg px-4 py-2.5 text-sm font-medium transition
                  ${isSelected ? `${style} ` : "border-white/30 text-white/90 hover:bg-white/10 hover:text-green-300 transition-all duration-[1.3s]"}
                `}
              >
                <span>{u.name}</span>
                <span
                  className={`text-xs text-white px-2 py-0.5 rounded-full capitalize ${badge}`}
                >
                  {u.role}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleLogin}
          disabled={!selectedId}
          className="w-full bg-gray-900 text-white text-sm font-medium py-2.5 rounded-lg
            disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default UserSelector;