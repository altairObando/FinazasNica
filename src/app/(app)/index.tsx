import { CustomAppBar } from '@/components/misc/CustomAppBar';
import { NativeStackHeaderProps, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { Surface, Text } from 'react-native-paper';

export default function AccountsTab(){
    const nav = useNavigation();
    useEffect(()=>{
        if ( !nav ) return;
        nav.setOptions({
            headerShown: true,
            header: (props: NativeStackHeaderProps) => <CustomAppBar {...props} />
        })
    },[ nav ])
    return <Surface style={{ flex: 1 }}>
        <Text>Pending</Text>
    </Surface>
}