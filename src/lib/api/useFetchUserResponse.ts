import { partialUser, User } from "../../types/user";

export interface useFetchResponse {
    success:boolean,
    users:partialUser[] | []
}