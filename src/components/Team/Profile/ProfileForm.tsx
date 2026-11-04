import { CustomInput } from '@/components/misc/CustomInput';
import React, { useState } from 'react';
import { View } from 'react-native';

export const ProfileForm=({ userEmail, userPhone } : { userEmail: string, userPhone: string})=>{
    const [ email, setEmail ] = useState(userEmail);
    const [ phone, setPhone ] = useState(userPhone);
    return <View>
        <CustomInput
            left='email'
            placeholder='nuevocorreo@dominion.xyz'
            value={ email }
            onChangeText={ setEmail }/>
        <CustomInput
            left='phone'
            placeholder='+505 1234 5678'
            value={phone}
            onChangeText={ setPhone }
            />
    </View>
}