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

        case 'DELETE' : 
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