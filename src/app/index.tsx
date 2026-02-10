import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/auth';
import { colors } from '@/theme/colors';

export default function Index() {
  const router = useRouter();
  const { token, isLoading, login, setLoading, logout } = useAuthStore();

  useEffect(() => {
    async function checkAuth() {
      if (!token) {
        setLoading(false);
        router.replace('/(auth)/login');
        return;
      }

      try {
        const res = await authApi.getUserByToken();
        if (res.data) {
          await login({
            user: res.data,
            token: token,
            role: res.data.role,
          });

          switch (res.data.role) {
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
      } catch {
        await logout();
        router.replace('/(auth)/login');
      }
    }

    checkAuth();
  }, [token]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.gold} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
