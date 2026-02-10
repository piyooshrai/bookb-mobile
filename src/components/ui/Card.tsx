import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';
import { borderRadius } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';

type CardVariant = 'default' | 'frosted' | 'highlighted';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: CardVariant;
}

const Card = React.memo<CardProps>(
  ({ children, style, variant = 'default' }) => {
    if (variant === 'highlighted') {
      return (
        <LinearGradient
          colors={[colors.white, '#f9f3e6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.highlighted, style]}
        >
          {children}
        </LinearGradient>
      );
    }

    return (
      <View
        style={[
          variant === 'default' && styles.default,
          variant === 'frosted' && styles.frosted,
          style,
        ]}
      >
        {children}
      </View>
    );
  },
);

Card.displayName = 'Card';

const styles = StyleSheet.create({
  default: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  frosted: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: borderRadius.xl,
  },
  highlighted: {
    borderWidth: 1,
    borderColor: 'rgba(196,151,61,0.2)',
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
});

export { Card };
export type { CardProps, CardVariant };
