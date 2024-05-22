import { createContext,useReducer } from "react";

export const AuthContext = createContext()

export const authReducer = (state,action) => {
    switch(action.type) {
        case 'LOGIN' : 
            return {user : action.payload}

        case 'LOGOUT' : 
            return {user : null}

        default : 
            return state
    }
}

export const Auth = ({children}) => {
    const [state,dispatch] = useReducer(authReducer,{
        user : localStorage.getItem("token") || null
    })

    return (
        <AuthContext.Provider value={{...state,dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}