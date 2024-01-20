"use client"
import React from 'react'
import { useSession,signIn } from 'next-auth/react';

const page = () => {
    
  return (
    <div>
      
      <button onClick={()=>signIn("google")}>Login with google</button>
    </div>
  )
}

export default page

