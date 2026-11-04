import { CustomInput } from '@/components/misc/CustomInput';
import { useAppProvider } from '@/hooks/useAppProvider';
import { LoginRequest, User } from '@/interfaces/Auth';
import { authService } from '@/lib/authService';
import { setValue } from '@/lib/secureStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, Icon, ProgressBar, Surface, Switch, Text, useTheme } from 'react-native-paper';


export default function LoginScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { setUser, setIsLoggedIn } = useAppProvider();
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ remember, setRemember ] = useState(true);
    const [ show, setShow ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const onLogingRequest = async()=>{
        try {
            if( loading ) return;
            if(!username) throw new Error('Nombre de usuario obligatorio');
            if(!password) throw new Error('Contraseña obligatoria');
            setLoading(true);
            const request : LoginRequest = { username, password };
            const response = await authService.login(request);
            if(!response) throw new Error('Error al iniciar sesion, contacte con su proveedor');
            const user: User = await authService.me();
            if( remember ) await setValue('remember', '1' );
            setUser(user);
            if( user.team_code && user.team_name ){
                setIsLoggedIn(true);
                return;
            }
            // Go to account selection.
            router.push({
                pathname: '/account'
            });
            
        } catch (error) {
            let message = error instanceof Error ? error.message :  String(error);
            Alert.alert('Login Error', message);
        } finally {
            setLoading(false)
        }
    }
    return (
        <Surface style={{ flex: 1, padding: 20, gap: 10 }}>
            <ProgressBar indeterminate={true} visible={ loading }  />
            {/* Security chip */}
            <View style={{ alignItems:'center', justifyContent:'center', flexDirection: 'row', gap: 5, backgroundColor: `${theme.colors.primary}25`, padding: 10, borderRadius: 15, maxWidth: 180, overflow: 'hidden' }}>
                <Icon source='lock-outline' size={20} color={theme.colors.primary}/>
                <Text variant='labelSmall' style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                    Acceso Seguro Hogar
                </Text>
            </View>
            <Text variant='titleMedium' style={{ fontWeight: 'bold' }}>Bienvenido</Text>
            <Text variant='bodyLarge'>Gestiona el presupuesto de tu hogar con tranquilidad. </Text>
            <CustomInput 
                label='Correo electrónico o Teléfono (+505)'
                extraLabel='Nicaragua'
                placeholder='ejemplo@correo.com / 123456789'
                left='email-outline'
                value={ username }
                onChangeText={ newValue => setUsername(newValue)} 
                keyboardType='email-address'
                autoCapitalize='none'/>
            <CustomInput
                label='Contraseña' 
                placeholder='Ingresa tu contraseña'
                // Icono Izquierda
                left='lock-outline'
                right={ !show ? 'eye-outline' : 'eye-off-outline'}
                onRightPress={ ()=> setShow( prev => !prev) }
                secureTextEntry={!show}
                onChangeText={ newValue => setPassword(newValue)}
                autoCapitalize='none'/>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Switch value={remember} onValueChange={ value => setRemember(value)} />
                    <Text>Recordarme</Text>
                </View>
                <Button mode='text' textColor={ theme.colors.primary } disabled={loading}>
                    ¿Olvidaste tu contraseña?
                </Button>

            </View>
            <Button mode='contained' icon='lock' disabled={loading} onPress={onLogingRequest}>
                Iniciar Sesión
            </Button>
            <Button mode='text' disabled={loading} loading={ loading }>
                Registrarse
            </Button>
            
        </Surface>
    );
}
