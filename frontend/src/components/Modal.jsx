import { useContext, useState } from 'react';
import ReactDOM from 'react-dom'
import { AuthContext } from '../context/Auth';
import { useParams } from 'react-router-dom';

export default function Modal({ isOpen,setBankModelOpen,content,setBankContent,data,method }){
  const [formData, setFormData] = useState({
    userName: data?.userName || '',
    password: data?.password || '',
    accountNumber: data?.accountNumber || '',
    accountName: data?.accountName || '',
    IFSC: data?.IFSC || ''
});
const [contentLoading,setContentLoading] = useState(false);
const {user} = useContext(AuthContext)
const {id} = useParams()

    if (!isOpen) return null;
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
          ...prevData,
          [name]: value
      }));
  };

    function onClose(){
      setBankModelOpen(false)
    }

    const handleNewInfo = async(e) => {
      e.preventDefault();
      if(method === "edit")
        return handleEditInfo(e);

      setContentLoading(true)
      const response = await fetch(`http://localhost:4321/api/bank/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": user,
        },
        body: JSON.stringify({
          vaultId : id,
          ...formData
        })
        });
        if(response.ok) {
          const val = await response.json();
          setBankContent(prev => [...prev,val])
          console.log(val)
          const cache = await caches.open("bank-cache");
          let url = `http://localhost:4321/api/bank/${id}`
          cache.match(url).then((cachedResponse) => {
            if (cachedResponse) {
              cachedResponse.json().then((cachedData) => {
                cache.put(
                  url,
                  new Response(JSON.stringify([...cachedData, val]))
                );
              });
            }
          });
        }
        setBankModelOpen(false)
      setContentLoading(false)
  }

  const handleEditInfo = async(e) => {
    e.preventDefault();
    setContentLoading(true)
    const response = await fetch(`http://localhost:4321/api/bank/${data._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": user,
      },
      body: JSON.stringify({
        vaultId : id,
        ...formData
      })
      });
      if(response.ok) {
        const val = await response.json();
        let newData = content.map(prev => {
          if(prev._id === data._id)
              return {...prev,...formData};
          else
            return prev;
        })
        console.log(newData)
        setBankContent(newData)
        const cache = await caches.open("bank-cache");
        let url = `http://localhost:4321/api/bank/${id}`
          cache.match(url).then((cachedResponse) => {
            if (cachedResponse) {
              cachedResponse.json().then((cachedData) => {
                  const updatedCacheData = cachedData.map(item => {
                      if (item._id === data._id) {
                          return { ...item, ...formData };
                      } else {
                          return item;
                      }
                  });
                  cache.put(url, new Response(JSON.stringify(updatedCacheData)));
              });
          } else {
              cache.put(url, new Response(JSON.stringify(newData)));
          }
          });
        setBankModelOpen(false)
      }
    setContentLoading(false)
}
  
    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-20 bg-black bg-opacity-40 flex flex-col items-center justify-center">
        
        <div className="bg-gray-800 w-2/5 rounded-md shadow-md shadow-black py-3 px-10">

<h2 className="text-3xl text-white font-bold mb-4 text-center">New info</h2>
<form onSubmit={handleNewInfo} className="flex flex-col">
  <div className="mb-4">
    <label htmlFor="userName" className="block text-sm font-medium text-gray-300">Username</label>
    <input required onChange={handleChange} value={formData.userName} type="text" id="userName" name="userName" className="mt-1 py-2 block w-full border border-gray-300 text-xl outline-none rounded-md shadow-sm  focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
  </div>
  <div className="mb-4">
    <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
    <input required onChange={handleChange} value={formData.password} type="password" id="password" name="password" className="mt-1 py-2 block w-full border border-gray-300 text-xl outline-none rounded-md shadow-sm  focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
  </div>
  <div className="mb-4">
    <label htmlFor="accNumber" className="block text-sm font-medium text-gray-300">Account Number</label>
    <input required onChange={handleChange} value={formData.accountNumber} type="number" id="accNumber" name="accountNumber" className="mt-1 py-2 block w-full border border-gray-300 text-xl outline-none rounded-md shadow-sm  focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
  </div>
  <div className="mb-4">
    <label htmlFor="accName" className="block text-sm font-medium text-gray-300">Account Name</label>
    <input required onChange={handleChange} value={formData.accountName} type="text" id="accName" name="accountName" className="mt-1 py-2 block w-full border border-gray-300 text-xl outline-none rounded-md shadow-sm  focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
  </div>
  <div className="mb-4">
    <label htmlFor="ifsc" className="block text-sm font-medium text-gray-300">IFSC</label>
    <input required onChange={handleChange} value={formData.IFSC} type="text" id="ifsc" name="IFSC" className="mt-1 py-2 block w-full border border-gray-300 text-xl outline-none rounded-md shadow-sm  focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
  </div>
  <button type="submit" disabled={contentLoading} className="w-1/3 mx-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md ">{contentLoading ? "Saving..." : "Save"}</button>
</form>
  </div>
            <button onClick={onClose} className="text-[2rem] p-0 my-2 aspect-square flex items-center justify-center bg-red-500 rounded-full border-none outline-none text-white">&times;</button>
        </div>
      ,
      document.body
    );
};