import api from "./axios";
import type { ApiSuccessResponse } from "../types/api.types";
import type { Room } from "../types/room.types";

export const roomApi = {
  getAll: () =>
    api.get<ApiSuccessResponse<Room[]>>("/room"),
  getById: (id: string) =>
    api.get<ApiSuccessResponse<Room>>(`/room/${id}`),
};
