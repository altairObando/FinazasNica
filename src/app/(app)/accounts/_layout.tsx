import { CustomAppBar } from '@/components/misc/CustomAppBar';
import { Stack } from 'expo-router';
import React from 'react';
export default function AccountLayout(){
    return <Stack screenOptions={{ header: props => <CustomAppBar {...props} />}}/>
}