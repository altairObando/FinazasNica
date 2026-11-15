import { toTransparentColor } from '@/lib/format';
import { ICON_KEYWORDS } from '@/lib/util';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, IconButton, Searchbar, useTheme } from 'react-native-paper';
import ColorPicker, { ColorFormatsObject, HueSlider, Panel1, Swatches } from 'reanimated-color-picker';

type CategoryIconColorSelectProps = {
    icon: string,
    onIconChange: ( newIcon: string) => void,
    color: string,
    onColorChange: (newColor: string)=> void,
    onDismiss: ()=> void,
}
type CategoryIconColorStep = 'ICON' | 'COLOR';
const NUM_COLUMNS = 6;
const CategoryIconColorSelectComponent:React.FC<CategoryIconColorSelectProps>=({ icon, onIconChange, color, onColorChange, onDismiss })=>{
    const theme = useTheme();
    const [ searchValue, setSearchValue ] = useState('');
    const [ step, setStep ] = useState<CategoryIconColorStep>('ICON');
    
    const icons = useMemo(()=>{
        if( !searchValue || searchValue === '' ) return Object.keys(ICON_KEYWORDS);
        return Object.keys( ICON_KEYWORDS ).filter( key => ICON_KEYWORDS[key].includes( searchValue.toLocaleLowerCase().trim() ))
    },[ searchValue ])
    const onSelectColor = (colors: ColorFormatsObject) => {
        // Puedes extraer colors.hex, colors.rgb, colors.hsl, etc.
        onColorChange(colors.hex);
    };
    const renderIcon =({ item }: { item: string })=>{
        const isSelected = item === icon;
        return <IconButton
            icon={ item }
            size={24}
            mode={ isSelected ? 'contained': 'outlined'}
            selected={ isSelected }
            onPress={()=>{
                onIconChange(item);
                setStep('COLOR');
            }} />
    }
    const onClose=()=>{
        onDismiss();
        setStep('ICON');
    }
    return <View style={[ styles.gap10 ]}>
        {/* Icon Selector */}
        {
            step === 'ICON' && <>
                <Searchbar 
                    value={ searchValue } 
                    onChangeText={setSearchValue}
                    placeholder='Escribe para buscar' />
                <FlatList
                    data={ icons }
                    keyExtractor={ item => item }
                    numColumns={NUM_COLUMNS}
                    initialNumToRender={10}
                    scrollEnabled={false}
                    renderItem={renderIcon}
                    contentContainerStyle={{ 
                        backgroundColor: theme.colors.surface,
                        alignItems: 'center',
                        justifyContent: 'center',


                    }}/>
            
            </>
        }
        {/* Color preview and selector */}
        {
            step === 'COLOR' && <>
            <IconButton
                icon={ icon }
                iconColor={ color }
                containerColor={ toTransparentColor(color) }
                size={32}
                style={{ alignSelf: 'center' }}/>
            <ColorPicker
                style={[ styles.colorPicker ]}
                value={ color }            
                onChangeJS={ onSelectColor }>
                    <Panel1 style={ styles.panel } />
                    <HueSlider style={ styles.slider } />
                    <Swatches style={styles.swatches} />
            </ColorPicker>
        </>
        }
        <View style={{ flexDirection: 'row', padding: 10, gap: 10, alignSelf: 'center'}}>
            { step === 'COLOR'  && <Button onPress={()=> setStep('ICON')} mode='contained'>
                Iconos
            </Button>}
            <Button mode='elevated' onPress={onClose}>
                Cerrar
            </Button>
        </View>
    </View>
}

export const CategoryIconColorSelect = React.memo(CategoryIconColorSelectComponent);

const styles = StyleSheet.create({
    gap10: {
        gap: 10,
        flex: 1,
        minHeight: 500,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent:'center',
    },
    colorPicker: {
        width: '100%',
        gap: 16, 
    },
    preview: {
        height: 45,
        borderRadius: 10,
    },
    panel: {
        height: 180,
        borderRadius: 12,
    },
    slider: {
        height: 30,
        borderRadius: 15,
    },
    swatches: {
        marginTop: 8,
    },
})