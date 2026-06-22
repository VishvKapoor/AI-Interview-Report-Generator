import { createContext,useState,useEffect} from "react";
import { getMe } from "./services/auth.api";

export const Authcontext=createContext()

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null)
    const [loading,setLoading]=useState(true)

    //this is logic for if our user is loggedin than after refreshing the page it must not show login page again and not logged out 
    useEffect(()=>{
        const getAndSetUser=async()=>{
            try{
                const data=await getMe()
                setUser(data.user)
            }catch(err){
                console.log(err)
            }finally{
                setLoading(false)
            }
        }
        getAndSetUser()
    },[])

    return (
        <Authcontext.Provider value={{user,setUser,loading,setLoading}}>
            {children}
        </Authcontext.Provider>
    )
} 