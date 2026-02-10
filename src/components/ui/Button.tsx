import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { borderRadius } from '@/theme/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Button = React.memo<ButtonProps>(
  ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    fullWidth = false,
    style,
  }) => {
    const handlePress = useCallback(() => {
      if (disabled || loading) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }, [disabled, loading, onPress]);

    const isDisabled = disabled || loading;

    const containerStyle: StyleProp<ViewStyle> = [
      styles.base,
      fullWidth && styles.fullWidth,
      style,
    ];

    const buttonStyle: StyleProp<ViewStyle> = [
      styles.button,
      variant === 'primary' && styles.buttonPrimary,
      variant === 'secondary' && styles.buttonSecondary,
      variant === 'outline' && styles.buttonOutline,
      variant === 'ghost' && styles.buttonGhost,
      isDisabled && styles.buttonDisabled,
      fullWidth && styles.fullWidth,
    ];

    const textStyle: StyleProp<TextStyle> = [
      styles.text,
      variant === 'primary' && styles.textPrimary,
      variant === 'secondary' && styles.textSecondary,
      variant === 'outline' && styles.textOutline,
      variant === 'ghost' && styles.textGhost,
      isDisabled && styles.textDisabled,
    ];

    const indicatorColor =
      variant === 'primary' || variant === 'secondary'
        ? colors.white
        : colors.gold;

    if (variant === 'primary') {
      return (
        <TouchableOpacity
          onPress={handlePress}
          disabled={isDisabled}
          activeOpacity={0.8}
          style={containerStyle}
        >
          <LinearGradient
            colors={
              isDisabled
                ? [colors.border, colors.border]
                : [colors.goldLight, colors.gold, colors.goldDark]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradient, fullWidth && styles.fullWidth]}
          >
            {loading ? (
              <ActivityIndicator size="small" color={indicatorColor} />
            ) : (
              <Text style={textStyle}>{title}</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={isDisabled}
        activeOpacity={0.7}
        style={[buttonStyle, style]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={indicatorColor} />
        ) : (
          <Text style={textStyle}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  },
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  base: {
    alignSelf: 'stretch',
  },
  fullWidth: {
    width: '100%',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.xl,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.xl,
    paddingVertical: 19,
    paddingHorizontal: 24,
  },
  buttonPrimary: {
    paddingVertical: 19,
    paddingHorizontal: 24,
  },
  buttonSecondary: {
    backgroundColor: colors.navy,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonOutline: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonGhost: {
    backgroundColor: colors.transparent,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.button,
  },
  textPrimary: {
    color: colors.white,
  },
  textSecondary: {
    color: colors.white,
  },
  textOutline: {
    color: colors.navy,
  },
  textGhost: {
    color: colors.navy,
  },
  textDisabled: {
    color: colors.textTertiary,
  },
});

export { Button };
export type { ButtonProps, ButtonVariant };
