import React, { useContext, useEffect, useRef } from 'react'
import Login from '../components/Login'
import sgLogo from '../assets/sgLogo.jpg'
import file from '../assets/file.png'
import { AuthContext } from '../context/Auth'
import { Navigate } from 'react-router-dom'
import { FaCheck } from "react-icons/fa";

const LandingPage = () => {
    const {user} = useContext(AuthContext)
    const topPage = useRef(null)
    const aboutUs = useRef(null)
    const contactUs = useRef(null)

    const scrollToSection = (ref) => {
      window.scrollTo({
        top: ref.current.offsetTop - 70,
        behavior: 'smooth'
      });
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
            <button onClick={() => scrollToSection(ref)} className='font-semibold mx-5 px-6 py-2 bg-blue-700 rounded-lg hover:bg-blue-600 shadow-md shadow-black'>Login</button>
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
            <img src={file} className='drop-shadow-2xl' />
          </section>
        </section>

        {/* about us section */}

        <section className='h-[50rem]' id='about-us'  ref={aboutUs}>
          <Login />
        </section>
        <section className='h-[50rem]' id='contact-us' ref={contactUs}>
          contact us section
        </section>
      </div>
    )

}

export default LandingPage