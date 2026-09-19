import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/app-button';
import { Spacing } from '@/constants/theme';

export interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  destructive?: boolean;
  loading?: boolean;
  dismissible?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function AppModal({
  visible,
  onClose,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  destructive = false,
  loading = false,
  dismissible = true,
  children,
  style,
}: AppModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => {
        if (dismissible && !loading) {
          onClose();
        }
      }}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          if (dismissible && !loading) {
            onClose();
          }
        }}
      >
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <ThemedView type="backgroundElement" style={[styles.dialog, style]}>
              {title && (
                <ThemedText type="subtitle" style={styles.title}>
                  {title}
                </ThemedText>
              )}

              {message && (
                <ThemedText style={styles.message}>{message}</ThemedText>
              )}

              {children && <View style={styles.content}>{children}</View>}

              <View style={styles.actions}>
                <AppButton
                  title={cancelText}
                  variant="ghost"
                  size="sm"
                  onPress={onClose}
                  disabled={loading}
                  style={styles.actionButton}
                />
                {onConfirm && (
                  <AppButton
                    title={confirmText}
                    variant={destructive ? 'danger' : 'primary'}
                    size="sm"
                    loading={loading}
                    onPress={onConfirm}
                    style={styles.actionButton}
                  />
                )}
              </View>
            </ThemedView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: Spacing.four,
    gap: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
  content: {
    marginVertical: Spacing.one,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  actionButton: {
    flex: 1,
  },
});
