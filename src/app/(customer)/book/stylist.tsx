import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const STEPS = ['Service', 'Stylist', 'Time'];
const ACTIVE_STEP = 1;

const MOCK_STYLISTS = [
  { id: '1', name: 'Jessica R.', initials: 'JR', role: 'Senior Stylist', specialty: 'Color Specialist', rating: 4.9, reviews: 156, nextAvailable: 'Today 2:00 PM', appointments: 5, color: colors.navy },
  { id: '2', name: 'Marcus T.', initials: 'MT', role: 'Stylist', specialty: 'Barbering & Fades', rating: 4.8, reviews: 98, nextAvailable: 'Today 3:30 PM', appointments: 3, color: colors.gold },
  { id: '3', name: 'Priya S.', initials: 'PS', role: 'Junior Stylist', specialty: 'Styling & Blowouts', rating: 4.7, reviews: 64, nextAvailable: 'Tomorrow 9:00 AM', appointments: 4, color: '#4a6491' },
  { id: '4', name: 'Liam K.', initials: 'LK', role: 'Stylist', specialty: 'Cuts & Treatments', rating: 4.6, reviews: 82, nextAvailable: 'Today 4:00 PM', appointments: 2, color: colors.textSecondary },
];

export default function SelectStylist() {
  const router = useRouter();
  const params = useLocalSearchParams<{ serviceId: string; serviceName: string; servicePrice: string; serviceDuration: string }>();
  const [selectedStylist, setSelectedStylist] = useState<string | null>(null);

  const selected = MOCK_STYLISTS.find((s) => s.id === selectedStylist);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M19 12H5" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M12 19l-7-7 7-7" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Choose Stylist</Text>
            <Text style={styles.subtitle}>{params.serviceName || 'Service'} · {params.serviceDuration || '45 min'}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Step Indicator */}
        <View style={styles.stepContainer}>
          {STEPS.map((step, index) => (
            <View key={step} style={styles.stepItem}>
              <View style={styles.stepRow}>
                <View style={[styles.stepCircle, index === ACTIVE_STEP && styles.stepCircleActive, index < ACTIVE_STEP && styles.stepCircleCompleted]}>
                  {index < ACTIVE_STEP ? (
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Path d="M20 6L9 17l-5-5" stroke={colors.textWhite} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  ) : (
                    <Text style={[styles.stepNumber, (index === ACTIVE_STEP || index < ACTIVE_STEP) && styles.stepNumberActive]}>{index + 1}</Text>
                  )}
                </View>
                {index < STEPS.length - 1 && <View style={[styles.stepLine, index < ACTIVE_STEP && styles.stepLineActive]} />}
              </View>
              <Text style={[styles.stepLabel, index === ACTIVE_STEP && styles.stepLabelActive]}>{step}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Available Stylists</Text>
        <Text style={styles.sectionSubtitle}>Choose who you'd like to see</Text>

        {/* Any Stylist option */}
        <TouchableOpacity
          style={[styles.stylistCard, selectedStylist === 'any' && styles.stylistCardSelected]}
          onPress={() => setSelectedStylist('any')}
          activeOpacity={0.7}
        >
          <View style={styles.stylistCardContent}>
            <View style={[styles.anyAvatar]}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                <Circle cx={9} cy={7} r={4} stroke={colors.textWhite} strokeWidth={1.8} />
                <Path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={colors.textWhite} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <View style={styles.stylistInfo}>
              <Text style={styles.stylistName}>No Preference</Text>
              <Text style={styles.stylistRole}>First available stylist</Text>
            </View>
            <View style={[styles.selectIndicator, selectedStylist === 'any' && styles.selectIndicatorActive]}>
              {selectedStylist === 'any' && (
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path d="M20 6L9 17l-5-5" stroke={colors.white} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {MOCK_STYLISTS.map((stylist) => (
          <TouchableOpacity
            key={stylist.id}
            style={[styles.stylistCard, selectedStylist === stylist.id && styles.stylistCardSelected]}
            onPress={() => setSelectedStylist(stylist.id)}
            activeOpacity={0.7}
          >
            <View style={styles.stylistCardContent}>
              <View style={[styles.avatar, { backgroundColor: stylist.color }]}>
                <Text style={styles.avatarText}>{stylist.initials}</Text>
              </View>
              <View style={styles.stylistInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.stylistName}>{stylist.name}</Text>
                  <View style={styles.ratingBadge}>
                    <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={colors.gold} stroke={colors.gold} strokeWidth={1} />
                    </Svg>
                    <Text style={styles.ratingText}>{stylist.rating}</Text>
                  </View>
                </View>
                <Text style={styles.stylistRole}>{stylist.role} · {stylist.specialty}</Text>
                <View style={styles.availRow}>
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Circle cx={12} cy={12} r={10} stroke={colors.success} strokeWidth={1.8} />
                    <Path d="M12 6v6l4 2" stroke={colors.success} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                  <Text style={styles.availText}>{stylist.nextAvailable}</Text>
                </View>
              </View>
              <View style={[styles.selectIndicator, selectedStylist === stylist.id && styles.selectIndicatorActive]}>
                {selectedStylist === stylist.id && (
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

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.continueButton, !selectedStylist && styles.continueButtonDisabled]}
          activeOpacity={0.7}
          disabled={!selectedStylist}
          onPress={() => {
            router.push({
              pathname: '/(customer)/book/time',
              params: {
                ...params,
                stylistId: selectedStylist,
                stylistName: selected?.name || 'Any Stylist',
              },
            });
          }}
        >
          <Text style={[styles.continueText, !selectedStylist && styles.continueTextDisabled]}>CONTINUE</Text>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path d="M5 12h14M12 5l7 7-7 7" stroke={selectedStylist ? colors.white : colors.textTertiary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmGrey },
  header: { backgroundColor: colors.navy, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  backButton: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fontFamilies.heading, fontSize: 22, color: colors.textWhite, marginBottom: 2 },
  subtitle: { fontFamily: fontFamilies.body, fontSize: 13, color: '#a39e96' },
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 12 },
  stepContainer: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 4 },
  stepItem: { alignItems: 'center', flex: 1 },
  stepRow: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center' },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.offWhite, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  stepCircleActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  stepCircleCompleted: { backgroundColor: colors.gold, borderColor: colors.gold },
  stepNumber: { fontFamily: fontFamilies.bodySemiBold, fontSize: 12, color: colors.textTertiary },
  stepNumberActive: { color: colors.textWhite },
  stepLine: { flex: 1, height: 1.5, backgroundColor: colors.border },
  stepLineActive: { backgroundColor: colors.gold },
  stepLabel: { fontFamily: fontFamilies.body, fontSize: 11, color: colors.textTertiary, marginTop: 6 },
  stepLabelActive: { fontFamily: fontFamilies.bodySemiBold, color: colors.navy },
  sectionTitle: { fontFamily: fontFamilies.bodySemiBold, fontSize: 15, color: colors.textPrimary, marginTop: 4 },
  sectionSubtitle: { fontFamily: fontFamilies.body, fontSize: 12, color: colors.textSecondary },
  stylistCard: { backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16 },
  stylistCardSelected: { borderColor: colors.navy, borderWidth: 1.5, backgroundColor: 'rgba(26,39,68,0.03)' },
  stylistCardContent: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 16, color: colors.textWhite },
  anyAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  stylistInfo: { flex: 1, marginLeft: 14 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  stylistName: { fontFamily: fontFamilies.bodyMedium, fontSize: 15, color: colors.textPrimary },
  stylistRole: { fontFamily: fontFamilies.body, fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(196,151,61,0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  ratingText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 11, color: colors.gold },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  availText: { fontFamily: fontFamilies.bodyMedium, fontSize: 11, color: colors.success },
  selectIndicator: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  selectIndicatorActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 34 },
  continueButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.gold, borderRadius: 12, paddingVertical: 16 },
  continueButtonDisabled: { backgroundColor: colors.offWhite },
  continueText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 14, color: colors.white, letterSpacing: 2 },
  continueTextDisabled: { color: colors.textTertiary },
});
