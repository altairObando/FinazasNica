import React, {
  createContext,
  memo,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { Snackbar } from 'react-native-paper';

/** Opciones públicas para mostrar un snackbar */
export type SnackbarOptions = {
  message: string;
  duration?: number;
  actionLabel?: string;
  onActionPress?: () => void;
  onDismiss?: () => void;
};

/** Estado interno: los opcionales se normalizan a null (igual que el original) */
type SnackbarState = {
  visible: boolean;
  message: string;
  duration: number;
  actionLabel: string | null;
  onActionPress: (() => void) | null;
  onDismiss: (() => void) | null;
};

export type SnackbarContextValue = {
  showSnackbar: (options: SnackbarOptions) => void;
};

export type SimpleSnackbar = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string, actionLabel: string, onAction?: () => void) => void;
};

type SnackbarProviderProps = { children?: ReactNode };

const INITIAL_STATE: SnackbarState = {
  visible: false,
  message: '',
  duration: 4000,
  actionLabel: null,
  onActionPress: null,
  onDismiss: null,
};

// ---- Store externo: el estado vive fuera de React ----
// Mostrar/ocultar NO re-renderiza el Provider ni los consumidores:
// solo notifica a los suscriptores (únicamente el SnackbarHost).
const createSnackbarStore = () => {
  let state: SnackbarState = INITIAL_STATE;
  const listeners = new Set<() => void>();

  const getState = (): SnackbarState => state;

  const setState = (next: SnackbarState): void => {
    state = next;
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const showSnackbar = (options: SnackbarOptions): void => {
    setState({
      visible: true,
      message: options.message,
      duration: options.duration ?? 4000,
      actionLabel: options.actionLabel ?? null,
      onActionPress: options.onActionPress ?? null,
      onDismiss: options.onDismiss ?? null,
    });
  };

  const dismiss = (): void => {
    state.onDismiss?.();
    setState({ ...state, visible: false });
  };

  const pressAction = (): void => {
    state.onActionPress?.();
    dismiss();
  };

  return { getState, subscribe, showSnackbar, dismiss, pressAction };
};

type SnackbarStore = ReturnType<typeof createSnackbarStore>;

const SnackbarContext = createContext<SnackbarContextValue | undefined>(
  undefined
);

// ---- Host: el ÚNICO componente que re-renderiza al mostrar/ocultar ----
const SnackbarHost = memo(({ store }: { store: SnackbarStore }) => {
  const state = useSyncExternalStore(store.subscribe, store.getState);

  // action estable mientras no cambie el label; onPress siempre lee el estado actual
  const action = useMemo(
    () =>
      state.actionLabel
        ? {
            label: state.actionLabel,
            textColor: '#ffffff',
            onPress: store.pressAction,
          }
        : undefined,
    [state.actionLabel, store]
  );

  return (
    <Snackbar
      visible={state.visible}
      onDismiss={store.dismiss}
      duration={state.duration}
      action={action}
    >
      {state.message}
    </Snackbar>
  );
});

SnackbarHost.displayName = 'SnackbarHost';

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  // Inicializador perezoso: el store se crea una sola vez y es estable de por vida
  const [store] = useState(createSnackbarStore);

  // Contexto estable: los consumidores jamás re-renderizan por el snackbar
  const contextValue = useMemo<SnackbarContextValue>(
    () => ({ showSnackbar: store.showSnackbar }),
    [store]
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <SnackbarHost store={store} />
    </SnackbarContext.Provider>
  );
};

/**
 * Hook para acceder al snackbar.
 * @throws Error si se usa fuera de un SnackbarProvider
 */
export const useSnackbar = (): SnackbarContextValue => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

/** Hook simplificado para snackbars rápidos */
export const useSimpleSnackbar = (): SimpleSnackbar => {
  const { showSnackbar } = useSnackbar();

  // Objeto estable: seguro como prop de componentes memo() y en deps de useEffect
  return useMemo<SimpleSnackbar>(
    () => ({
      success: (message) => showSnackbar({ message, duration: 3000 }),
      error: (message) => showSnackbar({ message, duration: 5000 }),
      info: (message, actionLabel, onAction) =>
        showSnackbar({ message, actionLabel, onActionPress: onAction, duration: 6000 }),
    }),
    [showSnackbar]
  );
};