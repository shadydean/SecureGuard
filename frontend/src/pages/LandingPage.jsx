import React, { useContext, useEffect, useRef } from 'react'
import Login from '../components/Login'
import sgLogo from '../assets/sgLogo.jpg'
import heroImage from '../assets/heroImage.jpg'
import { AuthContext } from '../context/Auth'
import { Navigate } from 'react-router-dom'

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
        <nav className='flex justify-between items-center py-3 sticky top-0 backdrop-blur-md'>
          <div className="flex items-center gap-x-2 py-1">
            <img src={sgLogo} alt="logo" className='w-[2rem] h-[2rem] rounded-full ' />
            <button onClick={() => scrollToSection(ref)} className='text-[1.5rem] font-bold outline-none border-none'>SecureGuard</button>
          </div>

          <div className="">
            <button className='mx-5 font-semibold px-2 py-2 rounded-lg hover:text-slate-900 hover:bg-white' onClick={() => scrollToSection(aboutUs)}>About us</button>
            <button className='mx-5 font-semibold px-2 py-2 rounded-lg hover:text-slate-900 hover:bg-white' onClick={() => scrollToSection(contactUs)}>Contact us</button>    
            <button onClick={() => scrollToSection(ref)} className='font-semibold mx-5 px-6 py-2 bg-blue-700 rounded-lg hover:bg-blue-600 shadow-md shadow-black'>Login</button>
          </div>
          
        </nav>
        <section className='h-[40rem] flex justify-between' id='hero' ref={topPage}>
          {/* left */}
          <section className='flex-1'>
             <h1>Your Data, Our Priority</h1>
             <p>Keep your sensitive information safe with SecureGuard – our state-of-the-art encryption ensures your data remains private and protected.</p>
          </section>
          {/* right  */}
          <section className='flex-1'>
            <img src={heroImage} />
          </section>
        </section>
        <section className='h-[50rem]' id='about-us'  ref={aboutUs}>
          about us section
        </section>
        <section className='h-[50rem]' id='contact-us' ref={contactUs}>
          contact us section
        </section>
      </div>
    )

}

export default LandingPage