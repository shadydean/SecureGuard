import React, { useContext } from 'react'
import { AuthContext } from '../context/Auth'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = () => {
    const {user} = useContext(AuthContext)
    if(user === null) 
        return <Navigate to='/' />
    else
        return <Outlet />
}

export default PrivateRoute