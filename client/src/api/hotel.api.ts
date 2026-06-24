import api from "./axios";
import type { ApiSuccessResponse } from "../types/api.types";
import type { Hotel } from "../types/hotel.types";

export const hotelApi = {
  getAll: () =>
    api.get<ApiSuccessResponse<Hotel[]>>("/hotel"),
  getById: (id: string) =>
    api.get<ApiSuccessResponse<Hotel>>(`/hotel/${id}`),
  create: (payload: Partial<Hotel>) =>
    api.post<ApiSuccessResponse<Hotel>>("/hotel", payload),
  update: (id: string, payload: Partial<Hotel>) =>
    api.put<ApiSuccessResponse<Hotel>>(`/hotel/${id}`, payload),
  delete: (id: string) =>
    api.delete<ApiSuccessResponse<null>>(`/hotel/${id}`),
};
