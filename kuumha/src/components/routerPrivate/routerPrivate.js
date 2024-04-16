import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

export const RouterPrivate = ({ children, isAuth, permission }) => {

    if(isAuth && permission){
        return children
    }

    return <Navigate to={"/"}/>
}