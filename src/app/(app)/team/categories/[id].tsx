import { CategoryIconColorSelect } from '@/components/Categories/CategoryIconColorSelect';
import { BottomSheet } from '@/components/misc/BottomSheet';
import { CustomInput } from '@/components/misc/CustomInput';
import FlatListItemSkeleton from '@/components/misc/FlatListItemSkeleton';
import { categoryService } from '@/lib/categoryService';
import { toTransparentColor } from '@/lib/format';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, IconButton, List, MD2Colors, SegmentedButtons, Surface, Text, useTheme } from 'react-native-paper';
import { CategoryType } from '.';

export default function CategoryForm(){
    const params = useLocalSearchParams();
    const theme = useTheme();
    const [ loading, setLoading ] = useState(true);
    const [ name, setName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ icon, setIcon ] = useState<string>('wallet');
    const [ color, setColor ] = useState<string>( theme.colors.primary );
    const [ showModal, setShowModal ] = useState(false);
    const [ modalMounted, setModalMounted ] = useState(false);
    const id = typeof params === 'object' && Object.keys(params).includes('id') ? 
               parseInt(Array.isArray(params.id) ? params.id[0]: params.id, 10) : 0;
    const [ categoryType, setCategoryType ] = useState<CategoryType>('IN');
    const openModal = useCallback(()=>{
        setModalMounted(true);
        setShowModal(true);
    },[]);
    const closeModal = useCallback(()=> setShowModal(false),[]);
    const categoryButtons = useMemo(()=>{
        return [
                { 
                    value: 'OUT',
                    label: 'Gasto Cotidiano',
                    icon:'arrow-down-thin',
                    checkedColor: categoryType !== 'OUT' ? theme.colors.primary : theme.colors.onPrimary,
                    style:{ 
                        backgroundColor: categoryType !== 'OUT' ? theme.colors.background: theme.colors.primary
                    }
                },
                { 
                    value: 'IN',
                    label: 'Fuente de Ingresos',
                    icon:'arrow-up-thin',
                    checkedColor: categoryType !== 'IN' ? theme.colors.primary : theme.colors.onPrimary,
                    style:{ 
                        backgroundColor: categoryType !== 'IN' ? theme.colors.background: theme.colors.primary
                    }
                },
            ]
    },[categoryType]);
    const iconColor = categoryType === 'IN' ? theme.colors.primary : MD2Colors.red800;
    useEffect(()=>{
        if( id === 0) {
            setLoading(false)
        } else {
            categoryService.getById( id ).then( response => {
                setColor(response.color);
                setCategoryType(response.type as CategoryType );
                setIcon(response.icon);
                setName(response.name);
                setDescription(response.description);                
            }).finally(()=> setLoading(false));
        }
    },[id])
    if ( loading ) return <Surface style={{ flex: 1 }}>
        <FlatListItemSkeleton
            showAvatar={ false }
            rows={25}/>
    </Surface>
    return <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <Surface style={[ styles.container ]}>
            <Card>
                <Card.Title 
                    title={ id === 0 ? 'Nueva Categoria': 'Editando Categoria' }
                    titleStyle={{ 
                        textTransform: 'uppercase',
                        color: theme.colors.primary,
                        fontWeight: 'bold'
                    }}
                    right={ props => <IconButton 
                        icon={ 'package-variant-closed-plus' } 
                        size={props.size}
                        iconColor={ theme.colors.onPrimary }
                        containerColor={ iconColor }  />}/>
                <Card.Content>
                    <SegmentedButtons 
                        value={categoryType} 
                        onValueChange={ value => setCategoryType(value as CategoryType)}
                        buttons={categoryButtons}
                    density='small'/>
                </Card.Content>
            </Card>
            <Surface style={ styles.borderedContainer }>
                <CustomInput
                    value={name}
                    onChangeText={ setName }
                    label='Nombre de la Categoría'
                    placeholder='Supermercado & Abarrotes'
                    left='text-box-edit-outline'
                    leftColor={ theme.colors.primary }/>
                <CustomInput 
                    value={description}
                    onChangeText={ setDescription }
                    label='Descripcion de la Categoría'
                    left='store-edit-outline'
                    placeholder='La Colonia, Maxi Palí, Palí, Mercado Oriental, pulperías de barrio'
                    leftColor={ theme.colors.primary }/>
                <Text>
                    Se utiliza para clasificar transacciones automáticas escaneadas.
                </Text>
            </Surface>
            <Surface style={ styles.borderedContainer }>
                <List.Item
                    title={ props => <Text {...props} style={{ fontWeight: 'bold', fontSize: props.fontSize }} >Identidad Visual</Text>}
                    description='Ícono y color para clasificar y organizar transacciones'
                    right={ props => <List.Icon {...props} icon='creation-outline' color={theme.colors.primary} />}/>
                <View style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <IconButton
                        icon={ icon }
                        iconColor={ color }
                        size={64}
                        containerColor={ toTransparentColor(color)}
                        onPress={openModal}/>
                    <Text variant='labelSmall'>Presiona para modificar</Text>
                </View>
                
            </Surface>
            <Button icon='content-save' mode='contained'>
                Guardar
            </Button>
        </Surface>
        {modalMounted && <BottomSheet visible={ showModal } onClose={ closeModal }>
            <CategoryIconColorSelect
                icon={ icon }
                color={ color }
                onColorChange={ setColor }
                onIconChange={ setIcon }
                onDismiss={ closeModal }/>
        </BottomSheet>}
    </ScrollView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        gap: 10,
    },
    borderedContainer: {
        borderRadius: 15, 
        padding: 10,
    },
    skeletonHeader: {

    }
})