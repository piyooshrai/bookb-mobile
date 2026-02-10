import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name: string;
  size?: AvatarSize;
  imageUrl?: string;
  color?: string;
}

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 24,
  md: 40,
  lg: 48,
  xl: 76,
};

const FONT_SIZE_MAP: Record<AvatarSize, number> = {
  sm: 10,
  md: 15,
  lg: 18,
  xl: 28,
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || parts[0] === '') return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const Avatar = React.memo<AvatarProps>(
  ({ name, size = 'md', imageUrl, color }) => {
    const dimension = SIZE_MAP[size];
    const fontSize = FONT_SIZE_MAP[size];
    const initials = useMemo(() => getInitials(name), [name]);
    const backgroundColor = color || colors.navy;

    const containerStyle = {
      width: dimension,
      height: dimension,
      borderRadius: dimension / 2,
      backgroundColor,
    };

    if (imageUrl) {
      return (
        <View style={[styles.container, containerStyle]}>
          <Image
            source={{ uri: imageUrl }}
            style={[
              styles.image,
              {
                width: dimension,
                height: dimension,
                borderRadius: dimension / 2,
              },
            ]}
            contentFit="cover"
            transition={200}
          />
        </View>
      );
    }

    return (
      <View style={[styles.container, containerStyle]}>
        <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
      </View>
    );
  },
);

Avatar.displayName = 'Avatar';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontFamily: fontFamilies.heading,
    color: colors.textWhite,
  },
  image: {
    position: 'absolute',
  },
});

export { Avatar };
export type { AvatarProps, AvatarSize };
