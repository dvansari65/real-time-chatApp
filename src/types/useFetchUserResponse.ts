import { partialUser } from "./user";

export interface useFetchResponse {
    success:boolean,
    users:partialUser[] | []
}