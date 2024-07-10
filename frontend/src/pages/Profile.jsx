import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/Auth'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const [userData,setUserData] = useState(null)
  const [isLoading,setIsLoading] = useState(false)
  const {user,dispatch} = useContext(AuthContext)
  const nav = useNavigate()

  useEffect(() => {

    setIsLoading(true)
    async function fetchUser() {
      try {

        const response = await fetch("http://localhost:4321/api/credentials",{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'x-auth-token' : user
          }
        })
        
        if(response.ok){
          const data = await response.json()
          setUserData(data[0])
        }
      }catch(err){
        console.log(err)
      }
      setIsLoading(false)
    }

    if(!user) nav("/")
    else fetchUser()
  },[user])

  const handleEditProfile = () => {
    // Add logic to navigate to the edit profile page or open a modal
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("http://localhost:4321/api/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'x-auth-token': user
        }
      });

      if (response.ok) {
        // Handle account deletion (e.g., navigate to a goodbye page or logout)
        dispatch({type : 'LOGOUT'})
        nav("/");
        
      } else {
        console.log("Failed to delete account");
      }
    } catch (err) {
      console.log(err);
    }
  };

console.log(userData)
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      {isLoading ? (
        <h1 className="text-2xl text-white">Loading...</h1>
      ) : (
        userData && (
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-white max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-500 text-white rounded-full h-24 w-24 flex items-center justify-center text-4xl font-bold">
                {userData?.name?.charAt(0)}
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-center">{userData?.name}</h1>
            <h2 className="text-xl mb-2">Email: {userData?.email}</h2>
            <h2 className="text-xl mb-2">Mobile Number: {userData?.mobilenumber}</h2>
            <h2 className="text-xl mb-4">Role: {userData?.role}</h2>
            <div className="flex justify-between">
              <button 
                onClick={handleEditProfile} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Edit Profile
              </button>
              <button 
                onClick={handleDeleteAccount} 
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Delete Account
              </button>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default Profile