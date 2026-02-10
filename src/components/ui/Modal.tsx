import React, { useCallback } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';
import { borderRadius } from '@/theme/spacing';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal = React.memo<ModalProps>(({ visible, onClose, title, children }) => {
  const handleOverlayPress = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Pressable style={styles.overlay} onPress={handleOverlayPress}>
          <Pressable
            style={styles.content}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.handle} />
            {title ? (
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <View style={styles.body}>{children}</View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </RNModal>
  );
});

Modal.displayName = 'Modal';

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius['3xl'],
    borderTopRightRadius: borderRadius['3xl'],
    paddingBottom: 34,
    maxHeight: '90%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 20,
    lineHeight: 28,
    color: colors.navy,
    flex: 1,
  },
  closeButton: {
    paddingLeft: 16,
  },
  closeText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
});

export { Modal };
export type { ModalProps };
