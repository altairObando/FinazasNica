import { ExchangeRate } from '@/interfaces/Accounts/Account';
import { AppContext as IAppContext } from '@/interfaces/AppContext';
import { User } from '@/interfaces/Auth';
import { accountService } from '@/lib/accountService';
import { authService } from '@/lib/authService';
import { getValue, removeValue, setValue } from '@/lib/secureStore';
import React, { createContext, useCallback, useEffect, useState } from 'react';

export const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) =>{
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ user, setUser ] = useState<User | undefined | null >(null);
    const [ exchanges, setExchanges ] = useState<ExchangeRate[]>([]);

    const getExchanges = (currency: string) => {
        if( !exchanges || exchanges.length === 0 || !exchanges.some(item => item.quote != currency)) return 1;
        const rate = exchanges.find( item => item.quote === currency)?.rate ?? 1;
        return 1 / rate;
    }
    const getExchange = useCallback(getExchanges, [ exchanges ])

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
                    const [
                        userInfo,
                        exchanges,
                    ] = await Promise.all([
                        authService.me(),
                        accountService.exchange_rate()
                    ]);
                    await setValue('team_id', String(userInfo.team_id));
                    setUser(userInfo);
                    setExchanges(exchanges);
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
        user, setUser, logout, getExchange
    }

    return <AppContext.Provider value={ value }>
        { children }
    </AppContext.Provider>
}

