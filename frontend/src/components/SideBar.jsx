import React, { useContext, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FcFolder } from "react-icons/fc";
import { RxDotsHorizontal } from "react-icons/rx";
import ReactDOM from 'react-dom'
import { HiMiniXMark } from "react-icons/hi2";
import sgLogo from '../assets/sgLogo.jpg'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { VaultContext } from '../context/Vaults';
import { AuthContext } from '../context/Auth';
import Bank from './Bank';

export const Modal = ({ isOpen, onClose, children }) => {
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



const VaultModel = ({vault,isVaultModifying,setIsVaultModifying,setVaultName,deleteVault,vaultType}) => {
  return (
    <div className='absolute -right-[95%] top-4 mt-2 z-10 w-48 text-center text-black bg-white rounded-md shadow-lg p-2'>
            <ul>
              <button
                className='px-4 py-2 block w-full hover:bg-gray-200 cursor-pointer'
                onClick={() => {setIsVaultModifying(true); setVaultName(vault.name)}}
              >
                Rename
              </button>
              <button
                className='px-4 py-2 block w-full bg-red-500 rounded-xl text-white hover:bg-red-600 cursor-pointer'
                disabled={isVaultModifying}
                onClick={() => deleteVault(vaultType)}
              >
                Delete
              </button>
            </ul>
          </div>
  )
}

const VaultComponent = ({id,vault,isVaultModifying,renameVault,deleteVault,setIsVaultModifying,activeVaultId,setActiveVaultId,setVaultName,vaultName,vaultType}) => {
  return (
    <div className={` ${(id === vault._id) ? "bg-gray-700" : ""} relative flex items-center hover:bg-gray-700 group`}>
                      <FcFolder className='mr-2 text-2xl' />
                      {(isVaultModifying && (activeVaultId === vault._id)) ? 
                      <input type="text" className="w-[70%] border-[1px] py-2 outline-none bg-transparent text-white" value={vaultName} onChange={(e) => setVaultName(e.target.value)}
                        onKeyDown={(e) => {
                          if(e.key === 'Enter') {
                           return renameVault(activeVaultId,vaultName,vaultType,setActiveVaultId)
                          }

                          return;
                        }}
                        required
                    />
                      : 
                      <Link to={`/dashboard/${vault._id}`} className='block my-2'>{vault.name}</Link>}
                      {(activeVaultId === vault._id) 
                      ?<HiMiniXMark className='ml-auto mr-1 group-hover:block rounded-full bg-blue-600 text-2xl cursor-pointer' onClick={() => {setActiveVaultId(null); setVaultName("");setIsVaultModifying(false)}} /> 
                      : <RxDotsHorizontal onClick={() => setActiveVaultId(vault._id)} className={`${(activeVaultId === vault._id) ? "block" : "hidden"} ml-auto mr-1 group-hover:block hover:bg-blue-600 text-2xl cursor-pointer`} />}
                      {activeVaultId === vault._id && (
                    <VaultModel
                      vault={vault}
                      setVaultName={setVaultName}
                      isVaultModifying={isVaultModifying}
                      setIsVaultModifying={setIsVaultModifying}
                      vaultType={vaultType}
                      deleteVault={deleteVault}
                    />
                  )}
                      </div>
  )
}

const SideBar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); //for vault creation
    const [isVaultModifying,setIsVaultModifying] = useState(false);
    const [vaultName,setVaultName] = useState("")
    const [activeVaultId,setActiveVaultId] = useState(null)
    const [isBank,setIsBank] = useState(true);
    const {vaults,dispatch} = useContext(VaultContext)
    const {user} = useContext(AuthContext)
    const nav = useNavigate()
    const { id } = useParams();

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

      async function renameVault(activeVaultId,vaultName,vaultType){
        try {
          setIsVaultModifying(true)
          const response = await fetch(`http://localhost:4321/api/vault/${activeVaultId}`,{
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token" : user
            },
            body : JSON.stringify({name : vaultName, vaultType : vaultType})
    
          })
    
          if(response.ok){
            const data = await response.json()
            dispatch({type : 'UPDATE', payload : {_id : data._id, name : data.name,isBank : (vaultType === "bank")}})
            console.log(data)
          }
          setIsVaultModifying(false)
          setActiveVaultId(null)
        }catch(err){
          console.log(err)
        }
      }

      async function deleteVault(vaultType){
        try {
          setIsVaultModifying(true)
          const response = await fetch(`http://localhost:4321/api/vault/${activeVaultId}`,{
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token" : user
            },
            body : JSON.stringify({
              vaultType : vaultType
            })
    
          })
    
          if(response.ok){
            const data = await response.json()
            toast.success("Vault deleted successfully.",{
              autoClose : 3000,
            theme : 'dark',
            })
            dispatch({type : 'DELETE',payload : {_id : activeVaultId,isBank : (vaultType === "bank")}})
            if(activeVaultId === id)
              nav("/home")
            console.log(data)
          }
          setIsVaultModifying(false)
          setActiveVaultId(null)
        }catch(err){
          console.log(err)
        }
      }
      // <ToastContainer />
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
            <section className='mt-3'>
                <ul className='font-normal text-[1rem] pl-6'>

                {vaults && (vaults.mediaVaults.map(vault => 
                    <VaultComponent key={vault._id} vaultType="media" deleteVault={deleteVault} activeVaultId={activeVaultId} setActiveVaultId={setActiveVaultId} renameVault={renameVault} isVaultModifying={isVaultModifying} vaultName={vaultName} setIsVaultModifying={setIsVaultModifying} vault={vault} id={id} setVaultName={setVaultName} />
                  ))
                
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
            <section className='mt-3'>
                <ul className='font-normal text-[1rem] pl-6'>

                {vaults && (vaults.bankVaults.map(vault => 
                    <VaultComponent key={vault._id} vaultType="bank" deleteVault={deleteVault} activeVaultId={activeVaultId} setActiveVaultId={setActiveVaultId} renameVault={renameVault} isVaultModifying={isVaultModifying} vaultName={vaultName} setIsVaultModifying={setIsVaultModifying} vault={vault} id={id} setVaultName={setVaultName} />
                  ))
                
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