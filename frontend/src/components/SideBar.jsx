import React from 'react'
import sgLogo from '../assets/sgLogo.jpg'
import { Link } from 'react-router-dom'

const SideBar = ({vaults}) => {
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
                <button className='bg-purple-500 text-slate-800 aspect-square h-6 flex items-center justify-center rounded-full text-[1.4rem]'>+</button>
                
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
                <button className='bg-purple-500 text-slate-800 aspect-square h-6 flex items-center justify-center rounded-full text-[1.4rem]'>+</button>
                 
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
    </div>
  )
}

export default SideBar