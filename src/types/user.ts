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
  password?: string;
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
  avatar?: File | null;
  bio?: string | undefined;
  isOnline?: boolean | undefined;
  lastSeen?: Date | undefined;
  createdAt?: Date | undefined;
  password?: string | undefined;
}

export interface RegisterProps {
  username:string,
  phoneNumber:string,
  email:string,
  password:string,
  bio:string
}
export interface loginProps {
  email:string,
  password:string
}

export interface meResponseProps{
  success:boolean,
  user:partialUser | null
}

export interface allUsersResponse {
  success:boolean,
  user:User[]
}

export interface singleUserDataResponse {
  success:boolean,
  user:partialUser | null,
  message:string
}