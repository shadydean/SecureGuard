import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/Auth'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const {user} = useContext(AuthContext)
  const nav = useNavigate()
    useEffect(() => {
        if(user === null){
            nav("/")
        }
    },[user])

  return (
    <div>Home</div>
  )
}

export default Home