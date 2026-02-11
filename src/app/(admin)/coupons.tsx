import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line, Rect, Polyline } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { useAdminCoupons } from '@/hooks/useCoupons';
import { Coupon } from '@/api/types';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const MOCK_ACTIVE_COUPONS = [
  {
    id: '1',
    code: 'WELCOME20',
    discount: 20,
    type: 'percentage' as const,
    usageCount: 347,
    usageLimit: 1000,
    expiryDate: 'Mar 31, 2026',
    description: 'New user welcome discount',
  },
  {
    id: '2',
    code: 'SUMMER15',
    discount: 15,
    type: 'percentage' as const,
    usageCount: 128,
    usageLimit: 500,
    expiryDate: 'Aug 31, 2026',
    description: 'Summer seasonal promotion',
  },
  {
    id: '3',
    code: 'PRO50OFF',
    discount: 50,
    type: 'fixed' as const,
    usageCount: 64,
    usageLimit: 200,
    expiryDate: 'Apr 15, 2026',
    description: '$50 off Professional plan upgrade',
  },
  {
    id: '4',
    code: 'REFER10',
    discount: 10,
    type: 'percentage' as const,
    usageCount: 892,
    usageLimit: null,
    expiryDate: 'Dec 31, 2026',
    description: 'Referral program reward',
  },
  {
    id: '5',
    code: 'LOYALTY25',
    discount: 25,
    type: 'percentage' as const,
    usageCount: 56,
    usageLimit: 300,
    expiryDate: 'Jun 30, 2026',
    description: '1-year anniversary loyalty reward',
  },
];

const MOCK_EXPIRED_COUPONS = [
  {
    id: '6',
    code: 'BLACKFRI30',
    discount: 30,
    type: 'percentage' as const,
    usageCount: 412,
    usageLimit: 500,
    expiryDate: 'Nov 30, 2025',
    description: 'Black Friday 2025 special',
  },
  {
    id: '7',
    code: 'LAUNCH40',
    discount: 40,
    type: 'percentage' as const,
    usageCount: 250,
    usageLimit: 250,
    expiryDate: 'Jan 15, 2025',
    description: 'Platform launch promotion',
  },
];

const MOCK_TOTAL_ACTIVE_USAGE = MOCK_ACTIVE_COUPONS.reduce((sum, c) => sum + c.usageCount, 0);

export default function AdminCoupons() {
  const isDemo = useAuthStore((s) => s.isDemo);
  const { data: adminCouponsData, isLoading } = useAdminCoupons();

  // Map API coupon data to display format (separate active vs expired)
  // Demo → mock data, Non-demo → API data or empty arrays
  const apiCoupons = !isDemo && adminCouponsData && Array.isArray(adminCouponsData)
    ? adminCouponsData.map((coupon: Coupon) => ({
        id: coupon._id,
        code: coupon.code || 'UNKNOWN',
        discount: parseInt(coupon.discount, 10) || 0,
        type: coupon.discount?.includes('%') || !coupon.discount?.includes('$') ? ('percentage' as const) : ('fixed' as const),
        usageCount: 0, // API Coupon type doesn't include usage tracking
        usageLimit: null as number | null,
        expiryDate: coupon.expireDate
          ? new Date(coupon.expireDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'No expiry',
        description: coupon.description || coupon.title || '',
        isExpired: coupon.isExpired ?? false,
        enable: coupon.enable ?? true,
      }))
    : null;

  const activeCoupons = isDemo
    ? MOCK_ACTIVE_COUPONS
    : apiCoupons
      ? apiCoupons.filter((c) => !c.isExpired && c.enable)
      : [];

  const expiredCoupons = isDemo
    ? MOCK_EXPIRED_COUPONS
    : apiCoupons
      ? apiCoupons.filter((c) => c.isExpired || !c.enable)
      : [];

  const totalActiveUsage = isDemo
    ? MOCK_TOTAL_ACTIVE_USAGE
    : activeCoupons.reduce((sum, c) => sum + c.usageCount, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Coupons</Text>
        <Text style={styles.subtitle}>
          {activeCoupons.length} active · {expiredCoupons.length} expired · {totalActiveUsage.toLocaleString()} total redemptions
        </Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {!isDemo && isLoading ? (
          <View style={{ paddingVertical: 32, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.gold} />
          </View>
        ) : (
          <>
        {/* Active Coupons Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.activeDot} />
            <Text style={styles.sectionTitle}>Active Coupons</Text>
          </View>
          <Text style={styles.sectionCount}>{activeCoupons.length}</Text>
        </View>

        {activeCoupons.length === 0 ? (
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <Text style={{ fontFamily: fontFamilies.body, fontSize: 13, color: colors.textTertiary }}>No active coupons</Text>
          </View>
        ) : null}

        {activeCoupons.map((coupon) => {
          const usagePercent = coupon.usageLimit
            ? Math.round((coupon.usageCount / coupon.usageLimit) * 100)
            : null;

          return (
            <View key={coupon.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.codeContainer}>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Rect x={2} y={2} width={20} height={20} rx={4} stroke={colors.gold} strokeWidth={1.8} />
                    <Path d="M9 2v20" stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" strokeDasharray="3 3" />
                  </Svg>
                  <Text style={styles.codeText}>{coupon.code}</Text>
                </View>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {coupon.type === 'percentage' ? `${coupon.discount}% OFF` : `$${coupon.discount} OFF`}
                  </Text>
                </View>
              </View>

              <Text style={styles.description}>{coupon.description}</Text>

              {/* Usage Progress */}
              <View style={styles.usageSection}>
                <View style={styles.usageTextRow}>
                  <View style={styles.usageLabel}>
                    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                      <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke={colors.textTertiary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                    <Text style={styles.usageLabelText}>
                      {coupon.usageCount.toLocaleString()} used
                      {coupon.usageLimit ? ` of ${coupon.usageLimit.toLocaleString()}` : ' (unlimited)'}
                    </Text>
                  </View>
                  {usagePercent !== null && (
                    <Text style={[
                      styles.usagePercent,
                      usagePercent >= 80 && styles.usagePercentHigh,
                    ]}>
                      {usagePercent}%
                    </Text>
                  )}
                </View>
                {coupon.usageLimit && (
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(usagePercent!, 100)}%`,
                          backgroundColor: usagePercent! >= 80 ? colors.warning : colors.gold,
                        },
                      ]}
                    />
                  </View>
                )}
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.expiryRow}>
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Circle cx={12} cy={12} r={10} stroke={colors.textTertiary} strokeWidth={1.8} />
                    <Polyline points="12 6 12 12 16 14" stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </Svg>
                  <Text style={styles.expiryText}>Expires {coupon.expiryDate}</Text>
                </View>
              </View>
            </View>
          );
        })}

        {/* Expired Coupons Section */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.expiredDot} />
            <Text style={styles.sectionTitle}>Expired</Text>
          </View>
          <Text style={styles.sectionCount}>{expiredCoupons.length}</Text>
        </View>

        {expiredCoupons.length === 0 ? (
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <Text style={{ fontFamily: fontFamilies.body, fontSize: 13, color: colors.textTertiary }}>No expired coupons</Text>
          </View>
        ) : null}

        {expiredCoupons.map((coupon) => (
          <View key={coupon.id} style={styles.expiredCard}>
            <View style={styles.cardTop}>
              <View style={styles.codeContainer}>
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Rect x={2} y={2} width={20} height={20} rx={4} stroke={colors.textTertiary} strokeWidth={1.8} />
                  <Path d="M9 2v20" stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" strokeDasharray="3 3" />
                </Svg>
                <Text style={styles.expiredCodeText}>{coupon.code}</Text>
              </View>
              <View style={styles.expiredDiscountBadge}>
                <Text style={styles.expiredDiscountText}>
                  {coupon.type === 'percentage' ? `${coupon.discount}% OFF` : `$${coupon.discount} OFF`}
                </Text>
              </View>
            </View>

            <Text style={styles.expiredDescription}>{coupon.description}</Text>

            <View style={styles.cardFooter}>
              <View style={styles.expiryRow}>
                <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                  <Circle cx={12} cy={12} r={10} stroke={colors.textTertiary} strokeWidth={1.8} />
                  <Line x1={8} y1={8} x2={16} y2={16} stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" />
                  <Line x1={16} y1={8} x2={8} y2={16} stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" />
                </Svg>
                <Text style={styles.expiryText}>Expired {coupon.expiryDate}</Text>
              </View>
              <Text style={styles.expiredUsage}>{coupon.usageCount.toLocaleString()} redeemed</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 20 }} />
          </>
        )}
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
  bodyContent: { padding: 20, gap: 12 },
  // Section
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  expiredDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textTertiary,
  },
  sectionTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  sectionCount: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textTertiary,
  },
  // Active Card
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeText: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 16,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  discountBadge: {
    backgroundColor: 'rgba(196,151,61,0.12)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  discountText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.goldDark,
    letterSpacing: 0.5,
  },
  description: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  // Usage
  usageSection: {
    marginBottom: 14,
  },
  usageTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  usageLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  usageLabelText: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
  usagePercent: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  usagePercentHigh: {
    color: colors.warningDark,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.offWhite,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  // Footer
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  expiryText: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
  // Expired Card
  expiredCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    opacity: 0.55,
  },
  expiredCodeText: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 16,
    color: colors.textTertiary,
    letterSpacing: 1,
  },
  expiredDiscountBadge: {
    backgroundColor: colors.offWhite,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  expiredDiscountText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.textTertiary,
    letterSpacing: 0.5,
  },
  expiredDescription: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: 14,
  },
  expiredUsage: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
});
