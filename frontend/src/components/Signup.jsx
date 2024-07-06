import { useContext } from 'react'
import {useForm} from 'react-hook-form'
import { AuthContext } from '../context/Auth'

export default function Signup({hadAccount,setHadAccount}) {
  const {register, handleSubmit,formState} = useForm()
  const {dispatch} = useContext(AuthContext)
  const onSubmit = async (data) => {
    console.log(data)
    const status = await fetch("http://localhost:4321/api/signup",{
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(data)
    })
    const res = await status.json()
    if(status.ok){
      console.log("Signup Success")
      localStorage.setItem("token",res.token)
      dispatch({type : 'LOGIN',payload : res.token})
      console.log(res);
    }
    else {
      console.log("something went wrong")
    }
    
    // console.log(await status.json())
  }

  return (
    <div className="w-[23rem] h-[24rem] shadow-lg shadow-black  p-4 bg-slate-800 ring-1 rounded-2xl ring-cyan-700 flex flex-col items-center justify-evenly">
      <h1 className="text-3xl mb-4 text-white">Admin Login</h1> 
        <form onSubmit={handleSubmit(onSubmit)} className="w-2/3 space-y-6 flex flex-col">
          <input type="text" className="py-1 rounded-sm text-black" placeholder="Name" {...register("name")} />
          <input type="number" className="py-1 rounded-sm text-black" placeholder="Mobile number" {...register("mobilenumber")} />
          <input type="email" className="py-1 rounded-sm text-black" placeholder="Email" {...register("email")} />

          <input type={false ? "text" : "password"} className="py-1 rounded-sm text-black" placeholder="Password" {...register("password")} />

          <button disabled = {formState.isSubmitting || formState.isLoading} className="bg-cyan-400 w-1/2 self-center rounded-md py-[4px] hover:bg-slate-300 text-black" type="submit">{formState.isSubmitting ? "Logging": "Submit"}</button>
        </form>
        <button className='outline-none border-none text-red-500 hover:text-white' onClick={() => setHadAccount(true)}>Already have an account ?</button>
    </div>
  )
}
