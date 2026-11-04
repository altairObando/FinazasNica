import { useAppProvider } from '@/hooks/useAppProvider';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Button, Surface, Text } from "react-native-paper";

export default function HomeTab(){
    const { isLoggedIn,  logout, user } = useAppProvider();
    const router = useRouter();
    useEffect(()=>{
        if( !isLoggedIn )
            router.replace('/login');
        if( !user || user === null || user.team_code === '' ){
            router.replace('/account');
        }
    },[ user ])
    return <Surface style={{ flex: 1 }}>
        <Text>Pending</Text>
        <Button onPress={()=> router.push('/account')}>
            cerrar session
        </Button>
    </Surface>
}