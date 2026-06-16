import { api } from './client';
import type {
  UserSummary, UserDetail, UpdateUserRequest, Address, AddressRequest,
} from '../types';

export const listUsers = () =>
  api.get<UserSummary[]>('/users').then(r => r.data);

export const getUser = (id: number) =>
  api.get<UserDetail>(`/users/${id}`).then(r => r.data);

export const updateUser = (id: number, body: UpdateUserRequest) =>
  api.put<UserDetail>(`/users/${id}`, body).then(r => r.data);

export const addAddress = (userId: number, body: AddressRequest) =>
  api.post<Address>(`/users/${userId}/addresses`, body).then(r => r.data);

export const updateAddress = (userId: number, addressId: number, body: AddressRequest) =>
  api.put<Address>(`/users/${userId}/addresses/${addressId}`, body).then(r => r.data);

export const deleteAddress = (userId: number, addressId: number) =>
  api.delete<void>(`/users/${userId}/addresses/${addressId}`).then(() => undefined);