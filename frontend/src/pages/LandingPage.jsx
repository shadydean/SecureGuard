import React, { useContext, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import Login from '../components/Login'
import sgLogo from '../assets/sgLogo.jpg'
import temp from '../assets/temp.png'
import file from '../assets/file.png'
import { AuthContext } from '../context/Auth'
import { Navigate } from 'react-router-dom'
import { FaCheck } from "react-icons/fa";
import Signup from '../components/Signup'
import Footer from '../components/Footer'

const Modal = ({ isOpen, onClose, children }) => {
  const [hadAccount,setHadAccount] = useState(true);
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex flex-col items-center justify-center">
      
          {hadAccount ? <Login hadAccount = {hadAccount} setHadAccount = {setHadAccount} /> : <Signup hadAccount={hadAccount} setHadAccount={setHadAccount} />}
          
          <button onClick={onClose} className="text-[2.5rem] p-0 my-2 aspect-square flex items-center justify-center bg-red-500 rounded-full border-none outline-none text-white">&times;</button>
      </div>
    ,
    document.body
  );
};

const LandingPage = () => {
    const {user} = useContext(AuthContext)
    const topPage = useRef(null)
    const aboutUs = useRef(null)
    const contactUs = useRef(null)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const scrollToSection = (ref) => {
      window.scrollTo({
        top: ref.current.offsetTop - 70,
        behavior: 'smooth'
      });
    };

    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };

    if(user !== null)
        return <Navigate to='/home' />
    
    return (
      <div className='min-h-[100dvh] max-w-[1200px] mx-auto '>
      {/* <Login /> */}
        <nav className='flex justify-between items-center py-3 sticky top-0 backdrop-blur-md z-10'>
          <div className="flex items-center gap-x-2 py-1">
            <img src={sgLogo} alt="logo" className='w-[2rem] h-[2rem] rounded-full ' />
            <button onClick={() => scrollToSection(ref)} className='text-[2rem] text-blue-500 font-semibold outline-none border-none'>SecureGuard</button>
          </div>

          <div className="">
            <button className='mx-5 font-semibold px-2 py-2 rounded-lg hover:text-slate-900 hover:bg-white' onClick={() => scrollToSection(aboutUs)}>About us</button>
            <button className='mx-5 font-semibold px-2 py-2 rounded-lg hover:text-slate-900 hover:bg-white' onClick={() => scrollToSection(contactUs)}>Contact us</button>    
            <button onClick={openModal} className='font-semibold mx-5 px-6 py-2 bg-blue-700 rounded-lg hover:bg-blue-600 shadow-md shadow-black'>Login</button>
          </div>
          
        </nav>
        <section className='h-[47rem] flex justify-between' id='hero' ref={topPage}>
          {/* left */}
          <section className='flex-1 flex flex-col justify-center gap-8'>
             <h1 className='text-[3.6rem] text-blue-400 font-semibold'>Your Data, Our Priority</h1>
             <p className='font-light text-slate-200 text-[1.38rem]'>Keep your sensitive information safe with SecureGuard – our state-of-the-art encryption ensures your data remains private and protected.</p>
             <ul className='flex flex-col gap-8 font-thin text-[1.2rem] text-slate-400'>
              <li className='flex items-center gap-x-2'><span><FaCheck className=' text-green-400' /></span>Easily organize and access your files with robust encryption.</li>
              <li className='flex items-center gap-x-2'><span><FaCheck className=' text-green-400' /></span>Trust in industry-leading encryption technology to keep your data safe.</li>
              <li className='flex items-center gap-x-2'><span><FaCheck className=' text-green-400' /></span>Navigate and manage your files with ease using our intuitive platform.</li>
             </ul>
             
          </section>
          {/* right  */}
          <section className='flex-1 flex justify-center items-center drop-shadow-2xl z-0'>
            <img src={temp} className='drop-shadow-3xl' />
          </section>
        </section>

        {/* about us section */}
        <section className=" text-white" id="features">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-[3rem] font-semibold mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 border-2 border-slate-700  text-slate-100 rounded-lg shadow-black shadow-md">
              <h3 className="text-xl  font-semibold mb-4">Robust Encryption</h3>
              <p className='font-thin'>SecureGuard uses industry-leading encryption technology to protect your data.</p>
            </div>
            <div className="p-6 border-2 border-slate-700 text-slate-100 rounded-lg shadow-black shadow-md">
              <h3 className="text-xl  font-semibold mb-4">User-Friendly Interface</h3>
              <p className='font-thin'>Easily organize and access your files with our intuitive platform.</p>
            </div>
            <div className="p-6 border-2 border-slate-700 text-slate-100 rounded-lg shadow-black shadow-md">
              <h3 className="text-xl  font-semibold mb-4">Real-Time Monitoring</h3>
              <p className='font-thin'>Stay informed with real-time monitoring and alerts for your data.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 text-white" id="benefits">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 border-2 border-slate-700  rounded-lg shadow-black shadow-md">
              <h3 className="text-xl font-semibold mb-4">Data Security</h3>
              <p className='font-thin'>Keep your sensitive information safe and secure from unauthorized access.</p>
            </div>
            <div className="p-6 border-2 border-slate-700  rounded-lg shadow-black shadow-md">
              <h3 className="text-xl font-semibold mb-4">Privacy Protection</h3>
              <p className='font-thin'>Your data privacy is our top priority, ensuring complete confidentiality.</p>
            </div>
            <div className="p-6 border-2 border-slate-700  rounded-lg shadow-black shadow-md">
              <h3 className="text-xl font-semibold mb-4">Ease of Use</h3>
              <p className='font-thin'>Our platform is designed for ease of use, making data management simple.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 text-white " id="testimonials">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 border-2 border-slate-700  rounded-lg shadow-black shadow-md">
              <p className="mb-4 font-thin">"SecureGuard has transformed the way we manage our data. It's incredibly secure and easy to use!"</p>
              <p className="font-bold">- Jane Doe</p>
            </div>
            <div className="p-6 border-2 border-slate-700  rounded-lg shadow-black shadow-md">
              <p className="mb-4 font-thin">"I feel much safer knowing that my sensitive information is protected by SecureGuard."</p>
              <p className="font-bold">- John Smith</p>
            </div>
            <div className="p-6 border-2 border-slate-700  rounded-lg shadow-black shadow-md">
              <p className="mb-4 font-thin">"The best data protection service I've used. Highly recommend SecureGuard!"</p>
              <p className="font-bold">- Mary Johnson</p>
            </div>
          </div>
        </div>
      </section>

      {/*Footer*/}
      <div id="contactUs" ref={contactUs} className="flex items-center justify-center min-h-[80dvh]">
      <div className="bg-gray-800 shadow-lg shadow-black rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Contact Us</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-slate-400 font-bold mb-2">Name:</label>
            <input type="text" id="name" name="name" className="border bg-slate-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-slate-400 font-bold mb-2">Email:</label>
            <input type="email" id="email" name="email" className="border bg-slate-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-slate-400 font-bold mb-2">Message:</label>
            <textarea id="message" name="message" className="border bg-slate-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-none"></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" onClick={()=>{alert('Your query is successfully submitted!')}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
          </div>
        </form>
      </div>
    </div>
    <Footer />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" name="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" name="password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
          </div>
          <button type="submit" className="w-full bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">Login</button>
        </form>
      </Modal>
      </div>
    )

}

export default LandingPage