import { User } from "./Auth";

export interface AppContext  {
    isLoggedIn: boolean,
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
    isLoading: boolean,
    user: User | null | undefined
    setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>
    logout: ()=> Promise<void>
}