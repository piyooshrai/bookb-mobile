import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useCheckMobile } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/api/types';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const COUNTRY_CODES = [
  { code: '+1', country: 'US', label: 'United States' },
  { code: '+44', country: 'UK', label: 'United Kingdom' },
  { code: '+971', country: 'AE', label: 'UAE' },
  { code: '+966', country: 'SA', label: 'Saudi Arabia' },
  { code: '+973', country: 'BH', label: 'Bahrain' },
  { code: '+965', country: 'KW', label: 'Kuwait' },
  { code: '+974', country: 'QA', label: 'Qatar' },
  { code: '+968', country: 'OM', label: 'Oman' },
] as const;

function detectDefaultCountryCode(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.startsWith('America/')) return '+1';
    if (tz === 'Europe/London' || tz.startsWith('Europe/')) return '+44';
    if (tz === 'Asia/Dubai') return '+971';
    if (tz === 'Asia/Riyadh') return '+966';
    if (tz === 'Asia/Bahrain') return '+973';
    if (tz === 'Asia/Kuwait') return '+965';
    if (tz === 'Asia/Qatar') return '+974';
    if (tz === 'Asia/Muscat') return '+968';
  } catch {
    // fallback
  }
  return '+1';
}

const DEMO_ROLES: { role: UserRole; label: string }[] = [
  { role: 'salon', label: 'Salon Owner' },
  { role: 'stylist', label: 'Stylist' },
  { role: 'user', label: 'Customer' },
  { role: 'admin', label: 'Admin' },
];

export default function LoginScreen() {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);
  const checkMobile = useCheckMobile();
  const demoLogin = useAuthStore((s) => s.demoLogin);

  useEffect(() => {
    setCountryCode(detectDefaultCountryCode());
  }, []);

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

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
              <TouchableOpacity
                style={styles.countryCodeButton}
                onPress={() => setPickerVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.countryCodeText}>{selectedCountry.country}</Text>
                <Text style={styles.countryCodeValue}>{countryCode}</Text>
                <Svg width={10} height={6} viewBox="0 0 10 6" fill="none">
                  <Path d="M1 1l4 4 4-4" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
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

      <Modal
        visible={pickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerVisible(false)}
        >
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>Select Country</Text>
            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.pickerItem,
                    item.code === countryCode && styles.pickerItemActive,
                  ]}
                  onPress={() => {
                    setCountryCode(item.code);
                    setPickerVisible(false);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <View style={styles.pickerItemLeft}>
                    <Text style={styles.pickerItemCountry}>{item.country}</Text>
                    <Text style={styles.pickerItemLabel}>{item.label}</Text>
                  </View>
                  <Text style={[
                    styles.pickerItemCode,
                    item.code === countryCode && styles.pickerItemCodeActive,
                  ]}>
                    {item.code}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  countryCodeText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontFamily: fontFamilies.body,
  },
  countryCodeValue: {
    color: '#d4d1cc',
    fontSize: 14,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  pickerContainer: {
    backgroundColor: colors.navy,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    maxHeight: 420,
    overflow: 'hidden',
  },
  pickerTitle: {
    fontFamily: fontFamilies.heading,
    fontSize: 18,
    color: colors.textWhite,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  pickerItemActive: {
    backgroundColor: 'rgba(196,151,61,0.1)',
  },
  pickerItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pickerItemCountry: {
    color: colors.goldLight,
    fontSize: 13,
    fontFamily: fontFamilies.bodySemiBold,
    width: 28,
  },
  pickerItemLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: fontFamilies.body,
  },
  pickerItemCode: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    fontFamily: fontFamilies.bodyMedium,
  },
  pickerItemCodeActive: {
    color: colors.gold,
  },
});
