import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  KeyboardTypeOptions,
} from 'react-native';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';
import { borderRadius } from '@/theme/spacing';

type InputMode = 'light' | 'dark';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  keyboardType?: KeyboardTypeOptions;
  style?: StyleProp<ViewStyle>;
  mode?: InputMode;
}

const Input = React.memo<InputProps>(
  ({
    label,
    placeholder,
    value,
    onChangeText,
    error,
    secureTextEntry = false,
    leftIcon,
    rightIcon,
    keyboardType,
    style,
    mode = 'light',
  }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
    }, []);

    const isLight = mode === 'light';

    const containerBorderColor = error
      ? colors.error
      : isFocused
        ? isLight
          ? colors.gold
          : colors.frostedWhiteBorder
        : isLight
          ? colors.border
          : 'rgba(255,255,255,0.1)';

    const inputContainerStyle: StyleProp<ViewStyle> = [
      styles.inputContainer,
      isLight ? styles.inputContainerLight : styles.inputContainerDark,
      { borderColor: containerBorderColor },
      isFocused && isLight && styles.inputContainerFocusedLight,
      isFocused && !isLight && styles.inputContainerFocusedDark,
      style,
    ];

    return (
      <View style={styles.wrapper}>
        {label ? (
          <Text style={[styles.label, !isLight && styles.labelDark]}>
            {label}
          </Text>
        ) : null}
        <View style={inputContainerStyle}>
          {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
          <TextInput
            style={[
              styles.input,
              isLight ? styles.inputLight : styles.inputDark,
              leftIcon ? styles.inputWithLeftIcon : null,
              rightIcon ? styles.inputWithRightIcon : null,
            ]}
            placeholder={placeholder}
            placeholderTextColor={
              isLight ? colors.textTertiary : 'rgba(255,255,255,0.4)'
            }
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoCapitalize="none"
          />
          {rightIcon ? (
            <View style={styles.rightIcon}>{rightIcon}</View>
          ) : null}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  labelDark: {
    color: 'rgba(255,255,255,0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  inputContainerLight: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  inputContainerDark: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputContainerFocusedLight: {
    borderColor: colors.gold,
  },
  inputContainerFocusedDark: {
    borderColor: colors.frostedWhiteBorder,
  },
  input: {
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: 15,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  inputLight: {
    color: colors.navy,
  },
  inputDark: {
    color: colors.textWhite,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  leftIcon: {
    paddingLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    paddingRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    lineHeight: 16,
    color: colors.error,
    marginTop: 6,
  },
});

export { Input };
export type { InputProps, InputMode };
