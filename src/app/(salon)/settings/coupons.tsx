import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Line } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { useSalonCoupons, useDeleteCoupon } from '@/hooks/useCoupons';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

interface Coupon {
  id: string;
  code: string;
  discount: string;
  description: string;
  usedCount: number;
  maxUses: number | null; // null = unlimited
  expiry: string | null; // null = no expiry
  expired: boolean;
  enabled: boolean;
}

const INITIAL_COUPONS: Coupon[] = [
  { id: '1', code: 'WELCOME10', discount: '10% off', description: 'First visit discount', usedCount: 45, maxUses: 100, expiry: 'Mar 2026', expired: false, enabled: true },
  { id: '2', code: 'SUMMER25', discount: '25% off', description: 'Color services only', usedCount: 12, maxUses: 50, expiry: 'Apr 2026', expired: false, enabled: true },
  { id: '3', code: 'LOYALTY15', discount: '15% off', description: 'Returning clients', usedCount: 89, maxUses: null, expiry: null, expired: false, enabled: true },
  { id: '4', code: 'HOLIDAY20', discount: '20% off', description: 'Holiday special', usedCount: 67, maxUses: null, expiry: 'Dec 2025', expired: true, enabled: false },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CouponsScreen() {
  const router = useRouter();
  const isDemo = useAuthStore((s) => s.isDemo);

  // --- API hooks ---
  const { data: couponsData, isLoading } = useSalonCoupons({ pageNumber: 1, pageSize: 100 });
  const deleteCouponMutation = useDeleteCoupon();

  const apiCoupons: Coupon[] = useMemo(() => {
    if (isDemo || !couponsData) return [];
    const list = Array.isArray(couponsData) ? couponsData : (couponsData as any).coupons || (couponsData as any).data || [];
    return list.map((c: any) => {
      const now = new Date();
      const expiryDate = c.expiry ? new Date(c.expiry) : null;
      const isExpired = expiryDate ? expiryDate < now : false;
      return {
        id: c._id || c.id,
        code: c.code || '',
        discount: `${c.discount || 0}% off`,
        description: c.description || '',
        usedCount: c.usageCount ?? 0,
        maxUses: c.usageLimit ?? null,
        expiry: expiryDate ? expiryDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : null,
        expired: isExpired,
        enabled: c.enable !== false && !isExpired,
      };
    });
  }, [isDemo, couponsData]);

  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const displayCoupons = !isDemo && apiCoupons.length > 0 ? apiCoupons : coupons;
  const [showExpired, setShowExpired] = useState(true);

  const toggleCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)),
    );
  };

  const activeCoupons = displayCoupons.filter((c) => !c.expired);
  const expiredCoupons = displayCoupons.filter((c) => c.expired);

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
            <Text style={styles.title}>Coupons</Text>
            <Text style={styles.subtitle}>Create and manage discount coupons</Text>
          </View>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.7} onPress={() => router.push('/(salon)/settings/add-coupon')}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M12 5v14M5 12h14" stroke={colors.navy} strokeWidth={2} strokeLinecap="round" />
            </Svg>
            <Text style={styles.addButtonText}>Create Coupon</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {!isDemo && isLoading && (
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <ActivityIndicator size="small" color={colors.gold} />
          </View>
        )}
        {/* Active Coupons Section */}
        <Text style={styles.sectionTitle}>Active Coupons</Text>
        {activeCoupons.map((coupon) => (
          <View key={coupon.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.codeRow}>
                <View style={styles.tagIcon}>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke={colors.gold} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                    <Line x1={7} y1={7} x2={7.01} y2={7} stroke={colors.gold} strokeWidth={2} strokeLinecap="round" />
                  </Svg>
                </View>
                <Text style={styles.couponCode}>{coupon.code}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>{coupon.discount}</Text>
                </View>
              </View>
              <Switch
                value={coupon.enabled}
                onValueChange={() => toggleCoupon(coupon.id)}
                trackColor={{ false: colors.border, true: colors.goldLight }}
                thumbColor={coupon.enabled ? colors.gold : colors.textTertiary}
                style={styles.couponSwitch}
              />
            </View>
            <Text style={styles.couponDesc}>{coupon.description}</Text>

            {/* Usage Bar */}
            <View style={styles.usageSection}>
              <View style={styles.usageInfo}>
                <Text style={styles.usageLabel}>Usage</Text>
                <Text style={styles.usageCount}>
                  {coupon.usedCount}/{coupon.maxUses ? coupon.maxUses : 'unlimited'}
                </Text>
              </View>
              {coupon.maxUses && (
                <View style={styles.usageBarBg}>
                  <View style={[styles.usageBarFill, { width: `${Math.min(100, (coupon.usedCount / coupon.maxUses) * 100)}%` }]} />
                </View>
              )}
            </View>

            {coupon.expiry && (
              <View style={styles.expiryRow}>
                <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                  <Path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 0v10l6 3" stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={styles.expiryText}>Expires {coupon.expiry}</Text>
              </View>
            )}
            {!coupon.expiry && (
              <View style={styles.expiryRow}>
                <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                  <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke={colors.success} strokeWidth={1.6} strokeLinecap="round" />
                  <Path d="M22 4L12 14.01l-3-3" stroke={colors.success} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={[styles.expiryText, { color: colors.successDark }]}>No expiration</Text>
              </View>
            )}
          </View>
        ))}

        {/* Expired Coupons Section */}
        {expiredCoupons.length > 0 && (
          <>
            <TouchableOpacity
              style={styles.expiredHeader}
              onPress={() => setShowExpired(!showExpired)}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionTitle}>Expired</Text>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d={showExpired ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'}
                  stroke={colors.textTertiary}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
            {showExpired &&
              expiredCoupons.map((coupon) => (
                <View key={coupon.id} style={[styles.card, styles.cardExpired]}>
                  <View style={styles.cardTop}>
                    <View style={styles.codeRow}>
                      <View style={[styles.tagIcon, styles.tagIconExpired]}>
                        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                          <Path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                          <Line x1={7} y1={7} x2={7.01} y2={7} stroke={colors.textTertiary} strokeWidth={2} strokeLinecap="round" />
                        </Svg>
                      </View>
                      <Text style={[styles.couponCode, styles.couponCodeExpired]}>{coupon.code}</Text>
                      <View style={[styles.discountBadge, styles.discountBadgeExpired]}>
                        <Text style={[styles.discountBadgeText, styles.discountBadgeTextExpired]}>{coupon.discount}</Text>
                      </View>
                    </View>
                    <View style={styles.expiredBadge}>
                      <Text style={styles.expiredBadgeText}>Expired</Text>
                    </View>
                  </View>
                  <Text style={[styles.couponDesc, styles.couponDescExpired]}>{coupon.description}</Text>
                  <View style={styles.expiryRow}>
                    <Text style={styles.expiryText}>
                      Expired {coupon.expiry} -- Used {coupon.usedCount} times
                    </Text>
                  </View>
                </View>
              ))}
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.gold,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 2,
  },
  addButtonText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.navy,
  },

  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 12 },

  sectionTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
    marginLeft: 4,
  },

  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  cardExpired: {
    opacity: 0.6,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagIconExpired: {
    backgroundColor: colors.offWhite,
  },
  couponCode: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 15,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  couponCodeExpired: {
    color: colors.textTertiary,
  },
  discountBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountBadgeExpired: {
    backgroundColor: colors.offWhite,
  },
  discountBadgeText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    color: colors.successDark,
  },
  discountBadgeTextExpired: {
    color: colors.textTertiary,
  },
  couponSwitch: {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },
  couponDesc: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 10,
    marginLeft: 40,
  },
  couponDescExpired: {
    color: colors.textTertiary,
  },

  // Usage
  usageSection: {
    marginTop: 12,
    marginLeft: 40,
  },
  usageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  usageLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
  usageCount: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  usageBarBg: {
    height: 6,
    backgroundColor: colors.offWhite,
    borderRadius: 3,
    overflow: 'hidden',
  },
  usageBarFill: {
    height: 6,
    backgroundColor: colors.gold,
    borderRadius: 3,
  },

  // Expiry
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    marginLeft: 40,
  },
  expiryText: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },

  // Expired section
  expiredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingRight: 4,
  },
  expiredBadge: {
    backgroundColor: colors.errorLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  expiredBadgeText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 10,
    color: colors.error,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
