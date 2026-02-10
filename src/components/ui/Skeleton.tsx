import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle, StyleProp, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';

interface SkeletonProps {
  width: DimensionValue;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

const SHIMMER_LIGHT = '#e8e6e3';
const SHIMMER_DARK = '#fafaf9';
const DURATION = 1500;

const Skeleton = React.memo<SkeletonProps>(
  ({ width, height, borderRadius = 8, style }) => {
    const progress = useSharedValue(0);

    useEffect(() => {
      progress.value = withRepeat(
        withTiming(1, {
          duration: DURATION,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      );
    }, [progress]);

    const animatedStyle = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        progress.value,
        [0, 1],
        [SHIMMER_LIGHT, SHIMMER_DARK],
      );

      return {
        backgroundColor,
      };
    });

    return (
      <Animated.View
        style={[
          styles.base,
          {
            width,
            height,
            borderRadius,
          },
          animatedStyle,
          style,
        ]}
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});

export { Skeleton };
export type { SkeletonProps };
