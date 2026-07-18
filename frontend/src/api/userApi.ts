import api from './axios/axios';
import type { User } from '../types/type';

export const UsersAPI = {
  list: () => api.get<User[]>('/users'),
  create: (data: { name: string; role: User['role'] }) => api.post<User>('/users', data),
  updateRole: (id: string, role: User['role']) => api.patch<User>(`/users/${id}/role`, { role }),
  remove: (id: string) => api.delete(`/users/${id}`),
};