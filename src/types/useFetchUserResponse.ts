import { partialUser, User } from "./user";

export interface useFetchResponse {
    success:boolean,
    users:partialUser[] | []
}