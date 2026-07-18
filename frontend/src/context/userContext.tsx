import { createContext, type ReactNode, useState,useEffect,useContext } from "react";
import  type  {User}   from '../types/type';

interface userContextType {
 currentUser : User |  null,
 login : (user : User) => void,
 logout : ()=> void,
};

export const UserContext = createContext<userContextType|null>(null);

export const UserProvider = ({children}: {children : ReactNode}) => {
 const [currentUser,setCurrentUser] = useState<User|null>(null);

 useEffect(()=>{
    const saved = localStorage.getItem('currentUser')
    if (saved) setCurrentUser(JSON.parse(saved))
 },[]);
 const login = (user: User) => {
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user))
    localStorage.setItem('userId', user.id)
 };
 const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('userId')
  }
  return (
     <UserContext.Provider value={{currentUser, login, logout}}>
     {children}
     </UserContext.Provider>
  );
};
export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
