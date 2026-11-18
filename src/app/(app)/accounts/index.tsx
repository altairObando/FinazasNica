import { SummaryCard } from '@/components/UserAccounts/SummaryCard';
import { Account } from '@/interfaces/Accounts/Account';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Card, Chip, Icon, Surface, Text, useTheme } from 'react-native-paper';
const DEFAULT_EXCHANGE_RATE = '36.62', DEFAULT_SIZE = 10;
export default function AccountsTab(){
    const router = useRouter();
    const [ total, setTotal ] = useState(0);
    const [ accounts, setAccounts ] = useState<Account[]>([]);
    const [ loading, setLoading ] = useState(true);
    const theme = useTheme();
    const onAddPress=()=>{
        router.push({
            pathname: '/(app)/accounts/[id]',
            params: {
                id: '0'
            }
        })
    }
    return <Surface style={{ flex: 1, padding: 10, gap: 8,  }}>
        <SummaryCard 
            accounts={ accounts } 
            loading={ loading } 
            tx={ Number(DEFAULT_EXCHANGE_RATE) }
            total={ total }/>
        <Card>
            <Card.Title 
                title={<Text variant='titleLarge' style={{ fontWeight: 'bold' }}>Transferir entre cuentas</Text>}
                subtitle='Transferencia interna'
                left={ props => <Icon source='swap-horizontal' size={props.size} color={theme.colors.primary} />}
                right={ () => <Chip textStyle={{ color: theme.colors.onPrimary }}>{`T.C. ${ DEFAULT_EXCHANGE_RATE }`}</Chip>}
                rightStyle={{ marginRight: 8 }}/>
            <Card.Content>
                <Button mode='contained' icon='folder-swap-outline'>
                    Realizar Transferencia Interna
                </Button>
            </Card.Content>
        </Card>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10, alignItems:'center', justifyContent:'space-between' }}>
            <View>
                <Text variant='titleLarge' style={{ fontWeight: 'bold'}}>Mis Cuentas Registradas</Text>
                <Text variant='labelMedium'>Disponiblidad en tiempo real.</Text>
            </View>
            <Button mode='contained' icon='plus' onPress={onAddPress}>
                Nueva Cuenta
            </Button>
        </View>
    </Surface>
}