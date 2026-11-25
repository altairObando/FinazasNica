import FlatListItemSkeleton from '@/components/misc/FlatListItemSkeleton';
import { SummaryCard } from '@/components/UserAccounts/SummaryCard';
import { useAppProvider } from '@/hooks/useAppProvider';
import { Account, AccountSummary } from '@/interfaces/Accounts/Account';
import { accountService } from '@/lib/accountService';
import { formatCurrency, toTransparentColor } from '@/lib/format';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Platform, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, Icon, IconButton, Surface, Text, useTheme } from 'react-native-paper';
import { VariantProp } from 'react-native-paper/lib/typescript/components/Typography/types';
const DEFAULT_EXCHANGE_RATE = '36.62', DEFAULT_SIZE = 10;
export default function AccountsTab(){
    const router = useRouter();
    const { user, getExchange } = useAppProvider();
    const [ page, setPage ] = useState(0);
    const [ total, setTotal ] = useState(0);
    const [ accounts, setAccounts ] = useState<Account[]>([]);
    const [ loading, setLoading ] = useState(false);
    const [ loadingMore, setLoadingMore ] = useState(false);
    const [ summary, setSummary ] = useState<AccountSummary[]>([]);
    const theme = useTheme();
    const onAddPress=()=>{
        router.push({
            pathname: '/(app)/accounts/[id]',
            params: {
                id: '0'
            }
        })
    }
    const fetchItems = useCallback(async function( page: number){
        try {
            if( loading || loadingMore ) return;
            if( page > 0 ) setLoadingMore(true)
            else setLoading(true);

            const teamId = user?.team_id ?? 0;
            const response = await accountService.get({ page: page, size: DEFAULT_SIZE, team_id: teamId });
            setTotal(response.count);
            if( page === 0)
                setAccounts(response.items)
            else
                setAccounts(pre => [ ...pre, ...response.items ]);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    },[]);
    const usdRate = getExchange('USD');
    const renderItem = ({ item }: { item: unknown }): React.ReactNode=> {
        if( loading ) return <Card><FlatListItemSkeleton rows={3} showAvatar={true} /></Card>
        try {
            const account = item as Account;
            const local = account.currency === 'NIO' ? account.balance : account.balance * usdRate,
                  foreign = local / usdRate;
            return <Card onPress={()=> router.push({ pathname: '/(app)/accounts/[id]', params:{ id: account.id }})}>
                <Card.Title
                    left={ props => <Icon source={ account.icon } size={props.size} color={ account.color } /> }
                    title={ <Text variant='titleMedium'>{account.name.trim()}</Text> }
                    subtitle={ account.description.trim() }
                    right={ props => <IconButton 
                        icon='folder-edit-outline' 
                        size={props.size} 
                        iconColor={account.color}
                        containerColor={toTransparentColor(account.color)}/>}
                    />
                <Card.Content>
                    <Text variant='titleMedium' style={{ fontWeight: 'bold' }}>Saldo Disponible</Text>
                    <Text variant='headlineMedium' style={{ fontWeight: 'bold' }}>{ formatCurrency({ amount: local, currency:'NIO' }) }</Text>
                    <Text>{`≈ ${ formatCurrency({ amount: foreign, currency:'USD' }) } USD`}</Text>
                </Card.Content>
                <Card.Actions>
                    <Button icon='invoice-list-outline'>Movimientos</Button>
                </Card.Actions>
            </Card>
        } catch (error) {
            return null;
        }
    }
    const keyExtractor=(item: unknown, index: number) => {
        if( loading ) return `account-loading-${index}`;
        const account = item as Account;
        return String(account.id)
    }
    const titleVariant = Platform.select({
        'android': 'titleSmall',
        'ios': 'titleLarge'
    }) as VariantProp<string>
    // Carga inicial
    useFocusEffect(useCallback(()=>{
        fetchItems(0);
        accountService.summary({ teamId: user?.team_id ?? 0 })
        .then( response => setSummary(response || []));
    },[user]));
    // Carga de paginas
    useEffect(()=>{
        if( page > 0 ) fetchItems(page)
    },[ page, fetchItems ]);

    const handleLoadMore = useCallback(()=>{
        if( loading || loadingMore ) return;
        if( total > accounts.length )
            setPage( prev => prev + 1);
    },[ loading, loadingMore, total, accounts.length]);

    const renderFooter = useCallback(() => {
        return (
            <View style={{ paddingVertical: 10, alignItems: 'center' }}>
                {loadingMore && (
                    <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginBottom: 10 }} />
                )}
                <Text style={{ alignSelf: 'flex-end', opacity: 0.6 }}>
                    {`Mostrando ${accounts.length} de ${total}`}
                </Text>
            </View>
        );
    }, [loadingMore, accounts.length, total, theme.colors.primary]);

    return <Surface style={{ flex: 1, padding: 10, gap: 8,  }}>
        <SummaryCard 
            accounts={ summary } 
            loading={ loading } 
            tx={ usdRate }/>
        <Card>
            <Card.Title 
                title={<Text variant={titleVariant} style={{ fontWeight: 'bold' }}>Transferir entre cuentas</Text>}
                subtitle='Transferencia interna'
                left={ props => <Icon source='swap-horizontal' size={props.size} color={theme.colors.primary} />}
                right={ () => <Chip textStyle={{ color: theme.colors.onPrimary }}>{`T.C. ${ usdRate.toFixed(2) }`}</Chip>}
                rightStyle={{ marginRight: 8 }}/>
            <Card.Content>
                <Button mode='contained' icon='folder-swap-outline'>
                    Realizar Transferencia Interna
                </Button>
            </Card.Content>
        </Card>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10, alignItems:'center', justifyContent:'space-between' }}>
            <View>
                <Text variant={titleVariant} style={{ fontWeight: 'bold'}}>Mis Cuentas Registradas</Text>
                <Text variant='labelMedium'>Disponiblidad en tiempo real.</Text>
            </View>
            <Button mode='contained' icon='plus' onPress={onAddPress} compact>
                Nueva Cuenta
            </Button>
        </View>
        <FlatList
            keyExtractor={ keyExtractor }
            data={ loading ? Array.from({ length: 10 }) : accounts }
            renderItem={ renderItem }
            contentContainerStyle={{ gap: 10, padding: 8 }}
            maxToRenderPerBatch={ DEFAULT_SIZE }
            onEndReachedThreshold={0.5}
            onEndReached={handleLoadMore}
            ListFooterComponent={renderFooter} />
    </Surface>
}