import { CustomInput } from '@/components/misc/CustomInput';
import { NewTeamRequest, TeamForm } from '@/interfaces/Profile/Team';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Button, Divider, ProgressBar, Text, useTheme } from 'react-native-paper';


export const NewTeamForm=({ onSubmit, parentLoading }: TeamForm )=>{
    const theme = useTheme();
    const [ name, setName ] = useState('');
    const [ surname, setSurname ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ teamName, setTeamName ] = useState('');
    const [ teamPass, setTeamPass ] = useState('');
    const [ isSecure, setIsSecure ] = useState(true);

    const strength = useMemo(() : number =>{
        if( !teamPass || teamPass.length === 0) return 0;
        let value = 0;
        if( teamPass.length >= 8 ) value += 0.1;
        if( [ '@','!','#','$','%','^','*','.','-' ].some( key => teamPass.includes(key)))
            value += 0.3;
        if( String(teamPass).toUpperCase().split('').some( (char, index) => teamPass[index] === char  )){
            value += 0.3;
        }
        if( String(teamPass).split('').some((item : string) => !isNaN(parseInt(item))))
            value += 0.3;
        return value;
    },[ teamPass ])

    const validate=()=>{
        //TODO: Agrgar validaciones de textos
        const dto = {
            name: name,
            surname: surname,
            email: email,
            phone: phone,
            teamName: teamName,
            teamDescription: '',
            teamSecret: teamPass,
        } as NewTeamRequest;
        if ( typeof onSubmit === 'function' )
            onSubmit(dto);
    }

    return <>
        {/* Title */}
        <View style={{ flexDirection: 'row', alignItems:'center', justifyContent:'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems:'center', gap: 10 }}>
                <View style={{ padding: 10, backgroundColor:`${ theme.colors.primary}20`, borderRadius: 15 }}>
                    <FontAwesome name='home' size={24} color={theme.colors.primary} />
                </View>
                <Text variant='titleMedium'>Nuevo Hogar</Text>
            </View>
            <Text style={{ backgroundColor: theme.colors.tertiary, padding: 10, borderRadius: 15, color: theme.colors.onTertiary, fontWeight: 'bold' }}>Recomendado</Text>
        </View>
        {/* Description/form */}
        <Text variant='titleMedium'>Ideal si eres el administrador principal del hogar o quien gestionará los presupuestos centrales.</Text>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', }}>
            <MaterialCommunityIcons name='card-account-details' color={theme.colors.primary} size={32} />
            <Text variant='titleLarge'>Datos del Titular / Administrador</Text>
        </View>

        <CustomInput
            label='Nombres del titular'
            value={name}
            onChangeText={ setName }
            left='account'
            placeholder='MARLEN GUISSELL' />
        <CustomInput
            label='Apellidos del titular'
            value={surname}
            onChangeText={ setSurname }
            left='account'
            placeholder='ALEMAN BONILLA' />
        <CustomInput
            label='Correo Electrónico'
            value={email}
            onChangeText={ setEmail }
            inputMode='email'
            keyboardType='email-address'
            left='email'
            placeholder='email@dominio.xyz' />
        <CustomInput
            label='Número Celular Nicaragüense *'
            value={phone}
            onChangeText={ setPhone }
            inputMode='tel'
            keyboardType='phone-pad'
            left='phone'
            placeholder='1234-5678' />
        
        <Divider />
        <Text>Este nombre identificará los presupuestos y recibos compartidos.</Text>
        <CustomInput
            label='Nombre del espacio familiar'
            left='account-supervisor-outline'
            placeholder={'Familia Obando Aleman'}
            value={teamName}
            onChangeText={text => setTeamName(text) }/>
        <View style={{ gap: 8 }}>
            <CustomInput
                label='Contraseña Maestra del hogar'
                left='key'
                value={teamPass}
                onChangeText={ setTeamPass }
                secureTextEntry={isSecure}
                placeholder='XLR9-894-1AFSD'
                right={ isSecure ? 'eye': 'eye-off' }
                onRightPress={ ()=> setIsSecure( prev => !prev) }/>
            <Text variant='labelSmall'>Fortaleza de la contraseña</Text>
            <ProgressBar progress={strength} />
        </View>
        <Button 
            mode='contained' 
            loading={ parentLoading } 
            disabled={ parentLoading }
            onPress={ validate }>
            Solicitar
        </Button>
    </>
}