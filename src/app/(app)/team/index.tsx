import { CategoriesCard } from '@/components/Categories/CategoriesCard';
import { Membership } from '@/components/Team/Members';
import Profile from '@/components/Team/Profile';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button, MD2Colors, Surface } from 'react-native-paper';

export default function TeamTab(){
    return <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <Surface style={{ flex: 1, padding: 10, gap: 10 }}>
            <Profile />
            <Membership />
            <CategoriesCard />
            <Button mode='contained' icon='check'>
                Guardar todos los cambios
            </Button>
            <View style={{ flexDirection:'row', alignItems:'center',justifyContent:'space-between', gap: 8 }}>
                <Button icon='swap-horizontal' mode='contained' buttonColor={MD2Colors.amberA700} style={{ flex: 1 }}>
                    Cambiar espacio
                </Button>
                <Button icon='exit-to-app' mode='contained' buttonColor={MD2Colors.red600} textColor={'#fff'} style={{ flex: 1 }}>
                    Cerrar Sesión
                </Button>
            </View>
        </Surface>
    </ScrollView>
}