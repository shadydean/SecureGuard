import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/Auth'
import { Link,useNavigate } from 'react-router-dom'
import {Buffer} from 'buffer'
import {Modal} from '../components/SideBar'
import SideBar from '../components/SideBar'
import { VaultContext } from '../context/Vaults'
import LoadingSpinner from '../components/LoadingSpinner'
import Bank from '../components/Bank'

const Home = () => {
  const {user,dispatch} = useContext(AuthContext)
  const [isLoading,setIsLoading] = useState(false)
  const [isModelOpen,setIsModelOpen] = useState(false);
  const [vaultModelOpen,setVaultModelOpen] = useState(false)
  const [isBank,setIsBank] = useState(true)
  const [name,setName] = useState("A")
  const [role,setRole] = useState("user")
  const {vaults,dispatch : vaultDispatch} = useContext(VaultContext)
  const [search,setSearch] = useState("")
  const nav = useNavigate()

  useEffect(() => {
    setIsLoading(true)
    async function fetchData() {
      const res = await fetch("https://secureguard-production.up.railway.app/api/vault",{
        method : "GET",
        headers : {
          'x-auth-token' : user
          },
          credentials : "include"
      })

      if(res.ok){
        let data = await res.json()
        // console.log(data,data.mediaVaults[0])
        vaultDispatch({type : "SET",payload : data})
        if(data?.mediaVaults.length > 0){
          nav(`/dashboard/${data.mediaVaults[0]._id}`)
        }
        else if(data?.bankVaults.length > 0){
          nav(`/dashboard/${data.bankVaults[0]._id}`)
        }
      }
      else{
        console.log("something went wrong")
      }
    }
    setIsLoading(false)
    if(user === null)
        nav("/")
    else
        fetchData()
  },[user])

  useEffect(() => {
    if(localStorage.getItem('name')){
      setName(localStorage.getItem('name'))
      setRole(localStorage.getItem('role'))
    }
    else
      setName("A")
  },[user])

  function onLogout(){
    dispatch({type:"LOGOUT",payload:{}});
  }

  const openModal = (type) => {
    setVaultModelOpen(true);
    setIsBank(type==="bank")
  };

  const closeModal = () => {
    setVaultModelOpen(false);
  };

  return (
    <div className='flex h-screen'>
      <SideBar/>
      <section className='w-5/6 bg-slate-900 flex flex-col  text-black p-8 overflow-y-auto'>
      <div className="flex justify-between mb-4">
           <input
            className="w-[40%] h-12 rounded-md outline-none"
            placeholder={`Search in ...`}
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            type="text"
          />
            <button onClick={() => setIsModelOpen(mod => !mod)} className="rounded-full bg-white w-12 h-12 font-semibold text-3xl">
              {name.charAt(0)}
            </button>
            {isModelOpen && (
              <div className='absolute right-8 top-20 mt-2 w-48 text-center bg-white rounded-md shadow-lg p-2'>
                <ul>
                  <Link to={'/profile'}
                    className='px-4 py-2 block hover:bg-gray-200 cursor-pointer'
                    // onClick={() => handleOptionClick('Profile')}
                  >
                    Profile
                  </Link>
                  {(role === "admin") && <Link to={'/admin'}
                  
                  className='px-4 py-2 block hover:bg-gray-200 cursor-pointer'
                  // onClick={() => handleOptionClick('Profile')}
                >
                  Admin
                </Link>}
                  <button
                    className='px-4 py-2 block mx-auto hover:bg-gray-200 cursor-pointer outline-none'
                    // onClick={() => handleOptionClick('Feedback')}
                  >
                    Feedback
                  </button>
                  <button
                    className='px-4 py-2 block mx-auto bg-red-600 rounded text-white hover:bg-red-500 cursor-pointer outline-none'
                    onClick={onLogout}
                  >
                    Logout
                  </button>
                </ul>
              </div>
            )}
          
        </div>
      
      {isLoading ? <LoadingSpinner />
      : <div className='w-full h-full border-dashed border-[2px] border-opacity-30  border-white flex items-center justify-center'>
        <div className="flex flex-col items-center justify-center space-y-3">
          <h1 className='text-white text-[2.8rem]'>You have no existing vaults currently</h1>
          <h2 className='text-white text-center text-xl font-light'>Create a Vault to start using SecureGuard</h2>
          <div className=''>
            <button type='button' onClick={() => openModal("media")} className='text-slate-900 mx-2 rounded-lg bg-gray-200 hover:bg-gray-400 px-3 py-2 border-none outline-none shadow-md shadow-black'>Media Vault</button>
            <button type='button' onClick={() => openModal("bank")} className='text-slate-900 mx-2 rounded-lg bg-gray-200 hover:bg-gray-400 px-3 py-2 border-none outline-none shadow-md shadow-black'>Bank Vault</button>
          </div>
        </div>
      </div>}
      </section>
      <Modal isOpen={vaultModelOpen} onClose={closeModal}>
                 <Bank isBank = {isBank} user = {user} setIsModalOpen = {setVaultModelOpen} />
      </Modal>
    </div>
  )
}

export default Home