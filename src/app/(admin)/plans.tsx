import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line, Polyline } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { useAdminSubscription } from '@/hooks/useReports';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

// NOTE: No dedicated usePlans hook exists yet. plansApi is available at '@/api/plans'
// but a React Query hook has not been created for it. When a usePlans hook is added,
// connect it here to replace MOCK_PLANS with real plan data.
// For now, useAdminSubscription is used to populate subscriber counts per plan.

const MOCK_PLANS = [
  {
    id: '1',
    name: 'Starter',
    price: 29,
    popular: false,
    subscribers: 42,
    features: [
      { label: 'Up to 3 stylists', included: true },
      { label: '150 appointments/mo', included: true },
      { label: 'Basic analytics', included: true },
      { label: 'Email support', included: true },
      { label: 'Custom branding', included: false },
      { label: 'API access', included: false },
    ],
  },
  {
    id: '2',
    name: 'Professional',
    price: 79,
    popular: true,
    subscribers: 58,
    features: [
      { label: 'Up to 10 stylists', included: true },
      { label: 'Unlimited appointments', included: true },
      { label: 'Advanced analytics', included: true },
      { label: 'Priority support', included: true },
      { label: 'Custom branding', included: true },
      { label: 'API access', included: false },
    ],
  },
  {
    id: '3',
    name: 'Enterprise',
    price: 199,
    popular: false,
    subscribers: 18,
    features: [
      { label: 'Unlimited stylists', included: true },
      { label: 'Unlimited appointments', included: true },
      { label: 'Full analytics suite', included: true },
      { label: 'Dedicated account manager', included: true },
      { label: 'Custom branding', included: true },
      { label: 'API access', included: true },
    ],
  },
];

const MOCK_TOTAL_SUBSCRIBERS = MOCK_PLANS.reduce((sum, p) => sum + p.subscribers, 0);

export default function Plans() {
  const isDemo = useAuthStore((s) => s.isDemo);
  const { data: subscriptionData, isLoading } = useAdminSubscription();

  // Map API subscription data to enrich plan cards with real subscriber counts
  const plans = !isDemo && subscriptionData && Array.isArray(subscriptionData)
    ? MOCK_PLANS.map((mockPlan) => {
        const apiMatch = subscriptionData.find(
          (item: { plan: string; count: number }) =>
            item.plan?.toLowerCase() === mockPlan.name.toLowerCase(),
        );
        return apiMatch ? { ...mockPlan, subscribers: apiMatch.count } : mockPlan;
      })
    : MOCK_PLANS;

  const totalSubscribers = plans.reduce((sum, p) => sum + p.subscribers, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Subscription Plans</Text>
        <Text style={styles.subtitle}>{totalSubscribers} active subscribers across all plans</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Summary Bar */}
        {!isDemo && isLoading ? (
          <View style={{ paddingVertical: 16, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={colors.gold} />
          </View>
        ) : (
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalSubscribers}</Text>
              <Text style={styles.summaryLabel}>Total Subs</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                ${plans.reduce((sum, p) => sum + p.price * p.subscribers, 0).toLocaleString()}
              </Text>
              <Text style={styles.summaryLabel}>Monthly MRR</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                ${totalSubscribers > 0 ? Math.round(plans.reduce((sum, p) => sum + p.price * p.subscribers, 0) / totalSubscribers) : 0}
              </Text>
              <Text style={styles.summaryLabel}>Avg Revenue</Text>
            </View>
          </View>
        )}

        {/* Plan Cards */}
        {plans.map((plan) => (
          <View
            key={plan.id}
            style={[
              styles.card,
              plan.popular && styles.cardPopular,
            ]}
          >
            {plan.popular && (
              <View style={styles.popularBanner}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    stroke={colors.gold}
                    strokeWidth={1.8}
                    fill={colors.gold}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
            )}

            <View style={styles.cardBody}>
              {/* Plan Header */}
              <View style={styles.planHeader}>
                <View>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.subscriberRow}>
                    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                      <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={colors.textTertiary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      <Circle cx={8.5} cy={7} r={4} stroke={colors.textTertiary} strokeWidth={2} />
                    </Svg>
                    <Text style={styles.subscriberText}>{plan.subscribers} subscribers</Text>
                  </View>
                </View>
                <View style={styles.priceBlock}>
                  <Text style={styles.priceDollar}>$</Text>
                  <Text style={styles.priceValue}>{plan.price}</Text>
                  <Text style={styles.pricePeriod}>/mo</Text>
                </View>
              </View>

              {/* Features */}
              <View style={styles.featureList}>
                {plan.features.map((feature, idx) => (
                  <View key={idx} style={styles.featureRow}>
                    {feature.included ? (
                      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                        <Circle cx={12} cy={12} r={10} stroke={colors.success} strokeWidth={1.8} fill={colors.successLight} />
                        <Polyline points="9 12 11.5 14.5 16 9.5" stroke={colors.successDark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </Svg>
                    ) : (
                      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                        <Circle cx={12} cy={12} r={10} stroke={colors.border} strokeWidth={1.8} />
                        <Line x1={8} y1={12} x2={16} y2={12} stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" />
                      </Svg>
                    )}
                    <Text style={[styles.featureText, !feature.included && styles.featureDisabled]}>
                      {feature.label}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Revenue line */}
              <View style={styles.revenueFooter}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Line x1={12} y1={1} x2={12} y2={23} stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" />
                  <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={styles.revenueText}>
                  ${(plan.price * plan.subscribers).toLocaleString()}/mo revenue
                </Text>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 20 }} />
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
  bodyContent: { padding: 20, gap: 16 },
  // Summary
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontFamily: fontFamilies.heading,
    fontSize: 18,
    color: colors.textPrimary,
  },
  summaryLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardPopular: {
    borderColor: colors.gold,
    borderWidth: 2,
  },
  popularBanner: {
    backgroundColor: 'rgba(196,151,61,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  popularText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.goldDark,
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: 20,
  },
  // Plan header
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  planName: {
    fontFamily: fontFamilies.heading,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subscriberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  subscriberText: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  priceDollar: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 4,
  },
  priceValue: {
    fontFamily: fontFamilies.heading,
    fontSize: 36,
    color: colors.textPrimary,
    lineHeight: 40,
  },
  pricePeriod: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 20,
  },
  // Features
  featureList: {
    gap: 10,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  featureDisabled: {
    color: colors.textTertiary,
  },
  // Revenue footer
  revenueFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 14,
  },
  revenueText: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
