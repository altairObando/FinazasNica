import { CategoriesCard } from '@/components/Categories/CategoriesCard';
import { Membership } from '@/components/Team/Members';
import Profile from '@/components/Team/Profile';
import { useAppProvider } from '@/hooks/useAppProvider';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button, MD2Colors, Surface } from 'react-native-paper';

export default function TeamTab(){
    const router = useRouter();
    const { logout } = useAppProvider();
    const switchAccount=()=>{
        // router.push('/account');
    }
    const onCategoriesPress=({ summary }: { summary: string}) =>(
        router.push({ 
            pathname: '/team/categories',
            params: {
                summary
            }
        })
    );

    return <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <Surface style={{ flex: 1, padding: 10, gap: 10 }}>
            <Profile />
            <Membership />
            <CategoriesCard onCategoriesPress={ onCategoriesPress }/>
            <Button mode='contained' icon='check'>
                Guardar todos los cambios
            </Button>
            <View style={{ flexDirection:'row', alignItems:'center',justifyContent:'space-between', gap: 8 }}>
                <Button onPress={ switchAccount } icon='swap-horizontal' mode='contained' buttonColor={MD2Colors.amberA700} style={{ flex: 1 }}>
                    Cambiar espacio
                </Button>
                <Button onPress={ logout } icon='exit-to-app' mode='contained' buttonColor={MD2Colors.red600} textColor={'#fff'} style={{ flex: 1 }}>
                    Cerrar Sesión
                </Button>
            </View>
        </Surface>
    </ScrollView>
}