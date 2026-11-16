import { CategoryListItem } from '@/components/Categories/CategoryListItem';
import { SummaryHeader } from '@/components/Categories/SummaryHeader';
import FlatListItemSkeleton from '@/components/misc/FlatListItemSkeleton';
import { Category, CategoryType } from '@/interfaces/Categories/Category';
import { CategorySummary } from '@/interfaces/Categories/CategorySummary';
import { categoryService } from '@/lib/categoryService';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { Divider, Searchbar, SegmentedButtons, Surface, Text, useTheme } from 'react-native-paper';

const DEFAULT_ITEMS = 10;
export default function CategoriesScreen() {
    const router = useRouter();
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
    const summary = useMemo(() => JSON.parse(
        Array.isArray(summaryParam) ? summaryParam[0] ?? '{}' : summaryParam ?? '{}'
    ) as CategorySummary, [summaryParam]);

    const onCategoryPress = useCallback((id: number) => router.push({ pathname: '/(app)/team/categories/[id]', params:{ id: String(id)}}), [router]);

    const onTypeChange = useCallback((value: string) => {
        setPage(0);
        setType(value as CategoryType);
    }, []);

    const fetchCategories = useCallback(async (pageToFetch: number, isInitial: boolean, categoryType: CategoryType ) => {
        if (isInitial) {
            setPage(0);
            setLoading(true);
        } else {
            setFetchingMore(true);
        }
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

    // Carga inicial y recarga al volver a la pantalla (p. ej. tras guardar una categoría)
    useFocusEffect(useCallback(() => {
        fetchCategories(0, true, categoryType);
    }, [fetchCategories, categoryType]));

    // Carga de páginas siguientes
    useEffect(() => {
        if (page > 0) {
            fetchCategories(page, false, categoryType);
        }
    }, [page, fetchCategories]);

    const handleLoadMore = useCallback(() => {
        if (fetchingMore || loading) return;
        const hasMore = categoryCount > categories.length;
        if (hasMore) {
            setPage(prev => prev + 1);
        }
    }, [fetchingMore, loading, categoryCount, categories.length]);

    const visibleCategories = useMemo(() => {
        const term = search.toLocaleLowerCase().trim();
        return categories.filter(item =>
            item.type === categoryType &&
            (!term || item.name.toLocaleLowerCase().includes(term))
        );
    }, [categories, categoryType, search]);

    const listData = useMemo<(Category | undefined)[]>(
        () => loading ? Array.from({ length: DEFAULT_ITEMS }, () => undefined) : visibleCategories,
        [loading, visibleCategories]
    );

    const keyExtractor = useCallback((item: Category | undefined, index: number): string => {
        if (!item) return `Skeleton-${index}`;
        return `category-${item.id}`;
    }, []);

    const renderItem = useCallback(({ item }: { item: Category | undefined }): React.ReactElement => {
        if (!item) return <FlatListItemSkeleton showAvatar={true} />;
        return <CategoryListItem category={item} onPress={onCategoryPress} />;
    }, [onCategoryPress]);

    const renderFooter = useCallback(() => {
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
    }, [fetchingMore, categories.length, categoryCount, theme.colors.primary]);

    const categoryButtons = useMemo(() => [
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
    ], [categoryType, theme.colors.primary, theme.colors.onPrimary, theme.colors.background]);

    const listContentStyle = useMemo(
        () => [styles.listStyle, { backgroundColor: theme.colors.background }],
        [theme.colors.background]
    );

    return (
        <Surface style={styles.container}>
            <SummaryHeader summary={ summary } />
            <Searchbar 
                value={search} 
                onChangeText={setSearch}
                placeholder='Buscar por nombre'
            />
            <SegmentedButtons 
                value={ categoryType }
                onValueChange={ onTypeChange }
                buttons={categoryButtons}
                density='small'
            />
            <FlatList
                data={listData}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                contentContainerStyle={listContentStyle}
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
