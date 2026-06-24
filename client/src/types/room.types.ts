export interface RoomNumber {
  _id?: string;
  number: number;
  unavailableDates: string[];
}

export interface Room {
  _id: string;
  title: string;
  price: number;
  maxPeople: number;
  desc: string;
  roomNumbers: RoomNumber[];
  createdAt: string;
  updatedAt: string;
}
