import FlatListItemSkeleton from '@/components/misc/FlatListItemSkeleton';
import { useAppProvider } from '@/hooks/useAppProvider';
import { TeamMembersResponse as Members } from '@/interfaces/Profile/Team';
import { teamService } from '@/lib/teamService';
import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, Card, List, Snackbar, Surface, Text, useTheme } from 'react-native-paper';
export const Membership=()=>{
    const { user } = useAppProvider();
    const theme = useTheme();
    const [visible, setVisible] = useState(false);
    const [ loading, setLoading ] = useState(true)
    const [ members, setMembers ] = useState<Members[]>([]);
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);
    const copyTeamCode= async ()=>{
        await Clipboard.setStringAsync(user?.team_code ?? 'UNABLE-TO-COPY');
        onToggleSnackBar();
    }

    useEffect(()=>{
        if(!user) return;
        const fetchUsers = async()=>{
            if(user.team_code === '' ) return;
            try {
                const response = await teamService.getMembers({ team_code: user.team_code });
                setMembers(response);
            } catch (error) {
                Alert.alert('Error al cargar miembros', error instanceof Error ? error.message: '');
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    },[ user ])
    return <>
        <Card style={{ padding: 10 }} contentStyle={{ gap: 10 }}>
            <List.Item
            left={ props => <List.Icon                
                icon='account-group-outline'
                color={theme.colors.onPrimary }
                style={[ props.style, { backgroundColor: theme.colors.primary, padding: 8, borderRadius: 15, } ]}/>}
            title={ props => <Text {...props} style={{ fontSize: props.fontSize, fontWeight: 'bold' }}>{user?.team_name}</Text> }
            description='Espacio de finanzas compartido'
            right={props => <View style={[ props.style, { alignItems:'center', justifyContent:'center',backgroundColor: theme.colors.primary, padding: 10, borderRadius: 15 }]}>
                <Text style={{ fontWeight: 'bold', color: theme.colors.onPrimary }}>{ user?.members ?? 1 }</Text>
                <Text style={{ fontWeight:'light', color: theme.colors.onPrimary }}>Miembros Activos</Text>
            </View>}/>
            <Surface style={{ padding: 10, borderRadius: 15, gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems:'center', justifyContent:'space-between' }}>
                    <Text variant='bodyMedium' style={{ textTransform: 'uppercase', color: 'gray'  }}>Código de vincluación</Text>
                    <Text>Pin Activo</Text>
                </View>
                <View style={{ padding: 10, backgroundColor: theme.colors.background, borderRadius: 15, flexDirection: 'row', alignItems:'center', justifyContent:'space-between' }}>
                    <Text selectable={true} >{ user?.team_code ?? ''}</Text>
                    <Button icon='content-copy' mode='contained' onPress={copyTeamCode}>
                        Copiar
                    </Button>
                </View>
            </Surface>
            <Text variant='titleMedium' style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                Miembros del Hogar
            </Text>
            <View style={{ gap: 10 }}>
                {
                    loading &&  Array.from({ length: 3 }).map((_, index)=> <FlatListItemSkeleton rows={3} key={`skeleton-${index}`} />)
                }
                {
                    !loading && members.map((item, index)=> {
                        return <List.Item key={ `member-id-${ item?.id ?? index }`} style={{ backgroundColor: theme.colors.surface, borderRadius: 15 }}
                            left={props => <List.Icon 
                                    icon={'account-outline'} 
                                    color={theme.colors.primary}
                                    style={[props.style, {
                                        backgroundColor: `${theme.colors.primary}20`,
                                        padding: 8,
                                        borderRadius: 15,
                                    }]} />}
                            title={ item?.name ?? 'no name' }
                            description={ item.is_owner ? 'Administrador del grupo familiar': 'Miembro familiar' }
                            right={ props => <List.Icon icon={ item.is_owner ? 'shield-check' : 'account-cog-outline'} {...props} />}
                            />
                    })
                }
                { !loading && <Button icon='account-plus-outline' textColor={theme.colors.primary} style={{ backgroundColor: theme.colors.background }}>
                    Agregar Miembro Familiar
                </Button>
                }
            </View>
        </Card>
        <Snackbar
            style={{ position: 'absolute', bottom: 0, right: 0 }}
            visible={visible}
            onDismiss={onDismissSnackBar}
            duration={1000}
            action={{
                label: 'Cerrar',
                onPress: () => {},
            }}>
            Codigo copiado al portapales
        </Snackbar>
    </>
}