export interface User {
  id: number;
  username: string;
  email: string;
  phoneNumber: number;
  avatar: string;
  bio: string;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
  password: string;
}

export type partialUser = Partial<User>;

export type session = {
  user: partialUser;
};

export interface token {
  id?: number | undefined;
  username?: string | undefined;
  email?: string | undefined;
  phoneNumber?: number | undefined;
  avatar?: string | undefined;
  bio?: string | undefined;
  isOnline?: boolean | undefined;
  lastSeen?: Date | undefined;
  createdAt?: Date | undefined;
  password?: string | undefined;
}
