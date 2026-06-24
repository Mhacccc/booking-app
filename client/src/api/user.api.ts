import api from "./axios";
import type { ApiSuccessResponse } from "../types/api.types";
import type { User } from "../types/user.types";

export const userApi = {
  getAll: () =>
    api.get<ApiSuccessResponse<User[]>>("/user"),
  getById: (id: string) =>
    api.get<ApiSuccessResponse<User>>(`/user/${id}`),
  update: (id: string, payload: Partial<User>) =>
    api.put<ApiSuccessResponse<User>>(`/user/${id}`, payload),
  delete: (id: string) =>
    api.delete<ApiSuccessResponse<null>>(`/user/${id}`),
};
