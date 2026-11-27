import { CustomAppBar } from '@/components/misc/CustomAppBar';
import { Stack } from 'expo-router';
import React from 'react';
export default function AccountLayout(){
    return <Stack screenOptions={{ header: props => <CustomAppBar {...props} />}}>
        <Stack.Screen name='index' options={{ title: 'Cuentas' }}  />
        <Stack.Screen name='[id]' options={{ title: 'Formulario'}} />
        <Stack.Screen name='transfer' options={{ title: 'Transferencia'}} />
    </Stack>
}