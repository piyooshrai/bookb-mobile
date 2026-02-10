import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Line, Rect, Polyline } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

interface PlanFeature {
  label: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  isCurrent: boolean;
  features: PlanFeature[];
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    period: '/month',
    isCurrent: false,
    features: [
      { label: 'Up to 3 stylists', included: true },
      { label: 'Unlimited appointments', included: true },
      { label: 'Basic analytics', included: true },
      { label: 'Email support', included: true },
      { label: 'Custom branding', included: false },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 79,
    period: '/month',
    isCurrent: true,
    features: [
      { label: 'Up to 10 stylists', included: true },
      { label: 'Unlimited appointments', included: true },
      { label: 'Advanced analytics', included: true },
      { label: 'Priority support', included: true },
      { label: 'Custom branding', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    period: '/month',
    isCurrent: false,
    features: [
      { label: 'Unlimited stylists', included: true },
      { label: 'Unlimited appointments', included: true },
      { label: 'Advanced analytics + API', included: true },
      { label: 'Dedicated support', included: true },
      { label: 'Custom branding + White label', included: true },
    ],
  },
];

const USAGE = [
  { label: 'Stylists', current: 4, max: 10, unit: '' },
  { label: 'Appointments', current: 284, max: null, unit: 'this month' },
  { label: 'Storage', current: 2.4, max: 10, unit: 'GB' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SubscriptionScreen() {
  const router = useRouter();

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
          <View>
            <Text style={styles.title}>Subscription</Text>
            <Text style={styles.subtitle}>Manage your subscription plan</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Current Plan Card */}
        <View style={styles.currentPlanCard}>
          <View style={styles.currentPlanHeader}>
            <View style={styles.currentPlanBadge}>
              <Text style={styles.currentPlanBadgeText}>Current Plan</Text>
            </View>
            <View style={styles.currentPlanRow}>
              <Text style={styles.currentPlanName}>Professional</Text>
              <View style={styles.currentPlanPricing}>
                <Text style={styles.currentPlanPrice}>$79</Text>
                <Text style={styles.currentPlanPeriod}>/month</Text>
              </View>
            </View>
          </View>
          <View style={styles.currentPlanDivider} />
          <View style={styles.billingRow}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={4} width={18} height={18} rx={2} stroke={colors.gold} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
              <Line x1={16} y1={2} x2={16} y2={6} stroke={colors.gold} strokeWidth={1.6} strokeLinecap="round" />
              <Line x1={8} y1={2} x2={8} y2={6} stroke={colors.gold} strokeWidth={1.6} strokeLinecap="round" />
              <Line x1={3} y1={10} x2={21} y2={10} stroke={colors.gold} strokeWidth={1.6} strokeLinecap="round" />
            </Svg>
            <Text style={styles.billingText}>Next billing: February 28, 2026</Text>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresSectionTitle}>Features included</Text>
            {PLANS[1].features.map((feature) => (
              <View key={feature.label} style={styles.featureRow}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path d="M20 6L9 17l-5-5" stroke={colors.success} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={styles.featureText}>{feature.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Usage Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke={colors.navy} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Usage</Text>
          </View>
          {USAGE.map((item, index) => (
            <View key={item.label} style={[styles.usageRow, index < USAGE.length - 1 && styles.usageRowBorder]}>
              <View style={styles.usageInfo}>
                <Text style={styles.usageLabel}>{item.label}</Text>
                <Text style={styles.usageValue}>
                  {item.current}{item.unit ? ` ${item.unit}` : ''}{item.max ? ` / ${item.max}${item.unit ? ` ${item.unit}` : ''}` : ''}
                </Text>
              </View>
              {item.max && (
                <View style={styles.usageBarBg}>
                  <View style={[styles.usageBarFill, { width: `${Math.min(100, (item.current / item.max) * 100)}%` }]} />
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Plan Comparison */}
        <Text style={styles.sectionTitle}>Compare Plans</Text>
        {PLANS.map((plan) => (
          <View key={plan.id} style={[styles.planCard, plan.isCurrent && styles.planCardCurrent]}>
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.planPriceRow}>
                  <Text style={styles.planPrice}>${plan.price}</Text>
                  <Text style={styles.planPeriod}>{plan.period}</Text>
                </View>
              </View>
              {plan.isCurrent ? (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Current</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.planActionBtn,
                    plan.price < 79 ? styles.planDowngradeBtn : styles.planUpgradeBtn,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.planActionText,
                    plan.price < 79 ? styles.planDowngradeText : styles.planUpgradeText,
                  ]}>
                    {plan.price < 79 ? 'Downgrade' : 'Upgrade'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.planFeatures}>
              {plan.features.map((feature) => (
                <View key={feature.label} style={styles.planFeatureRow}>
                  {feature.included ? (
                    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
                      <Path d="M20 6L9 17l-5-5" stroke={colors.success} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  ) : (
                    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
                      <Line x1={18} y1={6} x2={6} y2={18} stroke={colors.textTertiary} strokeWidth={2} strokeLinecap="round" />
                      <Line x1={6} y1={6} x2={18} y2={18} stroke={colors.textTertiary} strokeWidth={2} strokeLinecap="round" />
                    </Svg>
                  )}
                  <Text style={[styles.planFeatureText, !feature.included && styles.planFeatureTextDisabled]}>
                    {feature.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Cancel Subscription */}
        <TouchableOpacity style={styles.cancelButton} activeOpacity={0.7}>
          <Text style={styles.cancelText}>Cancel Subscription</Text>
        </TouchableOpacity>

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
  bodyContent: { padding: 20, gap: 16 },

  // Current Plan Card
  currentPlanCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.gold,
    overflow: 'hidden',
  },
  currentPlanHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  currentPlanBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.warningLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 10,
  },
  currentPlanBadgeText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 10,
    color: colors.warningDark,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  currentPlanRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  currentPlanName: {
    fontFamily: fontFamilies.heading,
    fontSize: 24,
    color: colors.textPrimary,
  },
  currentPlanPricing: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currentPlanPrice: {
    fontFamily: fontFamilies.heading,
    fontSize: 28,
    color: colors.gold,
  },
  currentPlanPeriod: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textTertiary,
    marginBottom: 4,
    marginLeft: 2,
  },
  currentPlanDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: 16,
  },
  billingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  billingText: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
  },

  // Features
  featuresSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  featuresSectionTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 7,
  },
  featureText: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textPrimary,
  },

  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  cardTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },

  // Usage
  usageRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  usageRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  usageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  usageLabel: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textPrimary,
  },
  usageValue: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  usageBarBg: {
    height: 8,
    backgroundColor: colors.offWhite,
    borderRadius: 4,
    overflow: 'hidden',
  },
  usageBarFill: {
    height: 8,
    backgroundColor: colors.gold,
    borderRadius: 4,
  },

  // Plan comparison
  sectionTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
    marginBottom: -4,
  },
  planCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  planCardCurrent: {
    borderColor: colors.gold,
    borderWidth: 2,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  planName: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 2,
  },
  planPrice: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textPrimary,
  },
  planPeriod: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: 2,
    marginLeft: 2,
  },
  currentBadge: {
    backgroundColor: colors.goldLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  currentBadgeText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.navy,
  },
  planActionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  planUpgradeBtn: {
    backgroundColor: colors.gold,
  },
  planDowngradeBtn: {
    backgroundColor: colors.offWhite,
    borderWidth: 1,
    borderColor: colors.border,
  },
  planActionText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
  },
  planUpgradeText: {
    color: colors.white,
  },
  planDowngradeText: {
    color: colors.textSecondary,
  },
  planFeatures: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
  },
  planFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
  },
  planFeatureText: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textPrimary,
  },
  planFeatureTextDisabled: {
    color: colors.textTertiary,
  },

  // Cancel
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.error,
  },
});
