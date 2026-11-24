import { CategoryIconColorSelect } from '@/components/Categories/CategoryIconColorSelect';
import { BottomSheet } from '@/components/misc/BottomSheet';
import { CustomInput } from '@/components/misc/CustomInput';
import { useSimpleSnackbar } from '@/data/SnackProvider';
import { useAppProvider } from '@/hooks/useAppProvider';
import { NewAccount } from '@/interfaces/Accounts/Account';
import { Currency } from '@/interfaces/general/currency';
import { accountService } from '@/lib/accountService';
import { toTransparentColor } from '@/lib/format';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Card, Icon, Surface, Text, useTheme } from 'react-native-paper';

export default function AccountForm(){
    const params = useLocalSearchParams();
    const { user } = useAppProvider();
    const theme = useTheme();
    const [ showModal, setShowModal ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const router = useRouter();
    const sb = useSimpleSnackbar();
    // Fields
    const [ name, setName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ currency, setCurrency ] = useState<Currency>('NIO');
    const [ opening_price, setOpeningPrice ] = useState('');
    const [ icon, setIcon ] = useState('bank');
    const [ color, setColor ] = useState(theme.colors.primary);

    const onCancel=()=>router.back();
    
    const onSubmitForm= async ()=>{
        if( loading ) return;
        try {
            setLoading(true);
            const entity = {
                name: name,
                description: description,
                currency: currency,
                color: color,
                icon: icon,
                is_active: true,
                opening_price: parseFloat(opening_price),
                team_id: user?.team_id,
            } as NewAccount;
            const response = await accountService.add(entity);
            sb.success(`Se ha registrado la cuenta ${ name } con id: ${response.id }`);
            onCancel()
        } catch (error) {
            let msg = error instanceof Error ? error.message : 'Error al procesar la solicitud';
            sb.error(msg);
        } finally {
            setLoading(false)
        }
    }

    return <>
    <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ flexGrow: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={ Keyboard.dismiss }>
            <Surface style={{ flex: 1, gap: 10, padding: 10 }}>              
                <CustomInput
                    label='Nombre o alias de la cuenta'
                    value={ name }
                    onChangeText={ setName }
                    placeholder='Ahorros Quincena BAC'
                    />
                <CustomInput
                    label='Descripción'
                    value={ description }
                    onChangeText={ setDescription }
                    placeholder='Cuenta de ahorro bac en dolares'
                    />
                <View style={{ gap: 10 }}>
                    <Text variant='titleMedium' style={{ fontWeight: 'bold' }}>Moneda Principal</Text>
                    <View style={{ flexDirection: 'row', gap: 0, backgroundColor: theme.colors.background, borderRadius: 15, elevation: 1 }}>
                        <TouchableOpacity onPress={()=> setCurrency('NIO')}  style={[ style.buttonRow, { backgroundColor: currency === 'NIO' ? theme.colors.primary : null } ]}>
                            <Text style={{ fontWeight: 'bold', color: currency === 'NIO' ? theme.colors.onPrimary: theme.colors.onBackground }}>Córdobas</Text>
                            <Text style={{ fontWeight: 'bold', color: currency === 'NIO' ? theme.colors.inversePrimary: theme.colors.onBackground }}>{'(C$ NIO)'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={()=> setCurrency('USD')} style={[ style.buttonRow, { backgroundColor: currency === 'USD' ? theme.colors.primary : null  } ]}>
                            <Text style={{ fontWeight: 'bold', color: currency === 'USD' ? theme.colors.onPrimary: theme.colors.onBackground }}>Dólares</Text>
                            <Text style={{ fontWeight: 'bold', color: currency === 'USD' ? theme.colors.onPrimary: theme.colors.onBackground }}>{'($ USD)'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <CustomInput
                    label='Saldo Inicial Disponible'
                    value={ opening_price }
                    onChangeText={ setOpeningPrice }
                    keyboardType='numeric'
                    textAlign='left'
                    style={{ fontSize: 50 }}
                />
                <Text>
                    🔂 Tasa Oficial Estimada 1 USD ≈ 36.62 NIO
                </Text>
                <Card>
                    <Card.Title title='Distintivo de la cuenta' titleStyle={{ fontWeight: 'bold', fontSize: 20  }} />
                    <Card.Content style={{ alignItems:'center', justifyContent:'center', gap: 10 }}>
                        <View style={{ backgroundColor: toTransparentColor(color), borderRadius: 50, padding: 8 }}>
                            <Icon 
                                source={icon} 
                                color={ color }
                                size={64}
                                />
                        </View>
                        <Button icon='pencil' mode='contained' onPress={()=> setShowModal(true) }>
                            Modificar
                        </Button>
                    </Card.Content>
                </Card>
                <Button icon='plus-circle' mode='contained' onPress={onSubmitForm} disabled={loading} loading={ loading }>
                    Guardar esta cuenta
                </Button>
                <Button mode='elevated' onPress={onCancel} disabled={loading}>
                    Cancelar
                </Button>
            </Surface>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    <BottomSheet visible={ showModal } onClose={ ()=> setShowModal(false) }>
        <CategoryIconColorSelect
            icon={ icon }
            color={ color }
            onColorChange={ setColor }
            onIconChange={ setIcon }
            onDismiss={ ()=> setShowModal(false) }/>
    </BottomSheet>
    </>
}

const style= StyleSheet.create({
    buttonRow: { 
        flexDirection: 'row',
        flex:1,
        gap: 10,
        minHeight: 40,
        alignItems:'center',
        justifyContent:'center',
        padding: 10,
        borderRadius: 10
    }
})