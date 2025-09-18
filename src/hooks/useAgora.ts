import { useEffect, useState } from "react"
import AgoraRTC, {IAgoraRTCClient, ILocalTrack} from "agora-rtc-react"


export const useAgora = ()=>{
    const [client] = useState<IAgoraRTCClient>(
        ()=>AgoraRTC.createClient({mode:"rtc",codec:"vp8"})
    )
    const [localTracks,setLocalTracks] = useState<ILocalTrack[]>([])
    const [remoteUsers,setRemoteUsers] = useState<any[]>([])
    useEffect(()=>{
        client.on("user-published",async(user,mediaType)=>{
            await client.subscribe(user,mediaType)
            if(mediaType === "video") setRemoteUsers(prev=>[...prev,user]) 
            if(mediaType === "audio") user.audioTrack?.play()
        })
    client.on("user-unpublished",(user)=>{
        setRemoteUsers(prev=>prev.filter(u=>u.uid !== user.uid))
    })
    },[client])

    const join = async (appId:string,token:string,channel:string,uid:number | string)=>{
         if(!appId || !token || !channel || !uid){
            throw new Error("Please provide AppID , Token , Channel , UID ")
        }
        client.join(appId,channel,token,uid)
        const micTrack = await AgoraRTC.createMicrophoneAudioTrack()
        const camTrack = await AgoraRTC.createCameraVideoTrack()
        setLocalTracks([micTrack,camTrack])
        await client.publish([micTrack,camTrack])
    }

    const leave = async()=>{
        localTracks.forEach(track=>{
            track.stop();
            track.close()
        })
        await client.leave()
        setLocalTracks([])
    }
    return  {remoteUsers,localTracks,join,leave}
}