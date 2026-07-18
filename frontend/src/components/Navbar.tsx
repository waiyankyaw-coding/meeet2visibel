import React, { useState } from "react";
import { useUser } from "../context/userContext";

const roleBadge: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  owner: "bg-blue-100 text-blue-700",
  user: "bg-gray-100 text-gray-700",
};

const Navbar: React.FC = () => {
  const { currentUser, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!currentUser) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <h1 className="text-base sm:text-lg font-semibold text-gray-800">
          Meeting2visibel
        </h1>


        <div className="hidden sm:flex items-center gap-3">
          <span className="text-sm text-gray-700">{currentUser.name}</span>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${roleBadge[currentUser.role]}`}
          >
            {currentUser.role}
          </span>
          <button
            onClick={logout}
            className="text-sm text-gray-500 border border-gray-300 px-3 py-1.5 rounded-lg bg-transparent hover:bg-gray-50 transition"
          >
            Switch user
          </button>
        </div>


        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="sm:hidden p-2 -mr-2 text-gray-600"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>


      {menuOpen && (
        <div className="sm:hidden px-4 pb-4 flex flex-col gap-3 border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{currentUser.name}</span>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${roleBadge[currentUser.role]}`}
            >
              {currentUser.role}
            </span>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-500 border border-gray-300 px-3 py-1.5 rounded-lg bg-transparent hover:bg-gray-50 transition w-full"
          >
            Switch user
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default Navbar;