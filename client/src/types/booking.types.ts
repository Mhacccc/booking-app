export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  _id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  roomNumbers: number[];
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  hotelId: string;
  roomId: string;
  roomNumbers: number[];
  startDate: string;
  endDate: string;
  totalPrice: number;
}
