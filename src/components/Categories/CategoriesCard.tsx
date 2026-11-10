import { useAppProvider } from '@/hooks/useAppProvider';
import { Category } from '@/interfaces/Categories/Category';
import { CategorySummary } from '@/interfaces/Categories/CategorySummary';
import { categoryService } from '@/lib/categoryService';
import { toTransparentColor } from '@/lib/format';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Card, Icon, IconButton, List, Text, useTheme } from 'react-native-paper';
import FlatListItemSkeleton from '../misc/FlatListItemSkeleton';

const CategorySkeleton=()=>(
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <FlatListItemSkeleton rows={2} style={{ minWidth: '50%' }}/>
        <FlatListItemSkeleton rows={2} style={{ minWidth: '50%' }}/>
        <FlatListItemSkeleton rows={2} style={{ minWidth: '50%' }}/>
        <FlatListItemSkeleton rows={2} style={{ minWidth: '50%' }}/>
    </View>
)

export const CategoriesCard=({ onCategoriesPress }: { onCategoriesPress: ({summary}: {summary: string}) => void } )=>{
    const theme = useTheme();
    const { user } = useAppProvider();
    const [ summary, setSummary ] = useState<CategorySummary>({ total: 0, income: 0, expense: 0, items: [] } as CategorySummary);
    const [ loading, setLoading ] = useState(true);
    const descriptionText = !loading && (summary?.items?? []).length > 0 ? `${ summary.total } Categorias (${ summary.income } Ingresos / ${ summary.expense } Gastos)`: '';
    const fetchCategories=()=>{
        if(!user) return;
        categoryService.summary(user?.team_code)
            .then( response => setSummary(response))
            .catch( err => console.log(err))
            .finally(()=> setLoading(false))
    }
    useEffect(()=>{
        fetchCategories()
    },[ user ])
    return <Card>
        <Card.Title 
            title='Categorias'
            titleVariant='titleMedium'
            titleStyle={{ fontWeight: 'bold' }}
            left={() => <Icon source='shape-plus' size={24} color={ theme.colors.primary } />}
            right={()=> <IconButton icon='refresh' size={24} onPress={fetchCategories} />}
            rightStyle={{ padding: 10 }}
            subtitle={descriptionText}/>
        <Card.Content style={{ gap: 10 }}>
            { loading && <CategorySkeleton /> }
            { !loading && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {
                        summary.items.map((item: Category)=> {
                            const color = String(item.color).length > 0 ? item.color : theme.colors.primary;
                            const backgroundColor = toTransparentColor(color);
                            return <View style={{ maxWidth: '50%' }} key={`category-item-${ item.id }`} >
                                    <List.Item
                                    key={`category-item-${ item.id }`}
                                    left={props=> <List.Icon 
                                        icon={item.icon} 
                                        style={[ props.style, { backgroundColor, padding: 10, borderRadius: 20 } ]} 
                                        color={ color } />} 
                                    title={props=> <Text {...props} style={{ fontWeight: 'bold', fontSize:props.fontSize }}>{item.name}</Text>}
                                    description={item.description} />
                            </View>
                        })
                            
                    }
                </View>
            )}
            { !loading && <Button icon='tune-variant' mode='contained' onPress={()=>{
                onCategoriesPress({ summary: JSON.stringify(summary)});
            }}>
                Personalizar Categorias
            </Button>}
        </Card.Content>
    </Card>
}