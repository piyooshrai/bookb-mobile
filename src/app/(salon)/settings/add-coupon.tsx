import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { useCreateCoupon } from '@/hooks/useCoupons';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AddCouponScreen() {
  const router = useRouter();
  const isDemo = useAuthStore((s) => s.isDemo);
  const salonId = useAuthStore((s) => s.salonId);

  const createCouponMutation = useCreateCoupon();

  const [couponCode, setCouponCode] = useState('');
  const [isPercentage, setIsPercentage] = useState(true);
  const [discountValue, setDiscountValue] = useState('');
  const [description, setDescription] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const handleSave = () => {
    if (isDemo) {
      Alert.alert('Success', 'Coupon created', [
        { text: 'OK', onPress: () => router.back() },
      ]);
      return;
    }

    if (!couponCode.trim()) {
      Alert.alert('Validation', 'Please enter a coupon code');
      return;
    }

    const today = new Date().toISOString();
    createCouponMutation.mutate(
      {
        title: couponCode.trim(),
        description: description.trim(),
        code: couponCode.trim(),
        startDate: today,
        expireDate: expiryDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        discount: discountValue || '0',
        salon: salonId || undefined,
      },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Coupon created', [
            { text: 'OK', onPress: () => router.back() },
          ]);
        },
        onError: (err: any) => {
          Alert.alert('Error', err?.message || 'Failed to create coupon');
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backButton}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M15 18l-6-6 6-6" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <View style={styles.headerTitleArea}>
            <Text style={styles.title}>Create Coupon</Text>
            <Text style={styles.subtitle}>Set up a new discount code</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Coupon Code */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Coupon Code</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. WELCOME10"
            placeholderTextColor={colors.textTertiary}
            value={couponCode}
            onChangeText={setCouponCode}
            autoCapitalize="characters"
          />
        </View>

        {/* Discount Type - Radio Toggle */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Discount Type</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleOption, isPercentage && styles.toggleOptionActive]}
              onPress={() => setIsPercentage(true)}
              activeOpacity={0.7}
            >
              <View style={[styles.toggleRadio, isPercentage && styles.toggleRadioActive]}>
                {isPercentage && <View style={styles.toggleRadioDot} />}
              </View>
              <Text style={[styles.toggleText, isPercentage && styles.toggleTextActive]}>Percentage</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleOption, !isPercentage && styles.toggleOptionActive]}
              onPress={() => setIsPercentage(false)}
              activeOpacity={0.7}
            >
              <View style={[styles.toggleRadio, !isPercentage && styles.toggleRadioActive]}>
                {!isPercentage && <View style={styles.toggleRadioDot} />}
              </View>
              <Text style={[styles.toggleText, !isPercentage && styles.toggleTextActive]}>Fixed Amount</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Discount Value */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Discount Value</Text>
          <TextInput
            style={styles.input}
            placeholder={isPercentage ? "e.g. 10" : "e.g. 25"}
            placeholderTextColor={colors.textTertiary}
            value={discountValue}
            onChangeText={setDiscountValue}
            keyboardType="numeric"
          />
        </View>

        {/* Description */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. First visit discount"
            placeholderTextColor={colors.textTertiary}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Max Uses */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Max Uses</Text>
          <TextInput
            style={styles.input}
            placeholder="Leave empty for unlimited"
            placeholderTextColor={colors.textTertiary}
            value={maxUses}
            onChangeText={setMaxUses}
            keyboardType="numeric"
          />
        </View>

        {/* Expiry Date */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Expiry Date</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Mar 2026"
            placeholderTextColor={colors.textTertiary}
            value={expiryDate}
            onChangeText={setExpiryDate}
          />
        </View>

        {/* Bottom spacer for save button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8} disabled={createCouponMutation.isPending}>
          {createCouponMutation.isPending ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>CREATE COUPON</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  headerTitleArea: { flex: 1 },
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textWhite,
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: '#a39e96',
    marginTop: 4,
  },

  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 18 },

  // Form fields
  fieldGroup: {},
  label: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textPrimary,
  },

  // Toggle (Percentage / Fixed Amount)
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
  },
  toggleOptionActive: {
    borderColor: colors.navy,
    backgroundColor: colors.offWhite,
  },
  toggleRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleRadioActive: {
    borderColor: colors.navy,
  },
  toggleRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.navy,
  },
  toggleText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.textPrimary,
  },

  // Save button
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 34,
    backgroundColor: colors.warmGrey,
  },
  saveButton: {
    backgroundColor: colors.gold,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.white,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
