import { ReactNode } from 'react'
import { GestureResponderEvent, StyleProp, TextInputProps, ViewStyle } from 'react-native'

export interface CustomInputProps extends TextInputProps {
    // Label Props
    label?: string | undefined
    extraLabel?: string | undefined
    // Left Icon Props
    left?: string | undefined
    leftSize?: number | undefined
    leftColor?: string | undefined
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