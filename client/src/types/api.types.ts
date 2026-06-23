export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  count?: number;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  status: number;
  stack?: string;
}
