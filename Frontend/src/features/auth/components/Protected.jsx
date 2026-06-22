import { useAuth } from "../hooks/useauth";
import { Navigate } from "react-router";
import React from 'react'

//this is the logic for if some one doesnt login/signup and try to access different pages of our site than
const Protected = ({children}) => {
    const{loading,user}=useAuth()  
    if(loading){
        return (<main><h1>Loading...</h1></main>)
    }
    if(!user){
        return <Navigate to={'/login'}/>
    }
  return children  
}

export default Protected
