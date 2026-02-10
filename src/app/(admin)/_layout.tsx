import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
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

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: '#a39e96',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Overview',
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
        name="salons"
        options={{
          title: 'Salons',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Rect x={3} y={3} width={7} height={7} rx={1} stroke={focused ? colors.navy : '#a39e96'} strokeWidth={focused ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round" />
                <Rect x={14} y={3} width={7} height={7} rx={1} stroke={focused ? colors.navy : '#a39e96'} strokeWidth={focused ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round" />
                <Rect x={3} y={14} width={7} height={7} rx={1} stroke={focused ? colors.navy : '#a39e96'} strokeWidth={focused ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round" />
                <Rect x={14} y={14} width={7} height={7} rx={1} stroke={focused ? colors.navy : '#a39e96'} strokeWidth={focused ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: 'Plans',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Rect
                  x={1} y={4} width={22} height={16} rx={2}
                  stroke={focused ? colors.navy : '#a39e96'}
                  strokeWidth={focused ? 2 : 1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Line x1={1} y1={10} x2={23} y2={10} stroke={focused ? colors.navy : '#a39e96'} strokeWidth={focused ? 2 : 1.6} strokeLinecap="round" />
              </Svg>
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="coupons"
        options={{
          title: 'Coupons',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Rect
                  x={3} y={8} width={18} height={13} rx={2}
                  stroke={focused ? colors.navy : '#a39e96'}
                  strokeWidth={focused ? 2 : 1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Polyline
                  points="7 8 7 3 12 3 12 8"
                  stroke={focused ? colors.navy : '#a39e96'}
                  strokeWidth={focused ? 2 : 1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Polyline
                  points="12 8 12 3 17 3 17 8"
                  stroke={focused ? colors.navy : '#a39e96'}
                  strokeWidth={focused ? 2 : 1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Line x1={12} y1={8} x2={12} y2={21} stroke={focused ? colors.navy : '#a39e96'} strokeWidth={focused ? 2 : 1.6} strokeLinecap="round" />
              </Svg>
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: 'Config',
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
    paddingTop: 10,
    paddingBottom: 30,
    height: 80,
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
