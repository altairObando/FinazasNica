import { AppContext as IAppContext } from '@/interfaces/AppContext';
import { User } from '@/interfaces/Auth';
import { authService } from '@/lib/authService';
import { getValue, removeValue, setValue } from '@/lib/secureStore';
import React, { createContext, useEffect, useState } from 'react';

export const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) =>{
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ user, setUser ] = useState<User | undefined | null >(null);

    

    async function logout(){
        await removeValue('api_token');
        await removeValue('remember');
        await removeValue('team_id');
        setIsLoggedIn(false);
    }

    useEffect(() => {
        async function check(){
            try {
                let token = await getValue('api_token') || null,
                    remember = await getValue('remember') || null;
                if( token && remember ){
                    const userInfo = await authService.me();
                    await setValue('team_id', String(userInfo.team_id));
                    setUser(userInfo);
                    setIsLoggedIn(true);
                } else {
                    logout();
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

