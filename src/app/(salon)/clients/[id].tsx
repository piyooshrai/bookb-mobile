import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle, Line, Rect, Polygon } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_CLIENT = {
  name: 'Sarah Mitchell',
  initials: 'SM',
  memberSince: 'Jan 2023',
  email: 'sarah.mitchell@email.com',
  phone: '(212) 555-0147',
  stats: {
    visits: 42,
    spent: 3240,
    avgRating: 4.8,
  },
  preferredStylist: 'Jessica R.',
  notes: 'Prefers warm tones for color. Sensitive scalp - use gentle products. Always wants a blowout finish.',
};

type AppointmentStatus = 'completed' | 'cancelled' | 'confirmed';

interface AppointmentHistory {
  id: string;
  date: string;
  service: string;
  stylist: string;
  amount: number;
  status: AppointmentStatus;
}

const MOCK_HISTORY: AppointmentHistory[] = [
  { id: '1', date: 'Feb 8, 2026', service: 'Balayage + Trim', stylist: 'Jessica R.', amount: 185, status: 'completed' },
  { id: '2', date: 'Jan 28, 2026', service: 'Root Touch-Up', stylist: 'Jessica R.', amount: 95, status: 'completed' },
  { id: '3', date: 'Jan 10, 2026', service: 'Blowout & Style', stylist: 'Marcus T.', amount: 65, status: 'completed' },
  { id: '4', date: 'Dec 18, 2025', service: 'Balayage + Trim', stylist: 'Jessica R.', amount: 185, status: 'completed' },
  { id: '5', date: 'Dec 2, 2025', service: 'Keratin Treatment', stylist: 'Priya S.', amount: 250, status: 'cancelled' },
];

const STATUS_CONFIG: Record<AppointmentStatus, { bg: string; text: string; label: string }> = {
  completed: { bg: colors.successLight, text: colors.successDark, label: 'Completed' },
  cancelled: { bg: colors.errorLight, text: colors.errorDark, label: 'Cancelled' },
  confirmed: { bg: colors.infoLight, text: colors.infoDark, label: 'Confirmed' },
};

interface Product {
  id: string;
  name: string;
  date: string;
  price: number;
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Olaplex No.3 Hair Perfector', date: 'Feb 8, 2026', price: 28.0 },
  { id: '2', name: 'Leave-in Conditioner', date: 'Jan 10, 2026', price: 22.0 },
  { id: '3', name: 'Moroccan Oil Treatment', date: 'Dec 18, 2025', price: 34.0 },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ClientDetailScreen() {
  const router = useRouter();
  const { id, name, phone, email, visits, spent } = useLocalSearchParams();
  const clientName = (name as string) || 'Client';
  const clientInitials = clientName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const client = {
    name: clientName,
    initials: clientInitials,
    memberSince: '',
    email: (email as string) || '',
    phone: (phone as string) || '',
    stats: { visits: parseInt((visits as string) || '0') || 0, spent: parseInt((spent as string) || '0') || 0, avgRating: 0 },
    preferredStylist: '',
    notes: '',
  };
  const [clientNotes, setClientNotes] = useState(client.notes);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backButton}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M19 12H5" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M12 19l-7-7 7-7" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{client.name}</Text>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{client.initials}</Text>
          </View>
          <Text style={styles.profileName}>{client.name}</Text>
          <Text style={styles.memberSince}>Member since {client.memberSince}</Text>
          <View style={styles.contactRow}>
            <View style={styles.contactItem}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M22 6l-10 7L2 6" stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={styles.contactText}>{client.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={styles.contactText}>{client.phone}</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{client.stats.visits}</Text>
            <Text style={styles.statLabel}>Visits</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>${client.stats.spent.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{client.stats.avgRating}</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>

        {/* Preferred Stylist Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill={colors.gold} />
            </Svg>
            <Text style={styles.cardTitle}>Preferred Stylist</Text>
          </View>
          <View style={styles.stylistRow}>
            <View style={styles.stylistAvatar}>
              <Text style={styles.stylistInitial}>J</Text>
            </View>
            <Text style={styles.stylistName}>{client.preferredStylist}</Text>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke={colors.gold} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill={colors.gold} />
            </Svg>
          </View>
        </View>

        {/* Notes Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M14 2v6h6" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Notes</Text>
          </View>
          <TextInput
            style={styles.notesInput}
            multiline
            textAlignVertical="top"
            value={clientNotes}
            onChangeText={setClientNotes}
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        {/* Appointment History Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={10} stroke={colors.navy} strokeWidth={1.8} />
              <Path d="M12 6v6l4 2" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Appointment History</Text>
          </View>
          {MOCK_HISTORY.map((visit) => {
            const statusCfg = STATUS_CONFIG[visit.status];
            return (
              <View key={visit.id} style={styles.historyRow}>
                <View style={styles.historyInfo}>
                  <View style={styles.historyTop}>
                    <Text style={styles.historyService}>{visit.service}</Text>
                    <View style={[styles.historyBadge, { backgroundColor: statusCfg.bg }]}>
                      <Text style={[styles.historyBadgeText, { color: statusCfg.text }]}>{statusCfg.label}</Text>
                    </View>
                  </View>
                  <View style={styles.historyMeta}>
                    <Text style={styles.historyDate}>{visit.date}</Text>
                    <View style={styles.historyDot} />
                    <Text style={styles.historyDate}>with {visit.stylist}</Text>
                  </View>
                </View>
                <Text style={styles.historyAmount}>${visit.amount}</Text>
              </View>
            );
          })}
        </View>

        {/* Products Purchased Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Line x1={3} y1={6} x2={21} y2={6} stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" />
              <Path d="M16 10a4 4 0 0 1-8 0" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Products Purchased</Text>
          </View>
          {MOCK_PRODUCTS.map((product) => (
            <View key={product.id} style={styles.productRow}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDate}>{product.date}</Text>
              </View>
              <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.bookButton} activeOpacity={0.8} onPress={() => router.push('/(salon)/schedule/new')}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={4} width={18} height={18} rx={2} stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Line x1={16} y1={2} x2={16} y2={6} stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={8} y1={2} x2={8} y2={6} stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={3} y1={10} x2={21} y2={10} stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageButton} activeOpacity={0.7}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.messageButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmGrey },
  // Header
  header: {
    backgroundColor: colors.navy,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textWhite,
  },
  // Body
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 16 },
  // Profile
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarLargeText: {
    fontFamily: fontFamilies.heading,
    fontSize: 26,
    color: colors.textWhite,
  },
  profileName: {
    fontFamily: fontFamilies.heading,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  memberSince: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: 16,
  },
  contactRow: {
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    fontFamily: fontFamilies.heading,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
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
  },
  cardTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  // Preferred stylist
  stylistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  stylistAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stylistInitial: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.textWhite,
  },
  stylistName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 15,
    color: colors.textPrimary,
    flex: 1,
  },
  // Notes
  notesInput: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.offWhite,
    borderRadius: 10,
    minHeight: 80,
  },
  // History
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  historyInfo: {
    flex: 1,
  },
  historyTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  historyService: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  historyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  historyBadgeText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 10,
    textTransform: 'capitalize',
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDate: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
  historyDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textTertiary,
    marginHorizontal: 6,
  },
  historyAmount: {
    fontFamily: fontFamilies.heading,
    fontSize: 14,
    color: colors.textPrimary,
  },
  // Products
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  productDate: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  productPrice: {
    fontFamily: fontFamilies.heading,
    fontSize: 14,
    color: colors.textPrimary,
  },
  // Actions
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bookButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.gold,
    paddingVertical: 16,
    borderRadius: 14,
  },
  bookButtonText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textWhite,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageButtonText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.navy,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  bottomSpacer: { height: 20 },
});
