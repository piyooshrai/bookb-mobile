import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const STEPS = ['Service', 'Stylist', 'Time'];
const ACTIVE_STEP = 0;

const CATEGORIES = ['All', 'Hair', 'Color', 'Treatment', 'Styling'];

const MOCK_SERVICES = [
  { id: '1', name: 'Haircut & Style', duration: '45 min', price: 65, description: 'Precision cut with wash and blowout finish', category: 'Hair' },
  { id: '2', name: 'Balayage', duration: '120 min', price: 185, description: 'Hand-painted highlights for a natural sun-kissed look', category: 'Color' },
  { id: '3', name: 'Blowout', duration: '30 min', price: 45, description: 'Professional wash, dry, and style', category: 'Styling' },
  { id: '4', name: 'Keratin Treatment', duration: '120 min', price: 220, description: 'Smoothing treatment for frizz-free, silky hair', category: 'Treatment' },
  { id: '5', name: 'Color Correction', duration: '150 min', price: 250, description: 'Expert color fix and tone adjustment', category: 'Color' },
  { id: '6', name: 'Root Touch-Up', duration: '60 min', price: 85, description: 'Seamless root color refresh and blend', category: 'Color' },
  { id: '7', name: 'Deep Conditioning', duration: '45 min', price: 55, description: 'Intensive moisture and repair treatment', category: 'Treatment' },
  { id: '8', name: 'Beard Trim', duration: '20 min', price: 25, description: 'Shape and detail for a clean, polished look', category: 'Hair' },
];

export default function BookAppointment() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const filteredServices = activeCategory === 'All'
    ? MOCK_SERVICES
    : MOCK_SERVICES.filter((s) => s.category === activeCategory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M19 12H5" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M12 19l-7-7 7-7" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Book Appointment</Text>
            <Text style={styles.subtitle}>at Luxe Hair Studio</Text>
          </View>
        </View>
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
                  {index < ACTIVE_STEP ? (
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Path d="M20 6L9 17l-5-5" stroke={colors.textWhite} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  ) : (
                    <Text
                      style={[
                        styles.stepNumber,
                        (index === ACTIVE_STEP || index < ACTIVE_STEP) && styles.stepNumberActive,
                      ]}
                    >
                      {index + 1}
                    </Text>
                  )}
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
        <Text style={styles.sectionTitle}>Choose a Service</Text>
        <Text style={styles.sectionSubtitle}>Select the service you'd like to book</Text>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
          style={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryPill,
                activeCategory === cat && styles.categoryPillActive,
              ]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Service List */}
        {filteredServices.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={[
              styles.serviceCard,
              selectedService === service.id && styles.serviceCardSelected,
            ]}
            onPress={() => setSelectedService(service.id)}
            activeOpacity={0.7}
          >
            <View style={styles.serviceCardContent}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                <View style={styles.serviceMeta}>
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Circle cx={12} cy={12} r={10} stroke={colors.textTertiary} strokeWidth={1.8} />
                    <Path d="M12 6v6l4 2" stroke={colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                  <Text style={styles.serviceDuration}>{service.duration}</Text>
                  <View style={styles.metaDot} />
                  <Text style={styles.servicePrice}>${service.price}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.selectIndicator,
                  selectedService === service.id && styles.selectIndicatorActive,
                ]}
              >
                {selectedService === service.id && (
                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                    <Path d="M20 6L9 17l-5-5" stroke={colors.white} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Continue Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedService && styles.continueButtonDisabled,
          ]}
          activeOpacity={0.7}
          disabled={!selectedService}
          onPress={() => {
            const service = MOCK_SERVICES.find((s) => s.id === selectedService);
            if (service) {
              router.push({
                pathname: '/(customer)/book/stylist',
                params: {
                  serviceId: service.id,
                  serviceName: service.name,
                  servicePrice: String(service.price),
                  serviceDuration: service.duration,
                },
              });
            }
          }}
        >
          <Text
            style={[
              styles.continueText,
              !selectedService && styles.continueTextDisabled,
            ]}
          >
            CONTINUE
          </Text>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M5 12h14M12 5l7 7-7 7"
              stroke={selectedService ? colors.white : colors.textTertiary}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textWhite,
    marginBottom: 2,
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
    marginBottom: 0,
  },

  // Category pills
  categoryScroll: {
    marginHorizontal: -20,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryPillActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  categoryText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.textWhite,
  },

  // Service card
  serviceCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  serviceCardSelected: {
    borderColor: colors.navy,
    borderWidth: 1.5,
    backgroundColor: 'rgba(26,39,68,0.03)',
  },
  serviceCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  serviceDescription: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  serviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  serviceDuration: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textTertiary,
  },
  servicePrice: {
    fontFamily: fontFamilies.heading,
    fontSize: 15,
    color: colors.textPrimary,
  },
  selectIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  selectIndicatorActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 34,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 16,
  },
  continueButtonDisabled: {
    backgroundColor: colors.offWhite,
  },
  continueText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.white,
    letterSpacing: 2,
  },
  continueTextDisabled: {
    color: colors.textTertiary,
  },
});
