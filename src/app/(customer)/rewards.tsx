import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const COIN_BALANCE = 100;

const EARN_METHODS = [
  { label: 'Refer a friend', coins: 50, description: 'Both you and your friend earn coins' },
  { label: 'First booking', coins: 20, description: 'Complete your first appointment' },
  { label: 'Leave a review', coins: 10, description: 'Review a salon after your visit' },
  { label: 'Birthday bonus', coins: 25, description: 'Gifted on your birthday each year' },
];

const MOCK_TRANSACTIONS = [
  {
    id: '1',
    type: 'earned' as const,
    amount: 50,
    description: 'Referral bonus - Sarah M. joined',
    date: 'Feb 8, 2026',
  },
  {
    id: '2',
    type: 'spent' as const,
    amount: 30,
    description: 'Discount on Balayage at Luxe Hair',
    date: 'Feb 5, 2026',
  },
  {
    id: '3',
    type: 'earned' as const,
    amount: 10,
    description: 'Review for The Grooming Room',
    date: 'Jan 29, 2026',
  },
  {
    id: '4',
    type: 'earned' as const,
    amount: 20,
    description: 'First booking completed',
    date: 'Jan 22, 2026',
  },
  {
    id: '5',
    type: 'spent' as const,
    amount: 15,
    description: 'Discount on Blowout at Bella Vita',
    date: 'Jan 18, 2026',
  },
  {
    id: '6',
    type: 'earned' as const,
    amount: 25,
    description: 'Birthday bonus',
    date: 'Jan 15, 2026',
  },
  {
    id: '7',
    type: 'earned' as const,
    amount: 40,
    description: 'Sign-up welcome bonus',
    date: 'Jan 10, 2026',
  },
];

export default function Rewards() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Navy header with coin balance */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Your Rewards</Text>
        <View style={styles.balanceRow}>
          {/* Coin icon */}
          <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={10} stroke={colors.gold} strokeWidth={1.5} />
            <Circle cx={12} cy={12} r={6.5} stroke={colors.gold} strokeWidth={1} />
            <Path
              d="M12 8v8M9.5 10.5c0-.83.67-1.5 1.5-1.5h1c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-1c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h1c.83 0 1.5-.67 1.5-1.5"
              stroke={colors.gold}
              strokeWidth={1}
              strokeLinecap="round"
            />
          </Svg>
          <Text style={styles.balanceAmount}>{COIN_BALANCE}</Text>
        </View>
        <Text style={styles.balanceLabel}>BookB Coins</Text>
        <Text style={styles.balanceSubtext}>1 coin = $0.10 discount</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* How to Earn card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>How to Earn</Text>
          </View>
          {EARN_METHODS.map((method, index) => (
            <View
              key={method.label}
              style={[styles.earnRow, index > 0 && styles.earnRowBorder]}
            >
              <View style={styles.earnIconWrap}>
                {/* Gift/star icon per row */}
                {index === 0 && (
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Rect x={3} y={12} width={18} height={10} rx={2} stroke={colors.gold} strokeWidth={1.6} />
                    <Rect x={7} y={8} width={10} height={4} rx={1} stroke={colors.gold} strokeWidth={1.6} />
                    <Line x1={12} y1={8} x2={12} y2={22} stroke={colors.gold} strokeWidth={1.6} />
                    <Path d="M7.5 8C7.5 8 8 4 12 4s4.5 4 4.5 4" stroke={colors.gold} strokeWidth={1.4} strokeLinecap="round" />
                  </Svg>
                )}
                {index === 1 && (
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Rect x={3} y={4} width={18} height={18} rx={2} stroke={colors.gold} strokeWidth={1.6} />
                    <Line x1={16} y1={2} x2={16} y2={6} stroke={colors.gold} strokeWidth={1.6} strokeLinecap="round" />
                    <Line x1={8} y1={2} x2={8} y2={6} stroke={colors.gold} strokeWidth={1.6} strokeLinecap="round" />
                    <Line x1={3} y1={10} x2={21} y2={10} stroke={colors.gold} strokeWidth={1.6} />
                    <Path d="M8 14h2v2H8z" fill={colors.gold} />
                  </Svg>
                )}
                {index === 2 && (
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                      stroke={colors.gold}
                      strokeWidth={1.6}
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </Svg>
                )}
                {index === 3 && (
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
                      stroke={colors.gold}
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </Svg>
                )}
              </View>
              <View style={styles.earnInfo}>
                <Text style={styles.earnLabel}>{method.label}</Text>
                <Text style={styles.earnDescription}>{method.description}</Text>
              </View>
              <View style={styles.earnBadge}>
                <Text style={styles.earnBadgeText}>+{method.coins}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Transaction History */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Transaction History</Text>
          </View>
          {MOCK_TRANSACTIONS.map((tx, index) => (
            <View
              key={tx.id}
              style={[styles.txRow, index > 0 && styles.txRowBorder]}
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
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  headerLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: '#a39e96',
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  balanceAmount: {
    fontFamily: fontFamilies.heading,
    fontSize: 48,
    color: colors.textWhite,
  },
  balanceLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.gold,
    marginTop: 4,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  balanceSubtext: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 4,
  },
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

  // Earn methods
  earnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  earnRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
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
  earnDescription: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
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

  // Transactions
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  txRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
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
});
