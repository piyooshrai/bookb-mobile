import { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useVerifyOtp, useCheckMobile } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/api/types';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

function navigateByRole(router: ReturnType<typeof useRouter>, role: UserRole | null) {
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
}

export default function OtpScreen() {
  const router = useRouter();
  const { phone, countryCode } = useLocalSearchParams<{ phone: string; countryCode: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(40);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const verifyOtp = useVerifyOtp();
  const checkMobile = useCheckMobile();
  const role = useAuthStore((s) => s.role);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleOtpChange = useCallback(
    (value: string, index: number) => {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handleVerify = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete verification code');
      return;
    }

    try {
      await verifyOtp.mutateAsync({
        phone: phone || '',
        otp: parseInt(otpString, 10),
        packageName: 'com.bookb.app',
        platform: Platform.OS,
        deviceInfo: Platform.OS,
        deviceId: '',
      });
      // After successful verification, useVerifyOtp stores the token/user/role
      // Read role from store and navigate
      const currentRole = useAuthStore.getState().role;
      navigateByRole(router, currentRole);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid verification code';
      setError(message);
    }
  }, [otp, phone, verifyOtp, router]);

  const handleResend = useCallback(async () => {
    if (resendCountdown > 0) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setError('');
    try {
      await checkMobile.mutateAsync({
        data: { phone: phone || '', countryCode: countryCode || '+44' },
        packageName: 'com.bookb.app',
      });
      setResendCountdown(40);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to resend code';
      setError(message);
    }
  }, [resendCountdown, phone, countryCode, checkMobile]);

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
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
          >
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Animated.View entering={FadeInDown.duration(500)}>
            <Text style={styles.title}>Verification</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to {countryCode} {phone}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </Animated.View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Animated.View entering={FadeInDown.duration(500).delay(400)}>
            <TouchableOpacity onPress={handleVerify} activeOpacity={0.8}>
              <LinearGradient
                colors={[colors.gold, '#b8892f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.verifyButton}
              >
                <Text style={styles.verifyButtonText}>
                  {verifyOtp.isPending ? 'Verifying...' : 'Verify Code'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResend}
              disabled={resendCountdown > 0}
            >
              <Text style={[styles.resendText, resendCountdown > 0 && styles.resendDisabled]}>
                {resendCountdown > 0 ? `Resend Code (${resendCountdown}s)` : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  backButton: { marginBottom: 32 },
  backText: {
    color: colors.goldLight,
    fontSize: 14,
    fontFamily: fontFamilies.bodyMedium,
  },
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 28,
    color: colors.textWhite,
    marginBottom: 8,
  },
  subtitle: {
    color: '#a39e96',
    fontSize: 14,
    fontFamily: fontFamilies.body,
    lineHeight: 22,
    marginBottom: 40,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  otpInput: {
    flex: 1,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    color: colors.textWhite,
    fontSize: 22,
    fontFamily: fontFamilies.heading,
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: colors.gold,
    backgroundColor: 'rgba(196,151,61,0.08)',
  },
  error: {
    color: colors.error,
    fontSize: 12,
    fontFamily: fontFamilies.body,
    marginBottom: 16,
  },
  verifyButton: {
    borderRadius: 14,
    paddingVertical: 19,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: colors.textWhite,
    fontSize: 13,
    fontFamily: fontFamilies.bodySemiBold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 24,
  },
  resendText: {
    color: colors.gold,
    fontSize: 13,
    fontFamily: fontFamilies.bodySemiBold,
  },
  resendDisabled: {
    color: '#5c564e',
  },
});
