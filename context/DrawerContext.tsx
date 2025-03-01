"use client"
import React, { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";

type DrawerContextType = {
  isOpen : boolean;
  setIsOpen : Dispatch<SetStateAction<boolean>>
}

const DrawerContext = createContext<DrawerContextType>({isOpen : false ,setIsOpen : () => {}});

export function DrawerWrapper({children} : {children : ReactNode}){
  const [isOpen, setIsOpen] = useState(false);
  return(
    <DrawerContext.Provider value={{isOpen , setIsOpen}}>
      {children}
    </DrawerContext.Provider>
  )
}

export function useDrawerContext(){
  return useContext(DrawerContext);
}