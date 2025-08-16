import { partialUser } from '@/types/user'
import React from 'react'

interface NewGroupAddedUserCardProps {
    addedUsers : partialUser[],
}

function NewGroupAddedUserCard({addedUsers}:NewGroupAddedUserCardProps) {
  return (
    <div
    className={`
      transform transition-all duration-500 ease-in-out
      opacity-0 translate-y-[-10px] mt-3 overflow-x-auto
      ${addedUsers.length !== 0 ? "opacity-100 translate-y-0" : ""}
    `}
  >
    { addedUsers.map((user) => (
      <div
        className={`px-3 py-5 bg-white mx-2 rounded-[5px] transform transition-all duration-500 ease-in-out
      opacity-0 translate-y-[-10px] ${user?.avatar ? `opacity-100 translate-y-0` : `` }` }
        key={user?.id}
      >
        <img className="size-10 rounded-[50%] " src = {user?.avatar} />
        <span className="font-light text-[13px]">{user?.username}</span>
      </div>
    ))}
  </div>
  )
}

export default NewGroupAddedUserCard