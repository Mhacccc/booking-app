export interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  img: string;
  country: string;
  city: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}
