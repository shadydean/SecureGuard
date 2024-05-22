import React, { useContext, useEffect } from 'react'
import Login from '../components/Login'
import { AuthContext } from '../context/Auth'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
    const {user} = useContext(AuthContext)
    const nav = useNavigate()
    useEffect(() => {
        if(user !== null){
            nav("/home")
        }
    },[user])

  return (
    <>
        <Login />
    </>
  )
}

export default LandingPage