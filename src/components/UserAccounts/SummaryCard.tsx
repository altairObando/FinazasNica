import { Account } from '@/interfaces/Accounts/Account';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, Icon, Surface, Text, useTheme } from 'react-native-paper';

export const SummaryCard= memo(function Card({ loading, accounts, total = 0, tx = 36.62 }: { loading: boolean, accounts: Account[], total: number, tx: number }){
    const theme = useTheme();
    return <Surface style={[{ backgroundColor: theme.colors.primary }, style.card ]}>
        <View style={[ style.row, { justifyContent: 'space-between' } ]}>
            <View style={[ style.row ]}>
                <Icon source='bank' size={24} color={ theme.colors.inversePrimary } />
                <Text variant='titleMedium' style={{ color: theme.colors.inversePrimary }}>Patrimonio Disponible</Text>
            </View>
            <Chip textStyle={{ color: theme.colors.inversePrimary }} style={{ backgroundColor: theme.colors.primaryContainer }} >
                { `${total} Cuentas`}
            </Chip>
        </View>
        {/* total  */}
        <Text variant='displaySmall' style={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}>C$ 79,377.00</Text>
        {/* Equivalente */}
        <View style={ style.row }>
            <Icon source='swap-horizontal' size={23} color={ theme.colors.inversePrimary } />
            <Text style={{ color: theme.colors.inversePrimary }}>Equivalente aproximado</Text>
            <Text style={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}>$ 2,167.58</Text>
        </View>
    </Surface>
});

const style= StyleSheet.create({
    card:{
        width: '100%',
        padding: 15,
        minHeight: 140,
        borderRadius: 15,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    }
})