import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import { toast } from 'react-toastify'

export const Logout = () => {

  const naviaget = useNavigate()

  

  useEffect(() => {
    toast.success(`Bye Bye ${secureLocalStorage.getItem('Username')}`.toUpperCase(),{
      position: "bottom-right"
    })
    secureLocalStorage.clear()
    return naviaget('/login')
  })

    
  return (
    <div></div>
  )
}
