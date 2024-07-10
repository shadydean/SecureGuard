// MediaContent.jsx
import React, { Suspense, useContext, useState } from 'react';
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
      const response = await fetch(`http://localhost:4321/api/bank/${selectedBank}`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token" : user
        },
      })

      if(response.ok){
        let newContent = content.filter(m => m._id !== selectedBank)
        setContent(newContent)
        const cache = await caches.open("bank-cache");
      
      cache.match(`http://localhost:4321/api/bank/${id}`).then((cachedResponse) => {
        if (cachedResponse) {
          cachedResponse.json().then((cachedData) => {
            cache.put(
              `http://localhost:4321/api/bank/${id}`,
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

const BankSection = ({content,setContent,loading}) => {
  const [selectedBank,setSelectedBank] = useState(null)
    // console.log(content)
  return (
    <div className="flex h-full flex-wrap items-start">
          {loading ? (
            <LoadingSpinner />
          ) : 
          (
            <Suspense fallback={<LoadingSpinner />}>
              {content.length > 0 ? (
                content.map((bank) => (
                  <BankContent content = {content} selectedBank={selectedBank} setSelectedBank={setSelectedBank} setContent={setContent} key={bank._id} bank={bank} />
                ))
              ) : (
                <h1 className="text-white">No content</h1>
              )}
            </Suspense>
          )}
        </div>
  )
}

export default BankSection;
