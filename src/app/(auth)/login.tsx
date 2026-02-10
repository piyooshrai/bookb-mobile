import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useCheckMobile } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/api/types';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const DEMO_ROLES: { role: UserRole; label: string }[] = [
  { role: 'salon', label: 'Salon Owner' },
  { role: 'stylist', label: 'Stylist' },
  { role: 'user', label: 'Customer' },
  { role: 'admin', label: 'Admin' },
];

export default function LoginScreen() {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState('+44');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const checkMobile = useCheckMobile();
  const demoLogin = useAuthStore((s) => s.demoLogin);

  const handleSendOtp = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setError('');

    if (!phone || phone.length < 7) {
      setError('Please enter a valid mobile number');
      return;
    }

    try {
      await checkMobile.mutateAsync({
        data: { phone, countryCode },
        packageName: 'com.bookb.app',
      });
      router.push({
        pathname: '/(auth)/otp',
        params: { phone, countryCode },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP';
      setError(message);
    }
  }, [phone, countryCode, checkMobile, router]);

  const handleEmailLogin = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(auth)/register');
  }, [router]);

  const handleDemoLogin = useCallback(async (role: UserRole) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    demoLogin(role);
    switch (role) {
      case 'salon':
      case 'manager':
        router.replace('/(salon)/');
        break;
      case 'stylist':
        router.replace('/(stylist)/');
        break;
      case 'admin':
      case 'superadmin':
        router.replace('/(admin)/');
        break;
      case 'user':
      default:
        router.replace('/(customer)/');
        break;
    }
  }, [demoLogin, router]);

  return (
    <LinearGradient
      colors={[colors.navyLight, colors.navyDark, '#05080e']}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInUp.duration(600).delay(200)}>
            <Text style={styles.logo}>
              Book<Text style={styles.logoAccent}>B</Text>
            </Text>
            <Text style={styles.tagline}>Salon Management</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.form}>
            <View style={styles.phoneRow}>
              <TextInput
                style={styles.countryCode}
                value={countryCode}
                onChangeText={setCountryCode}
                keyboardType="phone-pad"
                maxLength={4}
                placeholderTextColor={colors.textTertiary}
              />
              <TextInput
                style={styles.phoneInput}
                placeholder="Mobile number"
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoFocus
              />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity onPress={handleSendOtp} activeOpacity={0.8}>
              <LinearGradient
                colors={[colors.gold, '#b8892f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendButton}
              >
                <Text style={styles.sendButtonText}>
                  {checkMobile.isPending ? 'Sending...' : 'Send Verification Code'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(600).delay(700)}>
            <TouchableOpacity
              style={styles.emailButton}
              onPress={handleEmailLogin}
              activeOpacity={0.7}
            >
              <Text style={styles.emailButtonText}>Sign in with Email</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(600).delay(900)} style={styles.demoSection}>
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>demo mode</Text>
              <View style={styles.dividerLine} />
            </View>
            <View style={styles.demoGrid}>
              {DEMO_ROLES.map(({ role, label }) => (
                <TouchableOpacity
                  key={role}
                  style={styles.demoButton}
                  onPress={() => handleDemoLogin(role)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.demoButtonText}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    fontFamily: fontFamilies.heading,
    fontSize: 52,
    color: colors.textWhite,
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 2,
  },
  logoAccent: {
    color: colors.gold,
  },
  tagline: {
    color: colors.goldLight,
    fontSize: 11,
    letterSpacing: 6,
    textTransform: 'uppercase',
    fontFamily: fontFamilies.body,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 48,
  },
  form: {
    width: '100%',
    gap: 14,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 10,
  },
  countryCode: {
    width: 76,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 10,
    color: '#d4d1cc',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: fontFamilies.bodyMedium,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 20,
    color: colors.textWhite,
    fontSize: 15,
    fontFamily: fontFamilies.body,
  },
  error: {
    color: colors.error,
    fontSize: 12,
    fontFamily: fontFamilies.body,
    marginTop: -4,
  },
  sendButton: {
    borderRadius: 14,
    paddingVertical: 19,
    alignItems: 'center',
    marginTop: 6,
  },
  sendButtonText: {
    color: colors.textWhite,
    fontSize: 13,
    fontFamily: fontFamilies.bodySemiBold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 24,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  dividerText: {
    color: '#5c564e',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: fontFamilies.body,
  },
  emailButton: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  emailButtonText: {
    color: '#a39e96',
    fontSize: 13,
    fontFamily: fontFamilies.bodyMedium,
    letterSpacing: 0.8,
  },
  demoSection: {
    width: '100%',
    marginTop: 8,
    paddingBottom: 32,
  },
  demoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  demoButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(196,151,61,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(196,151,61,0.2)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  demoButtonText: {
    color: colors.goldLight,
    fontSize: 12,
    fontFamily: fontFamilies.bodyMedium,
    letterSpacing: 0.5,
  },
});
