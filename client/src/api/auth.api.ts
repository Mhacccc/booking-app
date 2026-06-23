import api from "./axios";
import type { ApiSuccessResponse } from "../types/api.types";
import type { User, LoginPayload, RegisterPayload } from "../types/user.types";

export const authApi = {
  register: (payload: RegisterPayload) =>
    api.post<ApiSuccessResponse<User>>("/auth/register", payload),
  login: (payload: LoginPayload) =>
    api.post<ApiSuccessResponse<User>>("/auth/login", payload),
  logout: () =>
    api.post<ApiSuccessResponse<null>>("/auth/logout"),
  getCurrentUser: () =>
    api.get<ApiSuccessResponse<User>>("/auth"),
};
