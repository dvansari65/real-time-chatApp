import { useAgora } from '@/hooks/useAgora'
import React, { useEffect } from 'react'

interface videoProps {
    appId:string,
    token:string,
    uid:number | string,
    channel:string
}

function Video({appId,token,uid,channel}:videoProps) {
    const {localTracks,remoteUsers,leave,join} = useAgora()
    useEffect(()=>{
        if(localTracks[1]){
            localTracks[1].play()
        }
    },[localTracks])
    useEffect(()=>{
        remoteUsers.forEach(user=>{
            if(user.videoTrack){
                user.videoTrack.play(`remote-${user.uid}`);
            }
        })
    },[remoteUsers])
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-green-500 rounded"
          onClick={() => join(appId, channel, token, uid)}
        >
          Join Call
        </button>
        <button className="px-4 py-2 bg-red-500 rounded" onClick={leave}>
          Leave Call
        </button>
      </div>

      {/* Local Video */}
      <div id="local-player" className="w-64 h-48 bg-black"></div>

      {/* Remote Users */}
      {remoteUsers.map((user) => (
        <div
          key={user.uid}
          id={`remote-${user.uid}`}
          className="w-64 h-48 bg-gray-900"
        />
      ))}
    </div>
  )
}

export default Video