import { DarkTheme, DefaultTheme } from 'expo-router';
import { configureFonts, MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

const fonts = configureFonts({
    config: {
        fontFamily: 'PlusJakartaSans-Regular',
    },
});

const fontConfig = {
    ...fonts,
    titleSmall: { ...fonts.titleSmall, fontFamily: 'PlusJakartaSans-Medium' },
    titleMedium: { ...fonts.titleMedium, fontFamily: 'PlusJakartaSans-Medium' },
    labelSmall: { ...fonts.labelSmall, fontFamily: 'PlusJakartaSans-Medium' },
    labelMedium: { ...fonts.labelMedium, fontFamily: 'PlusJakartaSans-Medium' },
    labelLarge: { ...fonts.labelLarge, fontFamily: 'PlusJakartaSans-Medium' },
};

export const lightTheme: MD3Theme = {
    ...MD3LightTheme,
    roundness: 8,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#005c55',
        primaryContainer: '#0f766e',
        onPrimary: '#ffffff',
        onPrimaryContainer: '#a3faef',
        secondary: '#4059aa',
        secondaryContainer: '#8fa7fe',
        onSecondary: '#ffffff',
        onSecondaryContainer: '#1d3989',
        tertiary: '#734700',
        tertiaryContainer: '#945d00',
        onTertiary: '#ffffff',
        onTertiaryContainer: '#ffe6cc',
        error: '#ba1a1a',
        errorContainer: '#ffdad6',
        onError: '#ffffff',
        onErrorContainer: '#93000a',
        background: '#faf8ff',
        onBackground: '#131b2e',
        surface: '#faf8ff',
        surfaceVariant: '#dae2fd',
        onSurface: '#131b2e',
        onSurfaceVariant: '#3e4947',
        outline: '#6e7977',
        outlineVariant: '#bdc9c6',
        inverseSurface: '#283044',
        inverseOnSurface: '#eef0ff',
        inversePrimary: '#80d5cb',
        shadow: '#0f172a',
        scrim: '#0f172a',
        backdrop: 'rgba(15, 23, 42, 0.4)',
        surfaceDisabled: 'rgba(19, 27, 46, 0.12)',
        onSurfaceDisabled: 'rgba(19, 27, 46, 0.38)',
        elevation: {
            level0: 'transparent',
            level1: '#f2f3ff',
            level2: '#eaedff',
            level3: '#e2e7ff',
            level4: '#dae2fd',
            level5: '#dae2fd',
        },
    },
    fonts: fontConfig,
};

export const darkTheme: MD3Theme = {
    ...MD3DarkTheme,
    roundness: 8,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#80d5cb',
        primaryContainer: '#005c55',
        onPrimary: '#003732',
        onPrimaryContainer: '#a3faef',
        secondary: '#b4c4ff',
        secondaryContainer: '#4059aa',
        onSecondary: '#1a2b6b',
        onSecondaryContainer: '#dce1ff',
        tertiary: '#ffb95f',
        tertiaryContainer: '#945d00',
        onTertiary: '#422c00',
        onTertiaryContainer: '#ffe6cc',
        error: '#ffb4ab',
        errorContainer: '#93000a',
        onError: '#690005',
        onErrorContainer: '#ffdad6',
        background: '#0f172a',
        onBackground: '#eef0ff',
        surface: '#0f172a',
        surfaceVariant: '#3e4947',
        onSurface: '#eef0ff',
        onSurfaceVariant: '#bdc9c6',
        outline: '#879391',
        outlineVariant: '#3e4947',
        inverseSurface: '#eef0ff',
        inverseOnSurface: '#283044',
        inversePrimary: '#005c55',
        shadow: '#000000',
        scrim: '#000000',
        backdrop: 'rgba(15, 23, 42, 0.6)',
        surfaceDisabled: 'rgba(238, 240, 255, 0.12)',
        onSurfaceDisabled: 'rgba(238, 240, 255, 0.38)',
        elevation: {
            level0: 'transparent',
            level1: '#1a2338',
            level2: '#1e2940',
            level3: '#222e48',
            level4: '#25314c',
            level5: '#283550',
        },
    },
    fonts: fontConfig,
};

export function getPaperTheme(scheme?: string | null) {
    return scheme === 'dark' ? darkTheme : lightTheme;
}

export function toNavigationTheme(paperTheme: MD3Theme) {
    const base = paperTheme.dark ? DarkTheme : DefaultTheme;
    return {
        ...base,
        colors: {
            ...base.colors,
            primary: paperTheme.colors.primary,
            background: paperTheme.colors.background,
            card: paperTheme.colors.surface,
            text: paperTheme.colors.onSurface,
            border: paperTheme.colors.outline,
            notification: paperTheme.colors.error,
        },
    };
}
