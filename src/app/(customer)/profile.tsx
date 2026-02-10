import { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

export default function Profile() {
  const router = useRouter();
  const { logout, isDemo } = useAuthStore();

  const handleLogout = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logout();
    router.replace('/(auth)/login');
  }, [logout, router]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Your account</Text>
      </View>
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Coming soon</Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M16 17l5-5-5-5" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M21 12H9" stroke={colors.error} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={styles.logoutText}>
            {isDemo ? 'Exit Demo Mode' : 'Sign Out'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmGrey },
  header: {
    backgroundColor: colors.navy,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textWhite,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: '#a39e96',
  },
  body: { flex: 1 },
  bodyContent: { padding: 20 },
  placeholder: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 40,
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: '#a39e96',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 32,
    paddingVertical: 16,
    backgroundColor: colors.errorLight,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.15)',
  },
  logoutText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.error,
  },
});
