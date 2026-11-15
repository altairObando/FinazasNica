import React, { useEffect, useMemo } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.85; // El sheet ocupa hasta el 85% de la pantalla
const CLOSE_THRESHOLD = 120; // Pixeles necesarios para cerrar al soltar

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ visible, onClose, children, title }) => {
  const theme = useTheme();
  const translateY = useSharedValue(SHEET_MAX_HEIGHT);
  
  // Animación de apertura/cierre basada en la prop 'visible'
  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 200, stiffness: 900 });
    } else {
      translateY.value = withTiming(SHEET_MAX_HEIGHT, { duration: 100 });
    }
  }, [visible]);

  // Lógica para cerrar desde el gesto o el backdrop
  const handleClose = () => {
    onClose();
  };

  // Gesto de arrastre (PanGesture)
  const gesture = useMemo(() => Gesture.Pan()
    .onChange((event) => {
      // Solo permitimos arrstrar hacia abajo (valores positivos)
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      // Si arrastró más del umbral o lo lanzó rápido hacia abajo, cerramos
      if (event.translationY > CLOSE_THRESHOLD || event.velocityY > 500) {
        scheduleOnRN(onClose);
      } else {
        // Si no, lo regresamos a su posición original con un efecto resorte
        translateY.value = withSpring(0);
      }
    }), [onClose]);

  // Estilos animados
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: visible ? 1 : 0, // Simplificado, podrías interpolar si quisieras
  }));

  // Colores de React Native Paper
  const colors = theme.colors;

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 999 }]} pointerEvents={visible ? 'auto' : 'none'}>
      {/* Backdrop (Fondo oscuro) */}
      <Pressable style={StyleSheet.absoluteFill} onPress={handleClose}>
        <Animated.View 
          style={[
            StyleSheet.absoluteFill, 
            { backgroundColor: 'rgba(0,0,0,0.4)' }, 
            backdropStyle
          ]} 
        />
      </Pressable>

      {/* Contenedor del Sheet */}
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: colors.surface,
              maxHeight: SHEET_MAX_HEIGHT,
              // Sombra estilo iOS / Paper Elevation
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            },
            sheetStyle,
          ]}
        >
          {/* "Pill" o indicador de arrastre (Drag Handle) */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: colors.onSurfaceVariant }]} />
          </View>

          {/* Contenido Dinámico */}
          <View style={styles.contentContainer}>
            {title && (
              <Text style={[styles.title, { color: colors.onSurface }]}>{title}</Text>
            )}
            
            {/* Usamos un ScrollView para que el contenido dinámico no rompa el layout si es muy largo */}
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              bounces={false}
            >
              {children}
            </ScrollView>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28, // Esquinas redondeadas estilo iOS
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  handleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    opacity: 0.5,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40, // Espacio para el home indicator de iOS
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
});