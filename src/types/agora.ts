export interface callData {
    chatId: number;
    callerId: number;
    offer:RTCSessionDescriptionInit,
    targetUserId:number,
    callerUsername?:string
  }
  

export interface agoraTokenResponse {
  message:string,
  token:string,
  appId:string,
  channelName:string,
  uid:string | number,
  success:boolean
}