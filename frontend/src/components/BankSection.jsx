// MediaContent.jsx
import React, { Suspense, useContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from './LoadingSpinner';
import Modal from '../components/Modal';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/Auth';

{/* <Modal isOpen={bankModelOpen} setBankModelOpen={setBankModelOpen}>
          
      </Modal> */}

const BankModel = ({deleteBank,isLoading,isModelOpen,setIsModelOpen}) => {
  return (
    <div className='absolute bg-opacity-100 bg-gray-800 text-white -right-[62%] top-2 mt-2 z-10 w-48 text-cente rounded-md shadow-lg shadow-black p-2'>
            <ul>
              <button
                className='px-4 py-2  block w-full hover:bg-gray-700 cursor-pointer'
                onClick={() => setIsModelOpen(true)}
              >
                Edit
              </button>
              <button
                className='px-4 py-2  block w-full bg-red-500 rounded-xl text-white hover:bg-red-600 cursor-pointer'
                disabled={isLoading}
                onClick={deleteBank}
              >
                Delete
              </button>
            </ul>
        </div>
  )
}

const BankContent = ({content,setContent,selectedBank,setSelectedBank,bank}) => {
  const [isModelOpen,setIsModelOpen] = useState(false)
  const [isLoading,setIsLoading] = useState(false)
  const {user} = useContext(AuthContext)
  const {id} = useParams()


  async function deleteBank(){
    try {
      setIsLoading(true)
      const response = await fetch(`http://secureguard-production.up.railway.app/api/bank/${selectedBank}`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token" : user
        },
      })

      if(response.ok){
        let newContent = content.filter(m => m._id !== selectedBank)
        toast.success("Bank info deleted successfully.",{
          autoClose : 3000,
          theme : 'dark',
          
        })
        setContent(newContent)
        const cache = await caches.open("bank-cache");
      
      cache.match(`http://secureguard-production.up.railway.app/api/bank/${id}`).then((cachedResponse) => {
        if (cachedResponse) {
          cachedResponse.json().then((cachedData) => {
            cache.put(
              `http://secureguard-production.up.railway.app/api/bank/${id}`,
              new Response(JSON.stringify(newContent))
            );
          });
        }
      });
        // console.log(data)
      }
      setIsLoading(false)
      setSelectedBank(null)
    }catch(err){
      console.log(err)
    }
  }

  
    return (
        <div className='bg-gray-800 relative w-[25%] h-[35%] flex flex-col justify-evenly px-2 mr-6 mb-2 rounded-lg shadow-black shadow-md'>
      <div className='flex flex-col h-full pl-8 space-y-2 mt-8'>
        <button onClick={() => {setSelectedBank(prev => {
          if(prev === bank._id)
              return null;
          else
              return bank._id;
        })}} className='bg-red-400 w-7 h-7 z-10 rounded-full absolute -right-3 -top-3'></button>
        <h2 className='text-white text-xl truncate w-[75%]'>Username : {bank.userName}</h2>
        <p className='text-gray-400'>Password : {bank.password}</p>
        <p className='text-gray-400'>Account Name : {bank.accountName}</p>
        <p className='text-gray-400'>Account Number : {bank.accountNumber}</p>
        <p className='text-gray-400'>IFSC : {bank.IFSC}</p>
      </div>
      {(selectedBank === bank._id) && <BankModel deleteBank={deleteBank} isModelOpen={isModelOpen} setIsModelOpen={setIsModelOpen} isLoading={isLoading} />}
      {isModelOpen && <Modal isOpen={isModelOpen} content={content} setBankContent={setContent} setBankModelOpen={setIsModelOpen} data={bank} method="edit" />}
    </div>
    )
}

const NoBank = ({setBankModelOpen}) => {
  return (
    <div className='w-full h-full border-2 border-dashed flex items-center justify-center border-white'>
      <div className="flex flex-col items-center justify-center text-white space-y-4">
        <h1 className='text-[2.8rem]'>Your vault is empty.</h1>
        <h3 className='text-2xl font-light text-slate-400'>Try adding bank info...</h3>
        <button type="button"
            onClick={() => setBankModelOpen(true)} className='px-3 py-2 bg-gray-200 hover:bg-gray-400 text-slate-900 rounded-lg'>New info</button>
      </div>
    </div>
  )
}

const BankWrapper = ({content,selectedBank,setSelectedBank,setBankModelOpen,setContent}) => {
  return (
    <>
    { content.length > 0 ? (
      content.map((bank) => (
        <BankContent content = {content} selectedBank={selectedBank} setSelectedBank={setSelectedBank} setContent={setContent} key={bank._id} bank={bank} />
      ))
    ) : (
      <NoBank setBankModelOpen={setBankModelOpen} />
    )}
    </>
  )
}

const BankSection = ({search,searchContent,content,setContent,loading}) => {
  const [selectedBank,setSelectedBank] = useState(null)
  const [bankModelOpen,setBankModelOpen] = useState(false)

  

  return (
    <div className="flex h-full flex-wrap items-start">
          {loading ? (
            <LoadingSpinner />
          ) : 
          (
            <Suspense fallback={<LoadingSpinner />}>
              {searchContent.length > 0 ? 
              <BankWrapper content={searchContent} selectedBank={selectedBank} setSelectedBank={setSelectedBank} setBankModelOpen={setBankModelOpen} setContent={setContent} /> 
              :
              (search !== "") ? <div className='text-[3rem] text-slate-300 m-auto'> No Bank info found </div>
              : 
              <BankWrapper content={content} selectedBank={selectedBank} setSelectedBank={setSelectedBank} setBankModelOpen={setBankModelOpen} setContent={setContent} /> 
            }
            </Suspense>
          )}
          <Modal isOpen={bankModelOpen} content={content} setBankContent={setContent} setBankModelOpen={setBankModelOpen} method="post" />
          <ToastContainer />
        </div>
  )
}

export default BankSection;
