import { AccountSummary } from '@/interfaces/Accounts/Account';
import { formatCurrency } from '@/lib/format';
import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, Icon, Surface, Text, useTheme } from 'react-native-paper';
import { SkeletonPulse } from '../misc/SkeletonPulse';

export const SummaryCard= memo(function Card({ loading, accounts, tx = 36.62 }: { loading: boolean, accounts: AccountSummary[], tx: number }){
    const theme = useTheme();
    const total = useMemo(()=>{
        return accounts.filter(item => !isNaN(parseFloat(item.total)))
        .map( item => {
            const amount = parseFloat(item.total);            
            if( item.currency === 'NIO')
                return amount;
            return amount * tx;
        }).reduce((a,b) => a+b,0);
    },[ accounts ]);
    const totalUSD = total/tx;
    
    return <Surface style={[{ backgroundColor: theme.colors.primary }, style.card ]}>
        <View style={[ style.row, { justifyContent: 'space-between' } ]}>
            <View style={[ style.row ]}>
                <Icon source='bank' size={24} color={ theme.colors.inversePrimary } />
                <Text variant='titleMedium' style={{ color: theme.colors.inversePrimary }}>Patrimonio Disponible</Text>
            </View>
            <Chip textStyle={{ color: theme.dark ? theme.colors.onPrimaryContainer: theme.colors.inversePrimary }} style={{ backgroundColor: theme.colors.primaryContainer }} >
                { `${accounts.length} Cuentas`}
            </Chip>
        </View>
        {/* total  */}
        { loading && <SkeletonPulse style={{ minHeight: 14, flex: 1 }} />}
        { !loading && <Text variant='displaySmall' style={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}>{ formatCurrency({ amount: total, currency:'NIO' })}</Text>}
        {/* Equivalente */}
        <View style={ style.row }>
            <Icon source='swap-horizontal' size={23} color={ theme.colors.inversePrimary } />
            <Text style={{ color: theme.colors.inversePrimary }}>Equivalente aproximado</Text>
            { !loading && <Text style={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}>{ formatCurrency({ amount: totalUSD, currency: 'USD' }) }</Text>}
            { loading && <SkeletonPulse style={{ minHeight: 14, minWidth: 100 }} />}
        </View>
    </Surface>
});

const style= StyleSheet.create({
    card:{
        width: '100%',
        padding: 15,
        minHeight: 140,
        borderRadius: 15,
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    }
})