import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const MOCK_UPCOMING_BOOKING = {
  salon: 'Luxe Hair Studio',
  stylist: 'Jessica R.',
  service: 'Balayage + Trim',
  date: 'Tomorrow',
  time: '10:30 AM',
  price: 185,
};

const MOCK_NEARBY_SALONS = [
  { id: '1', name: 'Luxe Hair Studio', rating: 4.9, reviews: 284, distance: '0.3 mi', speciality: 'Color & Styling' },
  { id: '2', name: 'The Grooming Room', rating: 4.7, reviews: 156, distance: '0.8 mi', speciality: 'Barbering' },
  { id: '3', name: 'Bella Vita Salon', rating: 4.8, reviews: 312, distance: '1.2 mi', speciality: 'Bridal & Events' },
  { id: '4', name: 'Urban Cuts', rating: 4.6, reviews: 98, distance: '1.5 mi', speciality: 'Modern Cuts' },
];

const MOCK_POPULAR_SERVICES = [
  { id: '1', name: 'Haircut & Style', price: 65, duration: '45 min' },
  { id: '2', name: 'Balayage', price: 185, duration: '120 min' },
  { id: '3', name: 'Blowout', price: 45, duration: '30 min' },
  { id: '4', name: 'Keratin Treatment', price: 220, duration: '120 min' },
];

export default function CustomerHomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const greeting = getGreeting();
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
          <View style={styles.coinsChip}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={10} stroke={colors.gold} strokeWidth={1.8} />
              <Text>{''}</Text>
            </Svg>
            <Text style={styles.coinsText}>{user?.coins ?? 100} coins</Text>
          </View>
        </View>
        <View style={styles.searchBar}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Circle cx={11} cy={11} r={8} stroke="rgba(255,255,255,0.35)" strokeWidth={1.6} />
            <Line x1={21} y1={21} x2={16.65} y2={16.65} stroke="rgba(255,255,255,0.35)" strokeWidth={1.6} strokeLinecap="round" />
          </Svg>
          <TextInput
            style={styles.searchInput}
            placeholder="Search salons, services..."
            placeholderTextColor="rgba(255,255,255,0.35)"
            editable={false}
          />
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Upcoming Booking */}
        <View style={styles.upcomingCard}>
          <View style={styles.upcomingHeader}>
            <Text style={styles.upcomingLabel}>UPCOMING BOOKING</Text>
            <Text style={styles.upcomingDate}>{MOCK_UPCOMING_BOOKING.date} · {MOCK_UPCOMING_BOOKING.time}</Text>
          </View>
          <Text style={styles.upcomingSalon}>{MOCK_UPCOMING_BOOKING.salon}</Text>
          <Text style={styles.upcomingService}>{MOCK_UPCOMING_BOOKING.service} with {MOCK_UPCOMING_BOOKING.stylist}</Text>
          <View style={styles.upcomingFooter}>
            <Text style={styles.upcomingPrice}>${MOCK_UPCOMING_BOOKING.price}</Text>
            <TouchableOpacity style={styles.manageButton} activeOpacity={0.7}>
              <Text style={styles.manageText}>Manage</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Nearby Salons */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Nearby Salons</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {MOCK_NEARBY_SALONS.map((salon) => (
            <TouchableOpacity key={salon.id} style={styles.salonRow} activeOpacity={0.7}>
              <View style={styles.salonAvatar}>
                <Text style={styles.salonInitial}>{salon.name[0]}</Text>
              </View>
              <View style={styles.salonInfo}>
                <Text style={styles.salonName}>{salon.name}</Text>
                <Text style={styles.salonSpeciality}>{salon.speciality}</Text>
                <View style={styles.salonMeta}>
                  <Text style={styles.salonRating}>{salon.rating}</Text>
                  <Text style={styles.salonReviews}>({salon.reviews})</Text>
                  <Text style={styles.salonDistance}> · {salon.distance}</Text>
                </View>
              </View>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path d="M9 18l6-6-6-6" stroke={colors.textTertiary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          ))}
        </View>

        {/* Popular Services */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Popular Services</Text>
          </View>
          <View style={styles.servicesGrid}>
            {MOCK_POPULAR_SERVICES.map((svc) => (
              <TouchableOpacity key={svc.id} style={styles.serviceCard} activeOpacity={0.7}>
                <Text style={styles.serviceName}>{svc.name}</Text>
                <Text style={styles.serviceDuration}>{svc.duration}</Text>
                <Text style={styles.servicePrice}>from ${svc.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(customer)/book/')} activeOpacity={0.7}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={4} width={18} height={18} rx={2} stroke={colors.gold} strokeWidth={1.8} />
              <Line x1={16} y1={2} x2={16} y2={6} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={8} y1={2} x2={8} y2={6} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={3} y1={10} x2={21} y2={10} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.actionText}>Book Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(customer)/rewards')} activeOpacity={0.7}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={10} stroke={colors.gold} strokeWidth={1.8} />
              <Path d="M8 14s1.5 2 4 2 4-2 4-2" stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={9} y1={9} x2={9.01} y2={9} stroke={colors.gold} strokeWidth={2.5} strokeLinecap="round" />
              <Line x1={15} y1={9} x2={15.01} y2={9} stroke={colors.gold} strokeWidth={2.5} strokeLinecap="round" />
            </Svg>
            <Text style={styles.actionText}>Rewards</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(customer)/shop/')} activeOpacity={0.7}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Rect x={4} y={8} width={16} height={14} rx={2} stroke={colors.gold} strokeWidth={1.8} />
              <Path d="M8 8V6a4 4 0 0 1 8 0v2" stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.actionText}>Shop</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmGrey },
  header: { backgroundColor: colors.navy, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  greeting: { fontFamily: fontFamilies.body, fontSize: 13, color: '#a39e96' },
  name: { fontFamily: fontFamilies.heading, fontSize: 24, color: colors.textWhite, marginTop: 2 },
  coinsChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(196,151,61,0.15)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  coinsText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 12, color: colors.gold },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14 },
  searchInput: { flex: 1, fontFamily: fontFamilies.body, fontSize: 14, color: colors.textWhite, padding: 0 },
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 16 },
  // Upcoming
  upcomingCard: { backgroundColor: colors.navy, borderRadius: 14, padding: 20 },
  upcomingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  upcomingLabel: { fontFamily: fontFamilies.bodySemiBold, fontSize: 11, color: colors.gold, letterSpacing: 2 },
  upcomingDate: { fontFamily: fontFamilies.bodyMedium, fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  upcomingSalon: { fontFamily: fontFamilies.heading, fontSize: 20, color: colors.textWhite, marginBottom: 4 },
  upcomingService: { fontFamily: fontFamilies.body, fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 16 },
  upcomingFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  upcomingPrice: { fontFamily: fontFamilies.heading, fontSize: 22, color: colors.textWhite },
  manageButton: { backgroundColor: 'rgba(196,151,61,0.2)', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  manageText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 12, color: colors.gold },
  // Card
  card: { backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  cardTitle: { fontFamily: fontFamilies.bodySemiBold, fontSize: 15, color: colors.textPrimary },
  seeAll: { fontFamily: fontFamilies.bodyMedium, fontSize: 13, color: colors.gold },
  // Salon rows
  salonRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.borderLight },
  salonAvatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  salonInitial: { fontFamily: fontFamilies.heading, fontSize: 18, color: colors.textWhite },
  salonInfo: { flex: 1, paddingLeft: 12 },
  salonName: { fontFamily: fontFamilies.bodyMedium, fontSize: 14, color: colors.textPrimary },
  salonSpeciality: { fontFamily: fontFamilies.body, fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  salonMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  salonRating: { fontFamily: fontFamilies.bodySemiBold, fontSize: 12, color: colors.gold },
  salonReviews: { fontFamily: fontFamilies.body, fontSize: 11, color: colors.textTertiary },
  salonDistance: { fontFamily: fontFamilies.body, fontSize: 11, color: colors.textTertiary },
  // Services grid
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 8, gap: 8 },
  serviceCard: { width: '47%', backgroundColor: colors.offWhite, borderRadius: 12, padding: 14, flexGrow: 1 },
  serviceName: { fontFamily: fontFamilies.bodyMedium, fontSize: 13, color: colors.textPrimary, marginBottom: 4 },
  serviceDuration: { fontFamily: fontFamilies.body, fontSize: 11, color: colors.textTertiary },
  servicePrice: { fontFamily: fontFamilies.heading, fontSize: 14, color: colors.textPrimary, marginTop: 8 },
  // Quick actions
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionCard: { flex: 1, backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border, paddingVertical: 20, alignItems: 'center', gap: 8 },
  actionText: { fontFamily: fontFamilies.bodyMedium, fontSize: 12, color: colors.textPrimary },
});
