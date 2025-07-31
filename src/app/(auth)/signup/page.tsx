
"use client"
import React, { useState } from 'react'
import { partialUser } from '../../../../types/user'

function Signup() {
    const [formData,setFormData] = useState<partialUser>({
        username:"",
        phoneNumber:0,
        email:"",
        password:"",
        avatar:"",
        bio:""
    })
  return (
    <div>page</div>
  )
}

export default Signup