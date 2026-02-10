import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Line, Circle, Polyline } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

function TabIcon({ children, focused }: { children: React.ReactNode; focused: boolean }) {
  return (
    <View style={styles.tabIconContainer}>
      {children}
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

export default function SalonLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, { paddingBottom: insets.bottom + 6, height: 56 + insets.bottom }],
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: '#a39e96',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                  stroke={focused ? colors.navy : '#a39e96'}
                  strokeWidth={focused ? 2 : 1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Polyline
                  points="9 22 9 12 15 12 15 22"
                  stroke={focused ? colors.navy : '#a39e96'}
                  strokeWidth={focused ? 2 : 1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Rect x={3} y={4} width={18} height={18} rx={2} stroke={focused ? colors.navy : '#a39e96'} strokeWidth={focused ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round" />
                <Line x1={16} y1={2} x2={16} y2={6} stroke={focused ? colors.navy : '#a39e96'} strokeWidth={focused ? 2 : 1.6} strokeLinecap="round" />
                <Line x1={8} y1={2} x2={8} y2={6} stroke={focused ? colors.navy : '#a39e96'} strokeWidth={focused ? 2 : 1.6} strokeLinecap="round" />
                <Line x1={3} y1={10} x2={21} y2={10} stroke={focused ? colors.navy : '#a39e96'} strokeWidth={focused ? 2 : 1.6} strokeLinecap="round" />
              </Svg>
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: 'Clients',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={focused ? colors.navy : '#a39e96'} strokeWidth={focused ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round" />
                <Circle cx={9} cy={7} r={4} stroke={focused ? colors.navy : '#a39e96'} strokeWidth={focused ? 2 : 1.6} />
              </Svg>
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="pos"
        options={{
          title: 'POS',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Rect x={1} y={4} width={22} height={16} rx={2} stroke={focused ? colors.navy : '#a39e96'} strokeWidth={focused ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round" />
                <Line x1={1} y1={10} x2={23} y2={10} stroke={focused ? colors.navy : '#a39e96'} strokeWidth={focused ? 2 : 1.6} strokeLinecap="round" />
              </Svg>
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={3} stroke={focused ? colors.navy : '#a39e96'} strokeWidth={focused ? 2 : 1.6} />
                <Path
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82.67V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.32 9c.26.6.85 1 1.51 1H21a2 2 0 0 1 0 4h-.09c-.66 0-1.25.4-1.51 1z"
                  stroke={focused ? colors.navy : '#a39e96'}
                  strokeWidth={focused ? 2 : 1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TabIcon>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  tabLabel: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 10,
  },
  tabIconContainer: {
    alignItems: 'center',
    gap: 2,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gold,
    marginTop: 2,
  },
});
