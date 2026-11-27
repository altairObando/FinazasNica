import { Tabs } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import { FAB, Icon, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const iconMapping = {
  'home': 'home',
  'budgets': 'file-chart',
  'expenses': 'plus',
  'accounts': 'wallet',
  'team': 'account-group',
};


type ValidPages = keyof typeof iconMapping; 

export default function Layout() {
  const theme = useTheme();
  const getIcon=({ page = 'home', isFocus, size }: { page: ValidPages, isFocus: boolean, size: number })=>{
    const icon = iconMapping[page];
    const iconSource = !isFocus ? `${icon}-outline` : icon;
    if ( page === 'expenses' ){
      return <FAB 
        icon={icon}
        size='medium' 
        color={ theme.colors.onPrimary }
        style={{ 
          marginTop: -25, 
          backgroundColor: theme.colors.primary,
          elevation: 6,
        }} />
    }
    return <Icon
      source={iconSource}
      size={size}
      color={ isFocus ? theme.colors.primary: theme.colors.outline }/>
  }
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left','right']}>
      <StatusBar barStyle={theme.dark ? 'dark-content' : 'light-content'} />
      <Tabs screenOptions={{
        headerTintColor: theme.colors.primary,
        tabBarActiveTintColor: theme.colors.primary,
        headerShown: false,
      }}>
        <Tabs.Screen name='index'    options={{ title:'Inicio',       tabBarIcon: props => getIcon({ page: 'home',     isFocus: props.focused, size: props.size }) }} />
        <Tabs.Screen name='budgets'  options={{ title:'Presupuestos', tabBarIcon: props => getIcon({ page: 'budgets',  isFocus: props.focused, size: props.size }) }}/>
        <Tabs.Screen name='expenses' options={{ title:'Registrar',    tabBarIcon: props => getIcon({ page: 'expenses', isFocus: props.focused, size: props.size }), tabBarLabel: '' }}/>
        <Tabs.Screen name='accounts' options={{ title:'Cuentas',      tabBarIcon: props => getIcon({ page: 'accounts', isFocus: props.focused, size: props.size }) }}/>
        <Tabs.Screen name='team'     options={{ title:'Familia',      tabBarIcon: props => getIcon({ page: 'team',     isFocus: props.focused, size: props.size }) }}/>
      </Tabs>
    </SafeAreaView>
  );
}
