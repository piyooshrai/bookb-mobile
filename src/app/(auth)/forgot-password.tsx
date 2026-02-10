import { useState, useCallback } from 'react';
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
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { authApi } from '@/api/auth';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setError('');

    if (!email && !phone) {
      setError('Please enter your email or phone number');
      return;
    }

    setLoading(true);
    try {
      await authApi.forgotPassword({ email, phone, role: 'salon' });
      setSent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Request failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [email, phone]);

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
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              {sent
                ? 'Check your email for reset instructions.'
                : 'Enter your email or phone to reset your password.'}
            </Text>
          </Animated.View>

          {!sent && (
            <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity onPress={handleReset} activeOpacity={0.8}>
                <LinearGradient
                  colors={[colors.gold, '#b8892f']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.resetButton}
                >
                  <Text style={styles.resetButtonText}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {sent && (
            <TouchableOpacity
              style={styles.backToLogin}
              onPress={() => router.replace('/(auth)/login')}
            >
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
          )}
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
  form: { gap: 14 },
  input: {
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
  },
  resetButton: {
    borderRadius: 14,
    paddingVertical: 19,
    alignItems: 'center',
    marginTop: 6,
  },
  resetButtonText: {
    color: colors.textWhite,
    fontSize: 13,
    fontFamily: fontFamilies.bodySemiBold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  backToLogin: {
    alignItems: 'center',
    marginTop: 24,
  },
  backToLoginText: {
    color: colors.gold,
    fontSize: 14,
    fontFamily: fontFamilies.bodySemiBold,
  },
});
