import { CategorySummary } from '@/interfaces/Categories/CategorySummary';
import { toTransparentColor } from '@/lib/format';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, List, MD2Colors, Surface, Text, useTheme } from 'react-native-paper';

type SummaryHeaderProps = {
    summary: CategorySummary
}

const SummaryHeaderComponent:React.FC<SummaryHeaderProps>=({ summary })=>{
    const theme = useTheme();
    const iconStyle = useMemo(()=>{
        return {
            backgroundColor: toTransparentColor(theme.colors.primary),
            padding: 10,
            borderRadius: 20
        }
    },[ theme ])

    return <View style={{ gap: 10 }}>
        <Surface style={{ borderRadius: 15, }}>
                <List.Item 
                    right={ props =>
                        <List.Icon 
                            icon='folder'
                            color={ theme.colors.primary }
                            style={[ 
                                props.style, 
                                iconStyle
                            ]}/> }
                    title={`Listas para clasififcar` }
                    description={`${ summary.total } Categorias` }
                    />
            </Surface>
            <Surface style={{ borderRadius: 15, }}>
                <List.Item 
                    
                    title='Distribuciòn'
                    description={ props => (<>
                        <View style={[styles.horizontalRow  ]}>
                            <Icon source='circle-small' color={MD2Colors.red800} size={32} />
                            <Text>{summary.expense}</Text>
                            <Text>Gastos</Text>
                        </View>
                        <View style={[styles.horizontalRow ]}>
                            <Icon source='circle-small' color={MD2Colors.green800} size={32} />
                            <Text>{summary.income}</Text>
                            <Text>Ingresos</Text>
                        </View>
                        </>
                    )}
                    right={ props =>
                        <List.Icon 
                            icon='chart-arc'
                            color={ theme.colors.primary }
                            style={[ 
                                props.style,
                                iconStyle,
                            ]}/> }
                />
            </Surface>  
    </View>
}

export const SummaryHeader = React.memo(SummaryHeaderComponent);

const styles = StyleSheet.create({
    horizontalRow:{ 
        flexDirection: 'row', 
        alignItems:'center',
        justifyContent:'flex-start', 
        gap:8 
    }
});