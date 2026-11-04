import { AppContext as IAppContext } from '@/interfaces/AppContext';
import { User } from '@/interfaces/Auth';
import { authService } from '@/lib/authService';
import { getValue, removeValue } from '@/lib/secureStore';
import React, { createContext, useEffect, useState } from 'react';

export const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) =>{
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ user, setUser ] = useState<User | undefined | null >(null);

    

    async function logout(){
        await removeValue('api_token');
        await removeValue('remember');
        setIsLoggedIn(false);
    }

    useEffect(() => {
        async function check(){
            try {
                let token = await getValue('api_token') || null,
                    remember = await getValue('remember') || null;
                if( token && remember ){
                    const userInfo = await authService.me();
                    setUser(userInfo);
                    setIsLoggedIn(true);
                } else {
                    await removeValue('api_token');
                    await removeValue('remember');
                    setIsLoggedIn(false);
                }
            } finally {
                setIsLoading(false);
            }
        }
        check();
    }, [])

    const value = {
        isLoggedIn, setIsLoggedIn,
        isLoading,
        user, setUser, logout
    }

    return <AppContext.Provider value={ value }>
        { children }
    </AppContext.Provider>
}

