import api from "./axios";
import type { ApiSuccessResponse } from "../types/api.types";
import type { Hotel } from "../types/hotel.types";

export const hotelApi = {
  getAll: () =>
    api.get<ApiSuccessResponse<Hotel[]>>("/hotel"),
  getById: (id: string) =>
    api.get<ApiSuccessResponse<Hotel>>(`/hotel/${id}`),
};
