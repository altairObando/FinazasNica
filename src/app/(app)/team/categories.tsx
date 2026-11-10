import FlatListItemSkeleton from '@/components/misc/FlatListItemSkeleton';
import { Category } from '@/interfaces/Categories/Category';
import { CategorySummary } from '@/interfaces/Categories/CategorySummary';
import { categoryService } from '@/lib/categoryService';
import { toTransparentColor } from '@/lib/format';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { Card, Divider, Icon, List, MD2Colors, Searchbar, SegmentedButtons, Surface, Text, useTheme } from 'react-native-paper';

const DEFAULT_ITEMS = 10;
type CategoryType = 'IN' | 'OUT';
export default function CategoriesScreen() {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryCount, setCount] = useState(0);
    const theme = useTheme();
    const params = useLocalSearchParams();
    const summaryParam = params?.summary;
    const [ categoryType, setType ] = useState<CategoryType>('OUT');
    const summary = JSON.parse(
        Array.isArray(summaryParam) ? summaryParam[0] ?? '{}' : summaryParam ?? '{}'
    ) as CategorySummary;
    
    const fetchCategories = useCallback(async (pageToFetch: number, isInitial: boolean, categoryType: CategoryType ) => {
        if (isInitial) setLoading(true);
        else setFetchingMore(true);
        try {
            const response = await categoryService.get({ page: pageToFetch, size: DEFAULT_ITEMS, type: categoryType });            
            if (isInitial) {
                setCategories(response.items);
            } else {
                setCategories(prev => [...prev, ...response.items]);
            }
            setCount(response.count);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setFetchingMore(false);
        }
    }, []);

    // Carga inicial
    useEffect(() => {
        fetchCategories(0, true, categoryType);
    }, [fetchCategories, categoryType]);

    // Carga de páginas siguientes
    useEffect(() => {
        if (page > 0) {
            fetchCategories(page, false, categoryType);
        }
    }, [page, fetchCategories]);

    const handleLoadMore = () => {
        if (fetchingMore || loading) return;        
        const hasMore = categoryCount > categories.length;
        if (hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const keyExtractor = (item: unknown, index: number): string => {
        if (loading || !item) {
            return `Skeleton-${index}`;
        }
        const category = item as Category;
        return `team-${category.team}::code-${category.name}::idx-${index}`;
    };

    const renderItem = ({ item }: { item: unknown }): React.ReactElement => {
        if (loading || !item) return <FlatListItemSkeleton showAvatar={true} />;
        const category = item as Category;
        
        return (
            <List.Item
                left={props => (
                    <List.Icon 
                        icon={category.icon}
                        color={category?.color ?? props.color}
                        style={[
                            props.style,
                            styles.leftIcon,
                            { backgroundColor: toTransparentColor(category.color) }
                        ]}
                    />
                )}
                title={category.name}
                description={category.description}
                right={ props => (
                    <List.Icon
                        icon='chevron-right'
                        style={[ props.style, styles.leftIcon ]}
                        color={ theme.colors.primary }/>
                )}
            />
        );
    };
    const renderFooter = () => {
        return (
            <View style={styles.footerContainer}>
                {fetchingMore && (
                    <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginBottom: 10 }} />
                )}
                <Text style={styles.footerText}>
                    {`Mostrando ${categories.length} de ${categoryCount}`}
                </Text>
            </View>
        );
    };

    return (
        <Surface style={styles.container}>
            {
                summary && (
                <View style={{flexDirection: 'row', gap: 8 }}>
                    <Card style={ [styles.container, { minHeight: 180 }] }>
                        <Card.Title title='Catálogo Total' right={ props => <Icon source={'folder'} {...props} color={theme.colors.primary} /> } />
                        <Card.Content>
                            <View style={[styles.horizontalRow ]}>
                                <Icon source='circle-small' color={MD2Colors.red800} size={24} />
                                <Text>{'Activas'}</Text>
                            </View>
                            <Text>Listas para clasificar</Text>
                        </Card.Content>
                    </Card>
                    <Card style={ [styles.container, { minHeight: 180 }] }>
                        <Card.Title title='Distribución' right={ props => <Icon source={'chart-arc'} {...props} color={theme.colors.primary} /> } />
                        <Card.Content>
                            <View style={[styles.horizontalRow  ]}>
                                <Icon source='circle-small' color={MD2Colors.red800} size={32} />
                                <View>
                                    <Text>{summary.expense}</Text>
                                    <Text>Gastos</Text>
                                </View>                                
                            </View>
                            <View style={[styles.horizontalRow ]}>
                                <Icon source='circle-small' color={MD2Colors.green800} size={32} />
                                <View>
                                    <Text>{summary.income}</Text>
                                    <Text>Ingresos</Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                </View>
                )
            }
            <Searchbar 
                value={search} 
                onChangeText={setSearch}
                placeholder='Buscar por nombre'
            />
            <SegmentedButtons 
                value={ categoryType }
                onValueChange={ value => setType(value)}
                buttons={[
                    { 
                        value: 'OUT',
                        label: 'Gastos',
                        icon:'arrow-down-thin',
                        checkedColor: categoryType !== 'OUT' ? theme.colors.primary : theme.colors.onPrimary,
                        style:{ 
                            backgroundColor: categoryType !== 'OUT' ? theme.colors.background: theme.colors.primary
                        }
                    },
                    { 
                        value: 'IN',
                        label: 'Ingresos',
                        icon:'arrow-up-thin',
                        checkedColor: categoryType !== 'IN' ? theme.colors.primary : theme.colors.onPrimary,
                        style:{ 
                            backgroundColor: categoryType !== 'IN' ? theme.colors.background: theme.colors.primary
                        }
                    },
                ]}
                density='small'
            />
            <FlatList
                data={loading ? Array.from({ length: DEFAULT_ITEMS }) : categories.filter(item => item.type === categoryType )}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                contentContainerStyle={[styles.listStyle, { backgroundColor: theme.colors.background }]}
                ListFooterComponent={renderFooter}
                ItemSeparatorComponent={<Divider />}
                maxToRenderPerBatch={DEFAULT_ITEMS}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
            />
        </Surface>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 10,
        gap: 10,
    },
    leftIcon: {
        borderRadius: 15,
        padding: 10,
    },
    listStyle: {
        padding: 10,
        borderRadius: 15,
        flexGrow: 1
    },
    footerContainer: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    footerText: {
        alignSelf: 'flex-end',
        opacity: 0.6
    },
    horizontalRow:{ 
        flexDirection: 'row', 
        alignItems:'center',
        justifyContent:'flex-start', 
        gap:8 
    }
});
