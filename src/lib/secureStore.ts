import * as SecureStore from 'expo-secure-store';

export const setValue = async ( key: string, value: string) => await SecureStore.setItemAsync(key, value)
export const getValue = async ( key: string) => await SecureStore.getItemAsync(key);
export const removeValue=async( key: string) => await SecureStore.deleteItemAsync(key);


export const setSecureValue = async ( key: string, value: string) => await SecureStore.setItemAsync(key, value, { requireAuthentication: true })
export const getSecureValue = async ( key: string) => await SecureStore.getItemAsync(key, { requireAuthentication: true });

export default {
    setValue,
    getValue,
    removeValue,
    secure: {
        setValue: setSecureValue,
        getValue: getSecureValue,
    }
}
