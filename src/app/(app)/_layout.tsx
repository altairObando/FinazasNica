import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { StatusBar } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export const unstable_settings = {
  anchor: 'index',
};

export default function Layout() {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle={theme.dark ? 'dark-content' : 'light-content'} />
      <NativeTabs tintColor={theme.colors.primary} labelVisibilityMode='labeled'>
        {/* Inicio */}
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Inicio</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon 
            sf={{ default: 'house', selected: 'house.fill' }} 
            md="home" 
          />
        </NativeTabs.Trigger>

        {/* Presupuestos */}
        <NativeTabs.Trigger name="budgets">
          <NativeTabs.Trigger.Label>Presupuestos</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon 
            sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} 
            md="auto_graph" 
          />
        </NativeTabs.Trigger>

        {/* Registrar */}
        <NativeTabs.Trigger name="expenses">
          <NativeTabs.Trigger.Label>Registrar</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon 
            sf={{ default: 'plus.circle', selected: 'plus.circle.fill' }} 
            md="add_circle" 
          />
        </NativeTabs.Trigger>

        {/* Cuentas */}
        <NativeTabs.Trigger name="accounts">
          <NativeTabs.Trigger.Label>Cuentas</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon 
            sf={{ default: 'creditcard', selected: 'creditcard.fill' }} 
            md="account_balance_wallet" 
          />
        </NativeTabs.Trigger>

        {/* Familia */}
        <NativeTabs.Trigger name="team">
          <NativeTabs.Trigger.Label>Familia</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon 
            sf={{ default: 'person.2', selected: 'person.2.fill' }} 
            md="family_restroom" 
          />
        </NativeTabs.Trigger>
      </NativeTabs>
    </SafeAreaView>
  );
}
