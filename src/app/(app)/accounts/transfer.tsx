import { BottomSheet } from '@/components/misc/BottomSheet';
import { useSimpleSnackbar } from '@/data/SnackProvider';
import { useAppProvider } from '@/hooks/useAppProvider';
import { Account, TransferRequest } from '@/interfaces/Accounts/Account';
import { accountService } from '@/lib/accountService';
import { formatCurrency, toTransparentColor } from '@/lib/format';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Chip,
    Dialog,
    Divider,
    Icon,
    IconButton,
    List,
    Portal,
    Surface,
    Text,
    TextInput,
    useTheme,
} from 'react-native-paper';
import { VariantProp } from 'react-native-paper/lib/typescript/components/Typography/types';

type DestinationType = 'ORIGIN' | 'DESTINATION';

const currencySymbol = (currency?: string) => (currency === 'USD' ? '$' : 'C$');

const sanitizeAmount = (value: string) => {
    const normalized = value.replace(',', '.').replace(/[^0-9.]/g, '');
    if (!normalized.includes('.')) return normalized;
    const [integer, ...decimals] = normalized.split('.');
    return `${integer || '0'}.${decimals.join('').slice(0, 2)}`;
};

const AccountSelect = React.memo(function AccountSelect({ account, label, disabled, onPress}: { account: Account | null; label: string; disabled: boolean;onPress: () => void}) {
    const theme = useTheme();
    const icon = account?.icon ?? 'bank';
    const color = account?.color ?? theme.colors.primary;
    const accountName = account?.name ?? 'Presiona para seleccionar';

    return (
        <Surface style={[style.accountSurface, disabled && style.disabled]}>
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled}
                accessibilityRole='button'
                accessibilityState={{ disabled }}
                accessibilityLabel={`${label}: ${account?.name ?? 'sin seleccionar'}`}
                style={style.accountTouchable}>
                <Text variant='labelLarge' style={{ color: theme.colors.onSurfaceVariant }}>
                    {label}
                </Text>
                <List.Item
                    left={props => <List.Icon {...props} icon={icon} color={color} />}
                    title={accountName}
                    description={
                        account
                            ? formatCurrency({ amount: account.balance, currency: account.currency })
                            : 'Sin cuenta seleccionada'
                    }
                    right={props => <List.Icon {...props} icon='chevron-down' />}
                />
            </TouchableOpacity>
        </Surface>
    );
});

interface AccountRowProps {
    account: Account;
    selected: boolean;
    last: boolean;
    onSelect: (account: Account) => void;
}
const AccountRow = React.memo(function AccountRow({ account, selected, last, onSelect}: AccountRowProps) {
    const theme = useTheme();
    return (
        <View>
            <List.Item
                onPress={() => onSelect(account)}
                accessibilityRole='button'
                accessibilityState={{ selected }}
                accessibilityLabel={`${account.name}, disponible ${formatCurrency({
                    amount: account.balance,
                    currency: account.currency,
                })}`}
                left={props => (
                    <List.Icon
                        {...props}
                        icon={account.icon}
                        color={account.color}
                        style={[props.style, style.pickerIcon, { backgroundColor: toTransparentColor(account.color) }]}
                    />
                )}
                title={account.name}
                description={`Disponible ${formatCurrency({ amount: account.balance, currency: account.currency })}`}
                right={props => (
                    <List.Icon
                        {...props}
                        icon={selected ? 'circle-slice-8' : 'circle-outline'}
                        color={theme.colors.primary}
                    />
                )}
            />
            {!last && <Divider />}
        </View>
    );
});

export default function TransferPage() {
    const params = useLocalSearchParams();
    const rawOrigin = Array.isArray(params.originAccountId) ? params.originAccountId[0] : params.originAccountId;
    const rawDestination = Array.isArray(params.destinationAccountId) ? params.destinationAccountId[0] : params.destinationAccountId;
    const originId = rawOrigin ? parseInt(rawOrigin, 10) : 0;
    const destinationId = rawDestination ? parseInt(rawDestination, 10) : 0;

    const sb = useSimpleSnackbar();
    const { user, getExchange } = useAppProvider();
    const theme = useTheme();
    const router = useRouter();
    const usdRate = getExchange('USD');
    const hasValidRate = Number.isFinite(usdRate) && usdRate > 0;

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [origin, setOrigin] = useState<Account | null>(null);
    const [destination, setDestination] = useState<Account | null>(null);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(Boolean(user?.team_id));
    const [loadError, setLoadError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [pickerMounted, setPickerMounted] = useState(false);
    const [modalAccount, setModalAccount] = useState<DestinationType>('ORIGIN');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const submittingRef = useRef(false);

    const titleVariant = Platform.select({
        android: 'titleSmall',
        ios: 'titleLarge',
    }) as VariantProp<string>;

    useEffect(() => {
        const teamId = user?.team_id;
        if (!teamId) return;

        let cancelled = false;

        accountService
            .get({ page: 0, size: 100, team_id: teamId })
            .then(({ items }) => {
                if (cancelled) return;
                setLoadError(null);
                const activeAccounts = items.filter(item => item.is_active);
                setAccounts(activeAccounts);
                if (originId) {
                    const preselected = activeAccounts.find(item => item.id === originId) ?? null;
                    setOrigin(current => current ?? preselected);
                }
                if (destinationId) {
                    const preselected = activeAccounts.find(item => item.id === destinationId) ?? null;
                    setDestination(current => current ?? preselected);
                }
            })
            .catch(error => {
                if (cancelled) return;
                setLoadError(error instanceof Error ? error.message : 'Error al cargar las cuentas');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [user?.team_id, originId, destinationId, reloadKey ]);

    const parsedAmount = useMemo(() => Number(amount), [amount]);

    const amountError = useMemo(() => {
        if (!amount) return undefined;
        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return 'Ingresa un monto mayor a cero.';
        if (origin && parsedAmount > origin.balance) return 'El monto supera el saldo disponible.';
        return undefined;
    }, [amount, parsedAmount, origin]);

    const canSubmit = !!origin && !!destination && !!amount && !amountError && !loading && !loadError && !saving;

    const estimatedDestinationAmount = useMemo(() => {
        if (!origin || !destination || !Number.isFinite(parsedAmount) || parsedAmount <= 0) return null;
        if (origin.currency === destination.currency) return parsedAmount;
        if (!hasValidRate) return null;
        if (origin.currency === 'NIO' && destination.currency === 'USD') return parsedAmount / usdRate;
        if (origin.currency === 'USD' && destination.currency === 'NIO') return parsedAmount * usdRate;
        return null;
    }, [origin, destination, parsedAmount, usdRate, hasValidRate]);

    const filteredAccounts = useMemo(() =>
            accounts.filter(item => {
                const excluded = modalAccount === 'ORIGIN' ? destination : origin;
                return item.id !== excluded?.id;
            }),
        [accounts, modalAccount, origin, destination]
    );

    const selectedAccountId = modalAccount === 'ORIGIN' ? origin?.id : destination?.id;

    const handleAmountChange = useCallback((value: string) => {
        setAmount(sanitizeAmount(value));
    }, []);

    const setMaxAmount = useCallback(() => {
        if (!origin) return;
        setAmount(String(origin.balance));
    }, [origin]);

    const openPicker = useCallback((type: DestinationType) => {
        setPickerMounted(true);
        setModalAccount(type);
        setModalOpen(true);
    }, []);

    const openOriginPicker = useCallback(() => openPicker('ORIGIN'), [openPicker]);
    const openDestinationPicker = useCallback(() => openPicker('DESTINATION'), [openPicker]);

    const closePicker = useCallback(() => setModalOpen(false), []);

    const selectAccount = useCallback(
        (account: Account) => {
            if (modalAccount === 'ORIGIN') setOrigin(account);
            else setDestination(account);
            setModalOpen(false);
        },
        [modalAccount]
    );

    const swapAccounts = useCallback(() => {
        if (!origin && !destination) return;
        const nextOrigin = destination;
        const nextDestination = origin;
        setOrigin(nextOrigin);
        setDestination(nextDestination);
    }, [origin, destination]);

    const retryLoad = useCallback(() => {
        setLoading(true);
        setLoadError(null);
        setReloadKey(key => key + 1);
    }, []);

    const openConfirm = useCallback(() => {
        if (!canSubmit) return;
        setConfirmOpen(true);
    }, [canSubmit]);

    const closeConfirm = useCallback(() => {
        if (saving) return;
        setConfirmOpen(false);
    }, [saving]);

    const requestTransfer = async () => {
        if (submittingRef.current || !origin || !destination) return;
        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || amountError) return;

        submittingRef.current = true;
        setSaving(true);

        try {
            const entity: TransferRequest = {
                amount: parsedAmount,
                destination_id: destination.id,
                origin_id: origin.id,
            };
            const response = await accountService.requestTransfer(entity);
            if (!response) throw new Error('Error al crear la transferencia');

            setConfirmOpen(false);
            sb.info(`Transferencia realizada con éxito · Ref. ${response.reference}`, 'Cerrar');

            if (router.canGoBack()) router.back();
            else router.replace('/(app)/accounts');
        } catch (error) {
            sb.error(error instanceof Error ? error.message : 'Error al crear la transferencia');
        } finally {
            submittingRef.current = false;
            setSaving(false);
        }
    };

    const formDisabled = loading || !!loadError || accounts.length === 0 || saving;
    const showPicker = pickerMounted;

    return (
        <>
            <KeyboardAvoidingView
                style={style.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    style={style.flex}
                    contentContainerStyle={style.scrollContent}
                    keyboardShouldPersistTaps='handled'>
                    <Surface style={style.container}>
                        <Card>
                            <Card.Title
                                title={
                                    <Text variant={titleVariant} style={style.bold}>
                                        Transferir entre cuentas
                                    </Text>
                                }
                                subtitle='Transferencia interna'
                                left={props => (
                                    <Icon source='swap-horizontal' size={props.size} color={theme.colors.primary} />
                                )}
                                right={
                                    hasValidRate
                                        ? () => (
                                              <Chip textStyle={{ color: theme.colors.onPrimary }}>
                                                  {`T.C. ${usdRate.toFixed(2)}`}
                                              </Chip>
                                          )
                                        : undefined
                                }
                                rightStyle={{ marginRight: 8 }}
                            />
                            <Card.Content style={style.cardContent}>
                                {loading && <ActivityIndicator style={style.loader} />}

                                {!!loadError && (
                                    <View style={style.feedback}>
                                        <Text style={{ color: theme.colors.error }}>{loadError}</Text>
                                        <Button mode='text' onPress={retryLoad}>
                                            Reintentar
                                        </Button>
                                    </View>
                                )}

                                {!loading && !loadError && accounts.length === 0 && (
                                    <Text variant='bodyMedium'>
                                        No tienes cuentas registradas. Crea una cuenta antes de transferir.
                                    </Text>
                                )}

                                <AccountSelect
                                    account={origin}
                                    label='Cuenta de origen'
                                    disabled={formDisabled}
                                    onPress={openOriginPicker}
                                />

                                <View style={style.swapRow}>
                                    <IconButton
                                        icon='swap-vertical'
                                        mode='contained-tonal'
                                        size={20}
                                        onPress={swapAccounts}
                                        disabled={(!origin && !destination) || saving}
                                        accessibilityLabel='Intercambiar cuenta de origen y destino'
                                    />
                                </View>

                                <AccountSelect
                                    account={destination}
                                    label='Cuenta de destino'
                                    disabled={formDisabled}
                                    onPress={openDestinationPicker}
                                />

                                <View style={style.amountContainer}>
                                    <Text variant='bodyMedium'>Monto a enviar:</Text>
                                    <TextInput
                                        keyboardType='decimal-pad'
                                        mode='outlined'
                                        outlineColor={amountError ? theme.colors.error : theme.colors.primary}
                                        activeOutlineColor={amountError ? theme.colors.error : theme.colors.primary}
                                        style={style.amountInput}
                                        placeholder='0.00'
                                        placeholderTextColor={theme.colors.onSurfaceVariant}
                                        left={<TextInput.Affix text={currencySymbol(origin?.currency)} />}
                                        value={amount}
                                        onChangeText={handleAmountChange}
                                        editable={!formDisabled}
                                        error={!!amountError}
                                        allowFontScaling
                                        accessibilityLabel='Monto a enviar'
                                    />

                                    {origin && (
                                        <View style={style.amountHelperRow}>
                                            <Text
                                                variant='bodySmall'
                                                style={{ color: theme.colors.onSurfaceVariant }}
                                            >
                                                {`Disponible: ${formatCurrency({
                                                    amount: origin.balance,
                                                    currency: origin.currency,
                                                })}`}
                                            </Text>
                                            <Button compact mode='text' onPress={setMaxAmount} disabled={saving}>
                                                Usar todo
                                            </Button>
                                        </View>
                                    )}

                                    {!!amountError && (
                                        <Text variant='bodySmall' style={{ color: theme.colors.error }}>
                                            {amountError}
                                        </Text>
                                    )}

                                    {estimatedDestinationAmount !== null &&
                                        origin &&
                                        destination &&
                                        origin.currency !== destination.currency && (
                                            <Text variant='bodySmall'>
                                                {`Recibirás aprox. ${formatCurrency({
                                                    amount: estimatedDestinationAmount,
                                                    currency: destination.currency,
                                                })}`}
                                            </Text>
                                        )}
                                </View>

                                <Button
                                    mode='contained'
                                    icon='folder-swap-outline'
                                    onPress={openConfirm}
                                    disabled={!canSubmit}
                                    loading={saving}
                                >
                                    Realizar Transferencia Interna
                                </Button>
                            </Card.Content>
                        </Card>
                    </Surface>
                </ScrollView>
            </KeyboardAvoidingView>

            {showPicker && (
                <BottomSheet
                    visible={modalOpen}
                    onClose={closePicker}
                    title='Selecciona una cuenta para continuar'>
                    <View style={[style.pickerList, { backgroundColor: theme.colors.background }]}>
                        {filteredAccounts.length === 0 && (
                            <Text style={style.pickerEmpty}>No hay otras cuentas disponibles.</Text>
                        )}
                        {filteredAccounts.map((item, index) => (
                            <AccountRow
                                key={String(item.id)}
                                account={item}
                                selected={selectedAccountId === item.id}
                                last={index === filteredAccounts.length - 1}
                                onSelect={selectAccount}
                            />
                        ))}
                    </View>
                </BottomSheet>
            )}

            <Portal>
                <Dialog visible={confirmOpen} onDismiss={closeConfirm}>
                    <Dialog.Title>Confirmar transferencia</Dialog.Title>
                    <Dialog.Content style={style.dialogContent}>
                        <Text variant='bodyMedium'>
                            {`${origin?.name ?? ''} → ${destination?.name ?? ''}`}
                        </Text>
                        <Text variant='headlineSmall' style={style.bold}>
                            {formatCurrency({ amount: parsedAmount, currency: origin?.currency })}
                        </Text>
                        {estimatedDestinationAmount !== null &&
                            origin &&
                            destination &&
                            origin.currency !== destination.currency && (
                                <Text variant='bodySmall'>
                                    {`Recibirá aprox. ${formatCurrency({
                                        amount: estimatedDestinationAmount,
                                        currency: destination.currency,
                                    })}`}
                                </Text>
                            )}
                        <Text variant='bodySmall'>Esta operación no se puede deshacer.</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={closeConfirm} disabled={saving}>
                            Cancelar
                        </Button>
                        <Button onPress={requestTransfer} loading={saving} disabled={saving}>
                            Confirmar
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
}

const style = StyleSheet.create({
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 10,
    },
    container: {
        borderRadius: 15,
        padding: 10,
    },
    cardContent: {
        gap: 10,
    },
    bold: {
        fontWeight: 'bold',
    },
    loader: {
        marginVertical: 12,
    },
    feedback: {
        alignItems: 'center',
        gap: 4,
    },
    accountSurface: {
        minHeight: 64,
        borderRadius: 15,
    },
    accountTouchable: {
        padding: 10,
    },
    disabled: {
        opacity: 0.6,
    },
    swapRow: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: -6,
    },
    amountContainer: {
        gap: 10,
    },
    amountInput: {
        fontSize: 35,
    },
    amountHelperRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pickerList: {
        borderRadius: 15,
        backgroundColor: 'transparent',
    },
    pickerIcon: {
        padding: 5,
        borderRadius: 20,
    },
    pickerEmpty: {
        padding: 20,
        textAlign: 'center',
    },
    dialogContent: {
        gap: 8,
    },
});
