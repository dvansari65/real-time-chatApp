import { createContext } from "react";
import { User } from "../../types/user"


type authContextTypes = {
    user : User | null;
    setUser :(user:User | null)=>void;
    logout:()=>void;
}

const AuthContext = createContext<authContextTypes | undefined>(undefined)

export const authProvider = async()=>{

}