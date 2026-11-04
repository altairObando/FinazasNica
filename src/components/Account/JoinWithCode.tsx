import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';
import { CustomInput } from '../misc/CustomInput';
export const JoinWithCode=()=>{
    const [ teamCode, setTeamCode ] = useState('');
    const [ teamPass, setTeamPass ] = useState('');
    return <View style={{ flex: 1, gap: 10 }}>
        <CustomInput 
            label='# Código del Espacio Familiar'
            extraLabel='Obligatorio'
            left='pound'
            rightComponent={ <View style={{ flexDirection: 'row', alignItems:'center', justifyContent:'center' }}>
                <Button icon='clipboard-outline' compact mode='elevated'>
                    Pegar
                </Button>
                <IconButton icon='qrcode' />
            </View> }
            value={teamCode }
            onChangeText={setTeamCode}
            placeholder='FN - 8492 - MG'
            autoCapitalize='none'
            />
        <Text variant='labelSmall'>El administrador puede encontrar este código en su Perfil Familiar.</Text>
    </View>
}