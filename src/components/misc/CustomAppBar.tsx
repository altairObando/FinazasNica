import { NativeStackHeaderProps } from 'expo-router';
import { getHeaderTitle } from 'expo-router/react-navigation';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';


const TitleComponent=({ title }: { title: string })=> {
    const theme = useTheme()
    return <View style={ styles.container }>
            <Image source={ require('@/assets/defaultIcon.png')} style={ styles.image } />
            <View style={ styles.textContainer }>
                <Text variant='titleMedium' style={{ color: theme.colors.primary, fontWeight: 'bold' }}>FinanzasNica</Text>
                {
                    title && (<Text>
                        { title }
                    </Text>)
                }
            </View>
        </View>
}
export const CustomAppBar: React.FunctionComponent<NativeStackHeaderProps>=({ navigation, options, route, back  })=>{
    const theme = useTheme();
    const _goBack = ()=> navigation.goBack();
    const title = getHeaderTitle(options, route.name);    
    return (
        <Appbar.Header mode='small'>
            { back ? <Appbar.BackAction  onPress={ _goBack }/> : null }
            <Appbar.Content title={ <TitleComponent title={ title }/> } style={{ alignItems: 'flex-start' }}/>
            {options.headerRight && options.headerRight({ 
                canGoBack: !!back,
                tintColor: theme.colors.primary
            })}
        </Appbar.Header>
    )
}

const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row',
        gap: 10,
    },
    image: { 
        width: 50, 
        height: 50, 
        objectFit:'contain'
    },
    textContainer : { 
        flexDirection: 'column',
        alignItems:'flex-start',
        justifyContent:'center' 
    }
})