import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import sgLogo from '../assets/sgLogo.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { VaultContext } from '../context/Vaults';
import { AuthContext } from '../context/Auth';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return ReactDOM.createPortal(
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex flex-col items-center justify-center">
        
           {children}
            <button onClick={onClose} className="text-[2.5rem] p-0 my-2 aspect-square flex items-center justify-center bg-red-500 rounded-full border-none outline-none text-white">&times;</button>
        </div>
      ,
      document.body
    );
  };

const Bank = ({isBank,user,setIsModalOpen}) => {

    const [name,setName] = useState("")
    const [isLoading,setIsLoading] = useState(false)
    const {vaults,dispatch} = useContext(VaultContext)
    const nav = useNavigate()
    

    async function createVault(){
        setIsLoading(true)
        const response = await fetch('http://localhost:4321/api/vault', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token' : user
                },
                body: JSON.stringify({
                    name: name,
                    vaultType: (isBank ? "bank" : "media")
                })
        })
        if(response.status === 201){
            const data = await response.json()
            dispatch({type : "ADD",payload : {data : data, isBank : isBank}})
            setIsModalOpen(false)
            return nav(`/dashboard/${data._id}`)
        }
        setIsLoading(false)
    }

    return (
        <>
        <h2 className="text-2xl font-bold mb-4">Create Vault</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Vault Name</label>
            <input type="email" id="email" value={name} onChange={(e) => setName(e.target.value)} name="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
          </div>

          <button type="button" onClick={createVault} disabled={isLoading} className="w-full bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">{isLoading ? "Creating" : "Create"}</button>
        </form>
        </>
    )
}

const SideBar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBank,setIsBank] = useState(true);
    const {vaults,dispatch} = useContext(VaultContext)
    const {user} = useContext(AuthContext)

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
          // console.log(data,data.mediaVaults[0])
          dispatch({type : "SET",payload : data})
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
  

    const openModal = (type) => {
        setIsModalOpen(true);
        setIsBank(type==="bank")
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
      };

  return (
    <div className='w-1/6 flex bg-[#1e232a] flex-col pl-4 space-y-10'>
        
        <div className="flex items-center gap-x-2 py-1">
            <img src={sgLogo} alt="logo" className='w-[2rem] h-[2rem] rounded-full ' />
            <button onClick={() => scrollToSection(ref)} className='text-[1.8rem]  outline-none border-none'>SecureGuard</button>
        </div>
        
        {/* media vaults */}
        <section className=' max-w-[14rem]'>
            <section className='flex justify-between items-center'>
                <h1 className='font-thin text-[1.2rem] text-slate-400'>Media Vaults</h1>
                <button onClick={() => openModal("media")} className='bg-purple-500 text-slate-800 aspect-square h-6 flex items-center justify-center rounded-full text-[1.4rem]'>+</button>
                
            </section>
            <section>
                <ul className='font-normal text-[1rem] pl-6'>

                {vaults && (vaults.mediaVaults.map(vault => {
                    return <Link to={`/dashboard/${vault._id}`} key={vault._id} className='block'>{vault.name}</Link>
                }))
                
                 }
            </ul>
            </section>
        </section>

        {/* bank vaults */}
        <section className=' max-w-[14rem]'>
        <section className='flex justify-between items-center'>
                <h1 className='font-thin text-[1.1rem] text-slate-400'>Bank Vaults</h1>
                <button onClick={() => openModal("bank")} className='bg-purple-500 text-slate-800 aspect-square h-6 flex items-center justify-center rounded-full text-[1.4rem]'>+</button>
                 
            </section>
            <section>
                <ul className='font-normal text-[1rem] pl-6'>

                {vaults && (vaults.bankVaults.map(vault => {
                    return <Link to={`/dashboard/${vault._id}`} key={vault._id} className='block'>{vault.name}</Link>
                }))
                
                 }
            </ul>
            </section>
        </section>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
                 <Bank isBank = {isBank} user = {user} setIsModalOpen = {setIsModalOpen} />
      </Modal>
    </div>
  )
}

export default SideBar