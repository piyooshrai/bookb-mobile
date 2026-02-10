import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const STEPS = ['Salon', 'Service', 'Stylist', 'Time'];
const ACTIVE_STEP = 0;

const MOCK_SALONS = [
  {
    id: '1',
    name: 'Luxe Hair Studio',
    rating: 4.9,
    reviews: 284,
    distance: '0.3 mi',
    speciality: 'Color & Styling',
    address: '142 West 57th St',
  },
  {
    id: '2',
    name: 'The Grooming Room',
    rating: 4.7,
    reviews: 156,
    distance: '0.8 mi',
    speciality: 'Barbering & Fades',
    address: '89 East 42nd St',
  },
  {
    id: '3',
    name: 'Bella Vita Salon',
    rating: 4.8,
    reviews: 312,
    distance: '1.2 mi',
    speciality: 'Bridal & Events',
    address: '220 Madison Ave',
  },
  {
    id: '4',
    name: 'Urban Cuts',
    rating: 4.6,
    reviews: 98,
    distance: '1.5 mi',
    speciality: 'Modern Cuts & Texture',
    address: '55 Spring St',
  },
  {
    id: '5',
    name: 'Serenity Beauty Bar',
    rating: 4.9,
    reviews: 201,
    distance: '2.1 mi',
    speciality: 'Extensions & Treatments',
    address: '310 Bleecker St',
  },
];

export default function BookAppointment() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Book Appointment</Text>
        <Text style={styles.subtitle}>Find your perfect salon</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Step Indicator */}
        <View style={styles.stepContainer}>
          {STEPS.map((step, index) => (
            <View key={step} style={styles.stepItem}>
              <View style={styles.stepRow}>
                <View
                  style={[
                    styles.stepCircle,
                    index === ACTIVE_STEP && styles.stepCircleActive,
                    index < ACTIVE_STEP && styles.stepCircleCompleted,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNumber,
                      (index === ACTIVE_STEP || index < ACTIVE_STEP) && styles.stepNumberActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>
                {index < STEPS.length - 1 && (
                  <View
                    style={[
                      styles.stepLine,
                      index < ACTIVE_STEP && styles.stepLineActive,
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  index === ACTIVE_STEP && styles.stepLabelActive,
                ]}
              >
                {step}
              </Text>
            </View>
          ))}
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>Choose a Salon</Text>
        <Text style={styles.sectionSubtitle}>Sorted by distance from you</Text>

        {/* Salon List */}
        {MOCK_SALONS.map((salon) => (
          <TouchableOpacity key={salon.id} style={styles.salonCard} activeOpacity={0.7}>
            <View style={styles.salonCardContent}>
              <View style={styles.salonAvatar}>
                <Text style={styles.salonInitial}>{salon.name[0]}</Text>
              </View>
              <View style={styles.salonInfo}>
                <Text style={styles.salonName}>{salon.name}</Text>
                <Text style={styles.salonSpeciality}>{salon.speciality}</Text>
                <Text style={styles.salonAddress}>{salon.address}</Text>
                <View style={styles.salonMeta}>
                  {/* Star icon */}
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                      fill={colors.gold}
                      stroke={colors.gold}
                      strokeWidth={1}
                    />
                  </Svg>
                  <Text style={styles.salonRating}>{salon.rating}</Text>
                  <Text style={styles.salonReviews}>({salon.reviews})</Text>
                  <View style={styles.metaDot} />
                  {/* Location pin icon */}
                  <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                      stroke={colors.textTertiary}
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <Circle cx={12} cy={10} r={3} stroke={colors.textTertiary} strokeWidth={1.8} />
                  </Svg>
                  <Text style={styles.salonDistance}>{salon.distance}</Text>
                </View>
              </View>
              {/* Chevron */}
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M9 18l6-6-6-6"
                  stroke={colors.textTertiary}
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
          </TouchableOpacity>
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
  bodyContent: { padding: 20, gap: 12 },

  // Step indicator
  stepContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 4,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.offWhite,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  stepCircleCompleted: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  stepNumber: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.textTertiary,
  },
  stepNumberActive: {
    color: colors.textWhite,
  },
  stepLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: colors.border,
  },
  stepLineActive: {
    backgroundColor: colors.gold,
  },
  stepLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 6,
  },
  stepLabelActive: {
    fontFamily: fontFamilies.bodySemiBold,
    color: colors.navy,
  },

  // Section
  sectionTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
    marginTop: 4,
  },
  sectionSubtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },

  // Salon card
  salonCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  salonCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salonAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  salonInitial: {
    fontFamily: fontFamilies.heading,
    fontSize: 20,
    color: colors.textWhite,
  },
  salonInfo: {
    flex: 1,
    paddingLeft: 14,
  },
  salonName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  salonSpeciality: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  salonAddress: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 1,
  },
  salonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 3,
  },
  salonRating: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.gold,
  },
  salonReviews: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textTertiary,
    marginHorizontal: 4,
  },
  salonDistance: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
    marginLeft: 2,
  },
});
