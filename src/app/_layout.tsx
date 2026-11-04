import { CustomAppBar } from '@/components/misc/CustomAppBar';
import { AppProvider } from '@/data/AppProvider';
import { useAppProvider } from '@/hooks/useAppProvider';
import { getPaperTheme, toNavigationTheme } from '@/theme';
import { useFonts } from 'expo-font';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { IconButton, PaperProvider, useTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
    const colorScheme = useColorScheme();
    const paperTheme = getPaperTheme(colorScheme);
    const [loaded, error] = useFonts({
        'PlusJakartaSans-ExtraLight': require('../../assets/fonts/Plus Jakarta Sans/PlusJakartaSans-ExtraLight.ttf'),
        'PlusJakartaSans-ExtraLightItalic': require('../../assets/fonts/Plus Jakarta Sans/PlusJakartaSans-ExtraLightItalic.ttf'),
        'PlusJakartaSans-Light': require('../../assets/fonts/Plus Jakarta Sans/PlusJakartaSans-Light.ttf'),
        'PlusJakartaSans-LightItalic': require('../../assets/fonts/Plus Jakarta Sans/PlusJakartaSans-LightItalic.ttf'),
        'PlusJakartaSans-Regular': require('../../assets/fonts/Plus Jakarta Sans/PlusJakartaSans-Regular.ttf'),
        'PlusJakartaSans-Italic': require('../../assets/fonts/Plus Jakarta Sans/PlusJakartaSans-Italic.ttf'),
        'PlusJakartaSans-Medium': require('../../assets/fonts/Plus Jakarta Sans/PlusJakartaSans-Medium.ttf'),
        'PlusJakartaSans-MediumItalic': require('../../assets/fonts/Plus Jakarta Sans/PlusJakartaSans-MediumItalic.ttf'),
        'PlusJakartaSans-SemiBold': require('../../assets/fonts/Plus Jakarta Sans/PlusJakartaSans-SemiBold.ttf'),
        'PlusJakartaSans-SemiBoldItalic': require('../../assets/fonts/Plus Jakarta Sans/PlusJakartaSans-SemiBoldItalic.ttf'),
        'PlusJakartaSans-Bold': require('../../assets/fonts/Plus Jakarta Sans/PlusJakartaSans-Bold.ttf'),
        'PlusJakartaSans-BoldItalic': require('../../assets/fonts/Plus Jakarta Sans/PlusJakartaSans-BoldItalic.ttf'),
        'PlusJakartaSans-ExtraBold': require('../../assets/fonts/Plus Jakarta Sans/PlusJakartaSans-ExtraBold.ttf'),
        'PlusJakartaSans-ExtraBoldItalic': require('../../assets/fonts/Plus Jakarta Sans/PlusJakartaSans-ExtraBoldItalic.ttf'),
    });

    if (!loaded && !error) {
        return null;
    }

    return <SafeAreaProvider>
        <AppProvider>
            <PaperProvider theme={paperTheme}>
                <ThemeProvider value={toNavigationTheme(paperTheme)}>
                    <RootLayout />
                </ThemeProvider>
            </PaperProvider>
        </AppProvider>
    </SafeAreaProvider>
}


export function RootLayout() {
    const theme = useTheme();
    const { isLoggedIn, isLoading } = useAppProvider();

    useEffect(() => {
        if (!isLoading) {
            SplashScreen.hideAsync();
        }
    }, [isLoading]);

    if (isLoading) {
        return null;
    }

    return <Stack screenOptions={{
        header: props => <CustomAppBar {...props} />,
    }}>
        <Stack.Protected guard={!isLoggedIn}>
            <Stack.Screen name='login' options={{ 
                title: 'Iniciar Sesión', 
                headerRight: props => <IconButton {...props} iconColor={ theme.colors.primary } icon='lightbulb-question-outline' contentStyle={{ backgroundColor: `${theme.colors.primary}20` }} />  }}/>
        </Stack.Protected>
        <Stack.Protected guard={isLoggedIn}>
            <Stack.Screen name='(app)' options={{ headerShown: false }} />
            <Stack.Screen 
                name='account'
                options={{
                    title: 'Configuración del hogar'
                }}/>
        </Stack.Protected>
    </Stack>
}
