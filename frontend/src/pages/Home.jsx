import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/Auth'
import { useNavigate } from 'react-router-dom'
import {Buffer} from 'buffer'
import SideBar from '../components/SideBar'

const Home = () => {
  const {user,dispatch} = useContext(AuthContext)
  const [vaults,setVaults] = useState()
  const nav = useNavigate()

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("http://localhost:4321/api/vault",{
        method : "GET",
        headers : {
          'x-auth-token' : user
          },
          credentials : "include"
      })

      if(res.ok){
        let data = await res.json()
        console.log(data,data.mediaVaults[0])
        setVaults(data)
        if(vaults.mediaVaults.length > 0){
          let id = vaults.mediaVaults[0]._id
          console.log(id)
          nav(`/dashboard/${id}`)

        }
      }
      else{
        console.log("something went wrong")
      }
    }

    if(user === null)
        nav("/")
    else
        fetchData()
  },[user])

  return (
    <div className='flex h-screen'>
      <SideBar vaults={vaults} />
      <section className='w-5/6 bg-[#636365] text-black'>
        {vaults && vaults.mediaVaults.type}
      </section>
    </div>
  )
}

export default Home