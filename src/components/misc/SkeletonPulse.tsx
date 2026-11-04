import React, { useEffect } from 'react';
import { Falsy, RecursiveArray, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
export const SkeletonPulse=({ style }: { style: ViewStyle | Falsy |  RecursiveArray<ViewStyle | Falsy> })=>{
    const opacity = useSharedValue(0.3);
    useEffect(()=>{
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 800 }),
                withTiming(0.3, { duration: 800 })
            ),
            -1,
            true
        )
    },[ opacity ]);
    const animatedStyle = useAnimatedStyle(()=>({
        opacity: opacity.value
    }));
    return <Animated.View style={[ styles.base, animatedStyle, style ]} />
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
});