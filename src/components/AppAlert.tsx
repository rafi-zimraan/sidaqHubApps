import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '@/src/constants/theme';

export type AppAlertType = 'info' | 'success' | 'warning' | 'error';

export interface AppAlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

export interface AppAlertOptions {
  title: string;
  message?: string;
  type?: AppAlertType;
  buttons?: AppAlertButton[];
}

interface AlertContextValue {
  showAlert: (options: AppAlertOptions) => void;
}

// Default no-op agar layar tetap aman dirender tanpa provider (mis. unit test).
const AlertContext = createContext<AlertContextValue>({ showAlert: () => {} });

const TYPE_META: Record<AppAlertType, { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  info: { icon: 'information-circle', color: COLORS.primary, bg: COLORS.primaryLight },
  success: { icon: 'checkmark-circle', color: COLORS.success, bg: 'rgba(56,161,105,0.12)' },
  warning: { icon: 'alert-circle', color: COLORS.gold, bg: 'rgba(184,134,11,0.12)' },
  error: { icon: 'close-circle', color: COLORS.error, bg: 'rgba(229,62,62,0.10)' },
};

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AppAlertOptions | null>(null);
  const scale = useRef(new Animated.Value(0.92)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const showAlert = useCallback((options: AppAlertOptions) => {
    setAlert(options);
    scale.setValue(0.92);
    opacity.setValue(0);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 26, bounciness: 7 }),
      Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [scale, opacity]);

  const close = useCallback(() => setAlert(null), []);

  const handleButton = (btn: AppAlertButton) => {
    close();
    btn.onPress?.();
  };

  const meta = TYPE_META[alert?.type || 'info'];
  const buttons: AppAlertButton[] = alert?.buttons?.length ? alert.buttons : [{ text: 'Mengerti' }];

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Modal
        transparent
        visible={!!alert}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={close}
      >
        <View style={styles.backdrop}>
          <Animated.View
            style={[styles.card, { opacity, transform: [{ scale }] }]}
            testID="app-alert"
          >
            <View style={[styles.iconCircle, { backgroundColor: meta.bg }]}>
              <Ionicons name={meta.icon} size={34} color={meta.color} />
            </View>

            <Text style={styles.title} testID="app-alert-title">{alert?.title}</Text>
            {alert?.message ? (
              <Text style={styles.message} testID="app-alert-message">{alert.message}</Text>
            ) : null}

            <View style={buttons.length > 1 ? styles.btnRow : styles.btnCol}>
              {buttons.map((btn, i) => {
                const isCancel = btn.style === 'cancel';
                const isDestructive = btn.style === 'destructive';
                return (
                  <TouchableOpacity
                    key={`${btn.text}-${i}`}
                    testID={`app-alert-btn-${i}`}
                    style={[
                      styles.btn,
                      buttons.length > 1 && { flex: 1 },
                      isCancel && styles.btnCancel,
                      isDestructive && styles.btnDestructive,
                    ]}
                    onPress={() => handleButton(btn)}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.btnText, isCancel && styles.btnTextCancel]}>
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
}

export const useAppAlert = () => useContext(AlertContext);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: 'rgba(10,30,38,0.55)',
    alignItems: 'center', justifyContent: 'center',
    padding: SPACING.lg,
  },
  card: {
    width: '100%', maxWidth: 340,
    backgroundColor: '#fff', borderRadius: 24,
    paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.md,
    alignItems: 'center',
    shadowColor: '#0A1E26', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18, shadowRadius: 28, elevation: 12,
  },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text,
    textAlign: 'center', marginBottom: 6,
  },
  message: {
    fontFamily: FONTS.regular, fontSize: 13.5, color: COLORS.textSecondary,
    textAlign: 'center', lineHeight: 20, marginBottom: SPACING.md,
  },
  btnRow: { flexDirection: 'row', gap: 10, alignSelf: 'stretch', marginTop: 2 },
  btnCol: { alignSelf: 'stretch', gap: 10, marginTop: 2 },
  btn: {
    height: 48, borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  btnCancel: {
    backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  btnDestructive: { backgroundColor: COLORS.error },
  btnText: { fontFamily: FONTS.semiBold, fontSize: 14, color: '#fff' },
  btnTextCancel: { color: COLORS.text },
});
