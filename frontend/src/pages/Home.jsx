import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/Auth'
import { useNavigate } from 'react-router-dom'
import {Buffer} from 'buffer'

const Home = () => {
  const {user} = useContext(AuthContext)
  const [data,setData] = useState(null)
  const nav = useNavigate()

    useEffect( () => {
      async function fetchData() {
        const response = await fetch('http://localhost:4321/api/media',{
          method : "GET",
          headers:{
            'x-auth-token' : user
          },
          credentials : "include"
        })

        const data = await response.json()
        const imageBuffer = Buffer.from(data.data.data); // Assuming mediaInfo.media.image is a buffer
        const base64Image = imageBuffer.toString('base64');
        setData(base64Image)
        console.log(data.data.data)
        // console.log(base64String)
      }

      if(user !== null)
          fetchData()
      else {
        nav("/")
      }
  },[user])

  return (
    <div>
      {data && <img src={`data:image/jpg;base64,${data}`} alt=""/>}
      {/* {data ? (
        <video controls>
          <source src={`data:video/mp4;base64,${data}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>Loading video...</p>
      )} */}
    </div>
  )
}

export default Home