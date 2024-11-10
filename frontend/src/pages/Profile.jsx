import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/Auth";
import ReactDOM from 'react-dom'
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { toast, ToastContainer } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

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

const ChangePassword = ({setIsModalOpen,user,userData}) => {
  const [formData,setFormData] = useState({
    prevPassword : '',
    newPassword : '',
    confirmPassword : ''
  })

  async function handleChangePassword(e){
    e.preventDefault()
    if(formData.newPassword !== formData.confirmPassword)
      console.log("Both passwords must match")
    else{
      try{
        const response = await fetch(`https://secureguard-production.up.railway.app/api/credentials/changePassword/${userData._id}`,{
          method : 'PUT',
          headers : {'Content-Type' : 'application/json','x-auth-token' : user},
          body : JSON.stringify(formData)
          })
          const data = await response.json()
        if(response.ok){
          console.log(data)
          console.log("Password changed successfully")
          setIsModalOpen(false)
        }
        else{
          toast.error(data)
        }
      }catch(err){
        console.log(err)
        console.log(err.message)
      }     
    }
  }

  function handleChange(e){
    e.preventDefault();
    const {name,value} = e.target;
    setFormData({...formData,[name] : value})
  }
  

  return (
    <div className='bg-slate-800 h-2/5 w-1/5 flex flex-col items-center justify-center rounded-lg shadow-lg shadow-black'>
        <h2 className="text-2xl text-center font-bold mb-4 text-white">Change Password</h2>
        <form className="flex flex-col space-y-3" onSubmit={handleChangePassword}>
      <input required className="px-2 py-2 rounded-md" onChange={handleChange} value={formData.prevPassword} name="prevPassword" type="password" placeholder="Previous Password" />
      <input required className="px-2 py-2 rounded-md" onChange={handleChange} value={formData.newPassword} name="newPassword" type="password" placeholder="New Password" />
      <input required className="px-2 py-2 rounded-md" onChange={handleChange} value={formData.confirmPassword} name="confirmPassword" type="password" placeholder="Confirm Password" />
      <button className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white" type="submit">Change Password</button>
    </form>
        </div>
  )
}

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing,setIsEditing] = useState(false);
  const [isModalOpen,setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const { user, dispatch } = useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    async function fetchUser() {
      try {
        const response = await fetch("https://secureguard-production.up.railway.app/api/credentials", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": user,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // console.log(data);
          setUserData(data[0]);
        }
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    }

    if (!user) nav("/");
    else fetchUser();
  }, [user]);

  const handleEditProfile = async () => {
    try {
      const response = await fetch(
        `https://secureguard-production.up.railway.app/api/credentials/${userData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": user,
          },
          body: JSON.stringify({name : userData.name,mobilenumber : userData.mobilenumber}),
        }
      );

      if (response.ok) {
        const data = await response.json()
        console.log(data)
      } 
      
    } catch (err) {
      console.log(err);
    }
    setIsEditing(false)
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(
        `https://secureguard-production.up.railway.app/api/credentials/${userData._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": user,
          },
        }
      );

      if (response.ok) {
        // Handle account deletion (e.g., navigate to a goodbye page or logout)
        dispatch({ type: "LOGOUT" });
        nav("/");
      } else {
        console.log("Failed to delete account");
      }
    } catch (err) {
      console.log(err);
    }
  };

  function handleChange(e){
    e.preventDefault();
    const {name,value} = e.target;
    setUserData({...userData,[name]:value});
  }

  function onClose(){
    setIsModalOpen(false)
  }

  // console.log(userData);
  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <SideBar />
      <section className="w-5/6 bg-slate-900 flex flex-col p-8 overflow-y-auto">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex flex-col items-center space-y-8">
            {/* top section  */}
            <div className="flex items-center justify-center space-x-20">
              <div className="rounded-full w-[16rem] h-[16rem] border border-slate-500 text-[8rem] flex items-center justify-center text-white">
                {userData?.name?.charAt(0)}
              </div>
              <div className="flex flex-col space-y-3">
                <h1 className="text-slate-200 text-xl">{userData?.email}</h1>
                <h1 className="text-slate-200 text-2xl font-bold">
                  {userData?.role}
                </h1>
              </div>
            </div>
            {/* info section  */}
            <div className="flex flex-col space-y-8 w-[37%]">
              <div className="flex space-x-10 justify-between items-center">
                  <label className="text-2xl font-thin" htmlFor="name">Name</label>
                  <input onChange={(e) => handleChange(e)} disabled={!isEditing} className="bg-slate-900 border border-slate-500 py-2 px-2 rounded-md" id="name" name="name" type="text" value={userData?.name} />
              </div>
              <div className="flex space-x-10 justify-between items-center">
                  <label className="text-2xl font-thin" htmlFor="mobilenumber">Mobile Number</label>
                  <input onChange={(e) => handleChange(e)} disabled={!isEditing} className="bg-slate-900 border border-slate-500 py-2 px-2 rounded-md" id="mobilenumber" name="mobilenumber" type="number" value={userData?.mobilenumber} />
              </div>
            </div>
            <div className="flex items-center justify-between mt-12 w-[37%]">
              {
                isEditing ? 
                  <button onClick={handleEditProfile} className="px-3 py-2 rounded-lg bg-blue-600 hover_bg-blue-500 shadow-md shadow-black">Save</button>
                : <button onClick={() => setIsEditing(true)} className="px-3 py-2 rounded-lg bg-blue-600 hover_bg-blue-500 shadow-md shadow-black">Edit</button>
              }
              <button onClick={() => setIsModalOpen(true)} className="px-3 py-2 rounded-lg bg-blue-600 hover_bg-blue-500 shadow-md shadow-black">Change Password</button>
              <button onClick={handleDeleteAccount} className="px-3 py-2 rounded-lg bg-red-600 hover_bg-red-500 shadow-md shadow-black">Delete Account</button>
            </div>
          </div>
        )}
      </section>
      <Modal isOpen={isModalOpen} onClose={onClose}>
          <ChangePassword setIsModalOpen={setIsModalOpen} user={user} userData={userData} />
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Profile;
