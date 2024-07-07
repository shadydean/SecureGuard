import { createContext,useEffect,useReducer } from "react";

export const VaultContext = createContext()

export const vaultReducer = (state,action) => {
    switch(action.type) {
        case 'SET' : {
            localStorage.setItem("vaults",JSON.stringify(action.payload))
            return {vaults : action.payload}
        }
        case 'ADD' : {
            let vaults;
            console.log(state)
            if(action.payload.isBank){
                
                vaults = {mediaVaults : [...state.vaults.mediaVaults], bankVaults: [...state.vaults.bankVaults, action.payload.data]}
            }
            else {
                vaults = {mediaVaults : [...state.vaults.mediaVaults,action.payload.data], bankVaults: [...state.vaults.bankVaults]}
            }
            localStorage.setItem("vaults",JSON.stringify(vaults))
            return {vaults : vaults}
        }

        case 'UPDATE' : {
            let vaults;
            console.log(state)
            if(action.payload.isBank){
                vaults = {mediaVaults : [...state.vaults.mediaVaults], bankVaults : state.vaults.bankVaults.map(vault => {
                    if(vault._id !== action.payload._id) return vault
                    else {
                        return {...vault,name : action.payload.name}
                    }
                })}
            }
            else{
                vaults = {bankVaults : [...state.vaults.bankVaults], mediaVaults : state.vaults.mediaVaults.map(vault => {
                    if(vault._id !== action.payload._id) return vault
                    else {
                        return {...vault,name : action.payload.name}
                    }
            })
            }}

            localStorage.setItem("vaults",JSON.stringify(vaults))
            return {vaults : vaults}
        }

        case 'DELETE' : {
            let vaults;
            if(action.payload.isBank){
                vaults = {mediaVaults : [...state.vaults.mediaVaults], bankVaults : state.vaults.bankVaults.filter(vault => vault._id !== action.payload._id)}
            }
            else {
                vaults = {bankVaults : [...state.vaults.bankVaults], mediaVaults : state.vaults.mediaVaults.filter(vault => vault._id !== action.payload._id)}
            }
            return {vaults : vaults}  
        }

        case 'CLEAR' : 
            return {vaults : null}

        default : 
            return state
    }
}

export const Vaults = ({children}) => {
    const [state,dispatch] = useReducer(vaultReducer,{
        vaults : (localStorage.getItem("vaults") !== "undefined" )? JSON.parse(localStorage.getItem("vaults")) : null
    })

    return (
        <VaultContext.Provider value={{...state,dispatch}}>
            {children}
        </VaultContext.Provider>
    )
}