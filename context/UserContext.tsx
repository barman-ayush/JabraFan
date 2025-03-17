"use client"
import React, { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";


type UserProps = {
    id : number;
    name : string;
    src : string;
    phone : string;
    credits : number;
    winnings : number;
    upiId : string;
}


type UserContextProps = {
    userData : UserProps | undefined | null;
    setUserData : Dispatch<SetStateAction<UserProps | undefined | null>>;
}



const UserContext = createContext<UserContextProps>({userData : undefined , setUserData : () => {}});

export function UserWrapper({children} : {children : ReactNode}){
  const [userData, setUserData] = useState<UserProps | undefined | null>(undefined);
  return(
    <UserContext.Provider value={{userData , setUserData}}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext(){
  return useContext(UserContext);
}