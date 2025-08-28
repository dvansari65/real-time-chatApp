import { messageDataFromGetAllChatsResponse } from "@/types/message"

interface initialStateData {
    messages:messageDataFromGetAllChatsResponse[]
}
const initialState = {
    messages:[],

}