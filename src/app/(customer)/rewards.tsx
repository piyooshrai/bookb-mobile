import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line, Rect, Polyline } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const COIN_BALANCE = 100;

const TIERS = [
  { name: 'Bronze', threshold: 0 },
  { name: 'Silver', threshold: 50 },
  { name: 'Gold', threshold: 250 },
  { name: 'Platinum', threshold: 500 },
];

const CURRENT_TIER = 'Silver';
const NEXT_TIER = 'Gold';
const NEXT_TIER_THRESHOLD = 250;

const EARN_METHODS = [
  { label: 'Book an appointment', coins: 10, icon: 'calendar' },
  { label: 'Refer a friend', coins: 50, icon: 'users' },
  { label: 'Write a review', coins: 10, icon: 'star' },
  { label: 'Birthday bonus', coins: 25, icon: 'gift' },
  { label: 'Complete 5 visits', coins: 30, icon: 'check' },
];

const REDEEM_REWARDS = [
  { id: '1', coins: 50, label: '$5 off next service' },
  { id: '2', coins: 100, label: '$10 off next service' },
  { id: '3', coins: 200, label: 'Free blowout' },
  { id: '4', coins: 300, label: '20% off any service' },
];

const TRANSACTIONS = [
  { id: '1', amount: 10, type: 'earned' as const, description: 'Appointment completed', date: 'Feb 8' },
  { id: '2', amount: 50, type: 'spent' as const, description: 'Redeemed $5 off', date: 'Feb 5' },
  { id: '3', amount: 50, type: 'earned' as const, description: 'Referral bonus - Emma T.', date: 'Jan 28' },
  { id: '4', amount: 25, type: 'earned' as const, description: 'Birthday bonus', date: 'Jan 15' },
  { id: '5', amount: 10, type: 'earned' as const, description: 'Appointment completed', date: 'Jan 12' },
  { id: '6', amount: 10, type: 'earned' as const, description: 'Review submitted', date: 'Jan 10' },
  { id: '7', amount: 100, type: 'spent' as const, description: 'Redeemed $10 off', date: 'Jan 5' },
  { id: '8', amount: 10, type: 'earned' as const, description: 'Appointment completed', date: 'Dec 28' },
];

const REFERRAL_CODE = 'DEMO2024';

function EarnIcon({ icon, size = 18 }: { icon: string; size?: number }) {
  const strokeColor = colors.gold;
  const sw = 1.6;

  switch (icon) {
    case 'calendar':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x={3} y={4} width={18} height={18} rx={2} stroke={strokeColor} strokeWidth={sw} />
          <Line x1={16} y1={2} x2={16} y2={6} stroke={strokeColor} strokeWidth={sw} strokeLinecap="round" />
          <Line x1={8} y1={2} x2={8} y2={6} stroke={strokeColor} strokeWidth={sw} strokeLinecap="round" />
          <Line x1={3} y1={10} x2={21} y2={10} stroke={strokeColor} strokeWidth={sw} />
          <Path d="M8 14h2v2H8z" fill={strokeColor} />
        </Svg>
      );
    case 'users':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={strokeColor} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx={9} cy={7} r={4} stroke={strokeColor} strokeWidth={sw} />
          <Path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke={strokeColor} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'star':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke={strokeColor}
            strokeWidth={sw}
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      );
    case 'gift':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x={3} y={12} width={18} height={10} rx={2} stroke={strokeColor} strokeWidth={sw} />
          <Rect x={7} y={8} width={10} height={4} rx={1} stroke={strokeColor} strokeWidth={sw} />
          <Line x1={12} y1={8} x2={12} y2={22} stroke={strokeColor} strokeWidth={sw} />
          <Path d="M7.5 8C7.5 8 8 4 12 4s4.5 4 4.5 4" stroke={strokeColor} strokeWidth={1.4} strokeLinecap="round" />
        </Svg>
      );
    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={10} stroke={strokeColor} strokeWidth={sw} />
          <Path d="M8 12l3 3 5-5" stroke={strokeColor} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    default:
      return null;
  }
}

export default function RewardsScreen() {
  const [copiedCode, setCopiedCode] = useState(false);

  const tierProgress = COIN_BALANCE / NEXT_TIER_THRESHOLD;
  const progressPercent = Math.min(tierProgress * 100, 100);

  const handleCopy = () => {
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRedeem = (reward: typeof REDEEM_REWARDS[0]) => {
    Alert.alert('Redeem Reward', `Use ${reward.coins} coins for "${reward.label}"?`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Navy header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rewards</Text>
        <View style={styles.coinDisplay}>
          {/* Coin icon */}
          <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={10} stroke={colors.gold} strokeWidth={1.5} />
            <Circle cx={12} cy={12} r={6.5} stroke={colors.gold} strokeWidth={1} />
            <Path
              d="M12 8v8M9.5 10.5c0-.83.67-1.5 1.5-1.5h1c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-1c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h1c.83 0 1.5-.67 1.5-1.5"
              stroke={colors.gold}
              strokeWidth={1}
              strokeLinecap="round"
            />
          </Svg>
          <Text style={styles.coinAmount}>{COIN_BALANCE} coins</Text>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tier Progress card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Tier Progress</Text>
          </View>
          <View style={styles.tierCurrent}>
            <View style={styles.tierBadge}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16l-6.4 5.2L8 14l-6-4.8h7.6L12 2z"
                  fill={colors.gold}
                  stroke={colors.gold}
                  strokeWidth={1}
                />
              </Svg>
              <Text style={styles.tierName}>{CURRENT_TIER} Member</Text>
            </View>
            <Text style={styles.tierSubtext}>
              {NEXT_TIER_THRESHOLD - COIN_BALANCE} coins to {NEXT_TIER}
            </Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabelLeft}>{COIN_BALANCE}</Text>
            <Text style={styles.progressLabelRight}>{NEXT_TIER_THRESHOLD}</Text>
          </View>

          {/* Tier markers */}
          <View style={styles.tierMarkers}>
            {TIERS.map((tier, index) => {
              const isActive = COIN_BALANCE >= tier.threshold;
              return (
                <View key={tier.name} style={styles.tierMarker}>
                  <View
                    style={[
                      styles.tierDot,
                      isActive && styles.tierDotActive,
                    ]}
                  />
                  <Text
                    style={[
                      styles.tierMarkerLabel,
                      isActive && styles.tierMarkerLabelActive,
                    ]}
                  >
                    {tier.name}
                  </Text>
                  <Text style={styles.tierMarkerThreshold}>{tier.threshold}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* How to Earn card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>How to Earn</Text>
          </View>
          {EARN_METHODS.map((method, index) => (
            <View
              key={method.label}
              style={[styles.earnRow, index > 0 && styles.rowBorder]}
            >
              <View style={styles.earnIconWrap}>
                <EarnIcon icon={method.icon} />
              </View>
              <View style={styles.earnInfo}>
                <Text style={styles.earnLabel}>{method.label}</Text>
              </View>
              <View style={styles.earnBadge}>
                <Text style={styles.earnBadgeText}>+{method.coins}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Redeem section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Redeem Rewards</Text>
          </View>
          {REDEEM_REWARDS.map((reward, index) => {
            const canRedeem = COIN_BALANCE >= reward.coins;
            return (
              <View
                key={reward.id}
                style={[styles.redeemRow, index > 0 && styles.rowBorder]}
              >
                <View style={styles.redeemInfo}>
                  <View style={styles.redeemCoinRow}>
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Circle cx={12} cy={12} r={10} stroke={colors.gold} strokeWidth={1.5} />
                      <Path
                        d="M12 8v8"
                        stroke={colors.gold}
                        strokeWidth={1}
                        strokeLinecap="round"
                      />
                    </Svg>
                    <Text style={styles.redeemCoins}>{reward.coins} coins</Text>
                  </View>
                  <Text style={styles.redeemLabel}>{reward.label}</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.redeemButton,
                    !canRedeem && styles.redeemButtonDisabled,
                  ]}
                  activeOpacity={0.7}
                  disabled={!canRedeem}
                  onPress={() => handleRedeem(reward)}
                >
                  <Text
                    style={[
                      styles.redeemButtonText,
                      !canRedeem && styles.redeemButtonTextDisabled,
                    ]}
                  >
                    Redeem
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Transaction History */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Transaction History</Text>
          </View>
          {TRANSACTIONS.map((tx, index) => (
            <View
              key={tx.id}
              style={[styles.txRow, index > 0 && styles.rowBorder]}
            >
              <View
                style={[
                  styles.txIconWrap,
                  tx.type === 'earned' ? styles.txIconEarned : styles.txIconSpent,
                ]}
              >
                {tx.type === 'earned' ? (
                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M12 19V5M5 12l7-7 7 7"
                      stroke={colors.success}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                ) : (
                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M12 5v14M19 12l-7 7-7-7"
                      stroke={colors.error}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                )}
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txDescription}>{tx.description}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <Text
                style={[
                  styles.txAmount,
                  tx.type === 'earned' ? styles.txAmountEarned : styles.txAmountSpent,
                ]}
              >
                {tx.type === 'earned' ? '+' : '-'}{tx.amount}
              </Text>
            </View>
          ))}
        </View>

        {/* Referral card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Share Your Code</Text>
          </View>
          <View style={styles.referralContent}>
            <Text style={styles.referralDescription}>
              Invite friends and earn 50 coins when they book their first appointment.
            </Text>
            <View style={styles.referralCodeRow}>
              <View style={styles.referralCodeBox}>
                <Text style={styles.referralCode}>{REFERRAL_CODE}</Text>
              </View>
              <TouchableOpacity
                style={[styles.copyButton, copiedCode && styles.copyButtonCopied]}
                activeOpacity={0.7}
                onPress={handleCopy}
              >
                {copiedCode ? (
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M20 6L9 17l-5-5"
                      stroke={colors.success}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                ) : (
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Rect x={9} y={9} width={13} height={13} rx={2} stroke={colors.textWhite} strokeWidth={1.6} />
                    <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke={colors.textWhite} strokeWidth={1.6} strokeLinecap="round" />
                  </Svg>
                )}
                <Text style={[styles.copyButtonText, copiedCode && styles.copyButtonTextCopied]}>
                  {copiedCode ? 'Copied' : 'Copy'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: 24 }} />
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
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textWhite,
    marginBottom: 16,
  },
  coinDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  coinAmount: {
    fontFamily: fontFamilies.heading,
    fontSize: 32,
    color: colors.gold,
  },

  // Body
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 16 },

  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  cardTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },

  // Tier Progress
  tierCurrent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(196,151,61,0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tierName: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.gold,
  },
  tierSubtext: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.offWhite,
    borderRadius: 4,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: colors.gold,
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  progressLabelLeft: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    color: colors.gold,
  },
  progressLabelRight: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
  },
  tierMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  tierMarker: {
    alignItems: 'center',
    gap: 3,
  },
  tierDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.borderLight,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  tierDotActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  tierMarkerLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 10,
    color: colors.textTertiary,
  },
  tierMarkerLabelActive: {
    fontFamily: fontFamilies.bodySemiBold,
    color: colors.textPrimary,
  },
  tierMarkerThreshold: {
    fontFamily: fontFamilies.body,
    fontSize: 9,
    color: colors.textTertiary,
  },

  // Earn methods
  earnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  earnIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(196,151,61,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  earnInfo: {
    flex: 1,
    paddingLeft: 12,
  },
  earnLabel: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  earnBadge: {
    backgroundColor: 'rgba(196,151,61,0.12)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  earnBadgeText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.gold,
  },

  // Redeem
  redeemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  redeemInfo: {
    flex: 1,
  },
  redeemCoinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  redeemCoins: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.gold,
  },
  redeemLabel: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  redeemButton: {
    backgroundColor: colors.navy,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  redeemButtonDisabled: {
    backgroundColor: colors.offWhite,
    borderWidth: 1,
    borderColor: colors.border,
  },
  redeemButtonText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.textWhite,
  },
  redeemButtonTextDisabled: {
    color: colors.textTertiary,
  },

  // Transactions
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  txIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconEarned: {
    backgroundColor: colors.successLight,
  },
  txIconSpent: {
    backgroundColor: colors.errorLight,
  },
  txInfo: {
    flex: 1,
    paddingLeft: 12,
  },
  txDescription: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textPrimary,
  },
  txDate: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 2,
  },
  txAmount: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
  },
  txAmountEarned: {
    color: colors.success,
  },
  txAmountSpent: {
    color: colors.error,
  },

  // Referral
  referralContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  referralDescription: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  referralCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  referralCodeBox: {
    flex: 1,
    backgroundColor: colors.offWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    paddingVertical: 12,
    alignItems: 'center',
  },
  referralCode: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 16,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.navy,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  copyButtonCopied: {
    backgroundColor: colors.successLight,
  },
  copyButtonText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textWhite,
  },
  copyButtonTextCopied: {
    color: colors.success,
  },
});
