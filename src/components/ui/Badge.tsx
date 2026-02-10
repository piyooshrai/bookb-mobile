import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { typography } from '@/theme/typography';
import { borderRadius } from '@/theme/spacing';
import { colors } from '@/theme/colors';

type BadgeVariant =
  | 'confirmed'
  | 'pending'
  | 'waiting'
  | 'canceled'
  | 'completed'
  | 'active'
  | 'trial'
  | 'expired'
  | 'custom';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  color?: string;
}

interface BadgeColors {
  backgroundColor: string;
  textColor: string;
}

const BADGE_COLOR_MAP: Record<Exclude<BadgeVariant, 'custom'>, BadgeColors> = {
  confirmed: {
    backgroundColor: 'rgba(45,125,70,0.08)',
    textColor: '#2d7d46',
  },
  completed: {
    backgroundColor: 'rgba(45,125,70,0.08)',
    textColor: '#2d7d46',
  },
  active: {
    backgroundColor: 'rgba(45,125,70,0.08)',
    textColor: '#2d7d46',
  },
  pending: {
    backgroundColor: 'rgba(196,151,61,0.08)',
    textColor: colors.gold,
  },
  trial: {
    backgroundColor: 'rgba(196,151,61,0.08)',
    textColor: colors.gold,
  },
  waiting: {
    backgroundColor: 'rgba(26,39,68,0.05)',
    textColor: colors.navy,
  },
  canceled: {
    backgroundColor: 'rgba(192,57,43,0.08)',
    textColor: '#c0392b',
  },
  expired: {
    backgroundColor: 'rgba(192,57,43,0.08)',
    textColor: '#c0392b',
  },
};

const Badge = React.memo<BadgeProps>(
  ({ label, variant = 'confirmed', color }) => {
    const badgeStyles = useMemo((): { container: ViewStyle; text: TextStyle } => {
      if (variant === 'custom' && color) {
        return {
          container: {
            backgroundColor: `${color}14`,
          },
          text: {
            color,
          },
        };
      }

      const colorConfig =
        variant !== 'custom'
          ? BADGE_COLOR_MAP[variant]
          : BADGE_COLOR_MAP.confirmed;

      return {
        container: {
          backgroundColor: colorConfig.backgroundColor,
        },
        text: {
          color: colorConfig.textColor,
        },
      };
    }, [variant, color]);

    return (
      <View style={[styles.container, badgeStyles.container]}>
        <Text style={[styles.text, badgeStyles.text]}>{label}</Text>
      </View>
    );
  },
);

Badge.displayName = 'Badge';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: borderRadius.sm,
  },
  text: {
    ...typography.badge,
  },
});

export { Badge, BADGE_COLOR_MAP };
export type { BadgeProps, BadgeVariant };
