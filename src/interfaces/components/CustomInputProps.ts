import { ReactNode } from 'react'
import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native'
import { TextInputProps } from 'react-native-paper'

export interface CustomInputProps extends TextInputProps {
    // Label Props
    label?: string | undefined
    extraLabel?: string | undefined
    // Left Icon Props
    left?: string | undefined
    leftSize?: number | undefined
    leftColor?: string | undefined
    leftComponent?: ReactNode | undefined
    onLeftPress?: ( event?: GestureResponderEvent) => void,
    // Right right
    right?: string | undefined
    rightSize?: number | undefined
    rightColor?: string | undefined
    rightComponent?: ReactNode | undefined
    onRightPress?:( event?: GestureResponderEvent) => void,
    // Input Container
    inputContainerStyle?: StyleProp<ViewStyle> 
}