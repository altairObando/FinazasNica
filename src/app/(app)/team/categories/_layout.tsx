import { CustomAppBar } from '@/components/misc/CustomAppBar';
import { Stack, useRouter, useTheme } from 'expo-router';
import React from 'react';
import { IconButton, Tooltip } from 'react-native-paper';

export default function CategoriesRoot(){
    const router = useRouter();
    const theme = useTheme();
    const onNewCategory=()=> router.push({
        pathname: '/(app)/team/categories/[id]',
        params: {
            id: 0,
        }
    })
    const renderRight = ()=>{
        return <Tooltip title='Nueva Categoria'>
            <IconButton 
                icon='plus-circle'
                iconColor={ theme.colors.primary as string }
                size={30}
                onPress={onNewCategory}/>
        </Tooltip>
    }
    return <Stack screenOptions={{ header: props => <CustomAppBar {...props} />}}>
        <Stack.Screen name='index' options={{ title: 'Categorias', headerRight: renderRight  }} />
        <Stack.Screen name='[id]' options={{ title: 'Crear/Modificar Categoria'}}/>
    </Stack>
}