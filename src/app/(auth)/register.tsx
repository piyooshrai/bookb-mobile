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
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLogin } from '@/hooks/useAuth';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const loginMutation = useLogin();

  const handleLogin = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    }
  }, [email, password, loginMutation]);

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
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>Enter your email and password</Text>
          </Animated.View>

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
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity onPress={handleLogin} activeOpacity={0.8}>
              <LinearGradient
                colors={[colors.gold, '#b8892f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.loginButton}
              >
                <Text style={styles.loginButtonText}>
                  {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() => router.push('/(auth)/forgot-password')}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
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
  loginButton: {
    borderRadius: 14,
    paddingVertical: 19,
    alignItems: 'center',
    marginTop: 6,
  },
  loginButtonText: {
    color: colors.textWhite,
    fontSize: 13,
    fontFamily: fontFamilies.bodySemiBold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  forgotButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotText: {
    color: colors.gold,
    fontSize: 13,
    fontFamily: fontFamilies.bodyMedium,
  },
});
