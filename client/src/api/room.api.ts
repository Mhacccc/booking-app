import api from "./axios";
import type { ApiSuccessResponse } from "../types/api.types";
import type { Room } from "../types/room.types";

export const roomApi = {
  getAll: () =>
    api.get<ApiSuccessResponse<Room[]>>("/room"),
  getById: (id: string) =>
    api.get<ApiSuccessResponse<Room>>(`/room/${id}`),
  create: (hotelId: string, payload: Partial<Room>) =>
    api.post<ApiSuccessResponse<Room>>(`/room/${hotelId}`, payload),
  update: (id: string, payload: Partial<Room>) =>
    api.put<ApiSuccessResponse<Room>>(`/room/${id}`, payload),
  delete: (id: string, hotelId: string) =>
    api.delete<ApiSuccessResponse<null>>(`/room/${id}/${hotelId}`),
};
