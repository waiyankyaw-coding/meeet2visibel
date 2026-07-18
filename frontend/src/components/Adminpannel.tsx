import React, { useEffect, useState, type FormEvent } from "react";
import { UsersAPI } from "../api/userApi";
import type { User } from "../types/type";

const roleBadge: Record<string, string> = {
  admin: "bg-red-500/80 text-white",
  owner: "bg-blue-500/80 text-white",
  user: "bg-white/30 text-white",
};

const selectClass =
  "border border-white/40 rounded-lg px-2.5 py-1.5 text-sm text-white bg-white/10 backdrop-blur-sm " +
  "focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-transparent capitalize " +
  "[&>option]:text-gray-800";

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState<User["role"]>("user");
  const [error, setError] = useState("");

  const loadUsers = () => {
    UsersAPI.list()
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  };

  useEffect(loadUsers, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await UsersAPI.create({ name, role });
      setName("");
      setRole("user");
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create user");
    }
  };

  const handleRoleChange = async (id: string, newRole: User["role"]) => {
    try {
      await UsersAPI.updateRole(id, newRole);
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user and all their bookings?")) return;
    try {
      await UsersAPI.remove(id);
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-5 sm:p-6">
      <h2 className="text-base font-semibold text-white mb-3 drop-shadow-sm">
        Manage Users
      </h2>

      {error && (
        <p className="mb-3 text-sm text-red-100 bg-red-500/30 border border-red-300/40 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <form
        onSubmit={handleCreate}
        className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5"
      >
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="flex-1 border border-white/40 rounded-lg px-3 py-2 text-sm text-white bg-white/10 backdrop-blur-sm
            placeholder:text-white/60
            focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-transparent"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as User["role"])}
          className={selectClass}
        >
          <option value="user">User</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg
            hover:bg-gray-800 transition whitespace-nowrap"
        >
          Add User
        </button>
      </form>

      {/* Desktop / tablet: table */}
      <table className="hidden sm:table w-full text-sm">
        <thead>
          <tr className="border-b border-white/30 text-left text-white/70">
            <th className="py-2 font-medium">Name</th>
            <th className="py-2 font-medium">Role</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/20">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="py-2.5 text-white/90">{u.name}</td>
              <td className="py-2.5">
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value as User["role"])}
                  className={selectClass}
                >
                  <option value="user">User</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="py-2.5 text-right">
                <button
                  onClick={() => handleDelete(u.id)}
                  className="text-xs text-white border border-red-300/50 bg-red-800 px-3 py-1 rounded-lg hover:bg-red-500/50 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: stacked cards */}
      <div className="sm:hidden space-y-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="border border-white/30 rounded-xl p-3 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/90">{u.name}</span>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${roleBadge[u.role]}`}
              >
                {u.role}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <select
                value={u.role}
                onChange={(e) => handleRoleChange(u.id, e.target.value as User["role"])}
                className={selectClass}
              >
                <option value="user">User</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={() => handleDelete(u.id)}
                className="text-xs text-white border border-red-300/50 bg-red-500/30 px-3 py-1 rounded-lg hover:bg-red-500/50 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;