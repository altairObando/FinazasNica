import { CustomAppBar } from '@/components/misc/CustomAppBar';
import { Stack } from 'expo-router';
import React from 'react';

export default function TeamLayout(){
    return <Stack screenOptions={{ header: props => <CustomAppBar {...props} />}}>
        <Stack.Screen name='index' options={{ title: 'Perfil & Categorías'}} />
    </Stack>
}