import { CustomInputProps } from '@/interfaces/components/CustomInputProps';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';

export const CustomInput:React.FC<CustomInputProps>=({label, extraLabel, left, right, ...props})=>{
    const leftSize = !props.leftSize ? 24 : Math.min(props.leftSize, 24)
    const rightSize = !props.leftSize ? 24 : Math.min(props.leftSize, 24);
    const theme = useTheme();
    return <View style={{ gap: 5 }}>
        {/* Label */}
        <View style={ styles.labelContainer }>
            {
                label && <Text variant='titleMedium' style={{ fontWeight: 'bold' }}>
                    { label }
                </Text>
            }
            {
                extraLabel && <Text variant='bodySmall' style={{ fontWeight: 'thin', color: theme.colors.primary }}>
                    { extraLabel }
                </Text>
            }
        </View>
        <View style={ [styles.inputContainer, props?.inputContainerStyle ?? {} ] }>
            {/* Left Icon */}
            {
                left && <IconButton icon={ left } size={ leftSize } iconColor={ props.leftColor } onPress={ props.onLeftPress }/>
            }
            {/* Input */}
            <TextInput { ...props } style={[ styles.grow, { color: theme.colors.onBackground }] } placeholderTextColor={ '#a09f9f' }  />
            {/* Right */}
            {
                right && <IconButton icon={ right } size={ rightSize } iconColor={ props.rightColor } onPress={ props.onRightPress }/>
            }
            {
                props.rightComponent
            }
        </View>
    </View>

}

const styles = StyleSheet.create({
    labelContainer: { 
        flexDirection: 'row',
        justifyContent:'space-between', 
        alignItems: 'center',
        gap: 5 
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        flexDirection: 'row',
        borderRadius: 15,
        minHeight: 55,
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.20)'
    },
    grow: {
        flexGrow: 1 
    }
})