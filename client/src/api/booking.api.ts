import api from "./axios";
import type { ApiSuccessResponse } from "../types/api.types";
import type { Booking, CreateBookingPayload } from "../types/booking.types";

export const bookingApi = {
  create: (payload: CreateBookingPayload) =>
    api.post<ApiSuccessResponse<Booking>>("/booking", payload),
  getMine: () =>
    api.get<ApiSuccessResponse<Booking[]>>("/booking/mine"),
  getById: (id: string) =>
    api.get<ApiSuccessResponse<Booking>>(`/booking/${id}`),
  delete: (id: string) =>
    api.delete<ApiSuccessResponse<null>>(`/booking/${id}`),
  getAll: () =>
    api.get<ApiSuccessResponse<Booking[]>>("/booking"),
  updateStatus: (id: string, status: string) =>
    api.put<ApiSuccessResponse<Booking>>(`/booking/${id}/status`, { status }),
};
