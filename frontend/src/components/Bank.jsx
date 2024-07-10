import { useContext, useState } from "react"
import { VaultContext } from "../context/Vaults"
import { useNavigate } from "react-router-dom"

const Bank = ({isBank,user,setIsModalOpen}) => {

    const [name,setName] = useState("")
    const [isLoading,setIsLoading] = useState(false)
    const {vaults,dispatch} = useContext(VaultContext)
    const nav = useNavigate()
    

    async function createVault(){
        setIsLoading(true)
        const response = await fetch('http://localhost:4321/api/vault', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token' : user
                },
                body: JSON.stringify({
                    name: name,
                    vaultType: (isBank ? "bank" : "media")
                })
        })
        if(response.status === 201){
            const data = await response.json()
            dispatch({type : "ADD",payload : {data : data, isBank : isBank}})
            setIsModalOpen(false)
            return nav(`/dashboard/${data._id}`)
        }
        setIsLoading(false)
    }

    return (
        <div className='bg-slate-700 h-2/6 w-1/5 flex flex-col items-center justify-center rounded-lg shadow-lg shadow-black'>
        <h2 className="text-2xl text-center font-bold mb-4 text-white">Create Vault</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-200">Vault Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} name="name" className="mt-1 text-xl block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
          </div>

          <button type="button" onClick={createVault} disabled={isLoading} className="w-full bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">{isLoading ? "Creating" : "Create"}</button>
        </form>
        </div>
    )
}

export default Bank