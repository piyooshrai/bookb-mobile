import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

export default function BookingConfirmation() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    serviceId: string; serviceName: string; servicePrice: string; serviceDuration: string;
    stylistId: string; stylistName: string; date: string; time: string;
  }>();
  const [comment, setComment] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <Path d="M20 6L9 17l-5-5" stroke={colors.textWhite} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>Your appointment has been requested</Text>

          <View style={styles.successCard}>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Service</Text>
              <Text style={styles.successValue}>{params.serviceName || 'Service'}</Text>
            </View>
            <View style={styles.successDivider} />
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Stylist</Text>
              <Text style={styles.successValue}>{params.stylistName || 'Stylist'}</Text>
            </View>
            <View style={styles.successDivider} />
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Date & Time</Text>
              <Text style={styles.successValue}>{params.date || 'Date'} at {params.time || 'Time'}</Text>
            </View>
            <View style={styles.successDivider} />
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Total</Text>
              <Text style={styles.successPrice}>${params.servicePrice || '0'}</Text>
            </View>
          </View>

          <Text style={styles.successNote}>You'll receive a notification once the salon confirms your appointment.</Text>

          <TouchableOpacity style={styles.doneButton} onPress={() => router.replace('/(customer)/')} activeOpacity={0.7}>
            <Text style={styles.doneButtonText}>BACK TO HOME</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.anotherButton} onPress={() => router.replace('/(customer)/book/')} activeOpacity={0.7}>
            <Text style={styles.anotherButtonText}>Book Another</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.title}>Review Booking</Text>
            <Text style={styles.subtitle}>Confirm your appointment details</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Service */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={10} stroke={colors.gold} strokeWidth={1.8} />
              <Path d="M8 12s1.5 4 4 4 4-4 4-4" stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.cardLabel}>SERVICE</Text>
          </View>
          <Text style={styles.cardMainText}>{params.serviceName || 'Haircut & Style'}</Text>
          <View style={styles.cardMeta}>
            <Text style={styles.cardMetaText}>{params.serviceDuration || '45 min'}</Text>
            <View style={styles.dot} />
            <Text style={styles.cardPriceText}>${params.servicePrice || '65'}</Text>
          </View>
        </View>

        {/* Stylist */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Circle cx={12} cy={7} r={4} stroke={colors.gold} strokeWidth={1.8} />
            </Svg>
            <Text style={styles.cardLabel}>STYLIST</Text>
          </View>
          <Text style={styles.cardMainText}>{params.stylistName || 'Any Stylist'}</Text>
        </View>

        {/* Date & Time */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={4} width={18} height={18} rx={2} stroke={colors.gold} strokeWidth={1.8} />
              <Line x1={16} y1={2} x2={16} y2={6} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={8} y1={2} x2={8} y2={6} stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" />
              <Line x1={3} y1={10} x2={21} y2={10} stroke={colors.gold} strokeWidth={1.8} />
            </Svg>
            <Text style={styles.cardLabel}>DATE & TIME</Text>
          </View>
          <Text style={styles.cardMainText}>{params.date || 'Today'}</Text>
          <Text style={styles.cardSubText}>{params.time || '10:00 AM'}</Text>
        </View>

        {/* Comment */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardLabel}>NOTE (OPTIONAL)</Text>
          </View>
          <TextInput
            style={styles.commentInput}
            placeholder="Any special requests or notes for your stylist..."
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={3}
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top"
          />
        </View>

        {/* Price Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{params.serviceName || 'Service'}</Text>
            <Text style={styles.summaryValue}>${params.servicePrice || '65'}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>${params.servicePrice || '65'}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} activeOpacity={0.7}>
          <Text style={styles.confirmText}>CONFIRM BOOKING</Text>
          <Text style={styles.confirmPrice}>${params.servicePrice || '65'}</Text>
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
  card: { backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  cardLabel: { fontFamily: fontFamilies.bodySemiBold, fontSize: 10, color: colors.gold, letterSpacing: 1.5 },
  cardMainText: { fontFamily: fontFamilies.bodyMedium, fontSize: 16, color: colors.textPrimary, marginBottom: 2 },
  cardSubText: { fontFamily: fontFamilies.body, fontSize: 14, color: colors.textSecondary },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  cardMetaText: { fontFamily: fontFamilies.body, fontSize: 13, color: colors.textSecondary },
  cardPriceText: { fontFamily: fontFamilies.heading, fontSize: 15, color: colors.textPrimary },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.textTertiary },
  commentInput: { fontFamily: fontFamilies.body, fontSize: 14, color: colors.textPrimary, backgroundColor: colors.offWhite, borderRadius: 10, padding: 12, minHeight: 80 },
  summaryCard: { backgroundColor: colors.navy, borderRadius: 14, padding: 18 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontFamily: fontFamilies.body, fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  summaryValue: { fontFamily: fontFamilies.bodyMedium, fontSize: 14, color: colors.textWhite },
  summaryDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 12 },
  summaryTotalLabel: { fontFamily: fontFamilies.bodySemiBold, fontSize: 16, color: colors.textWhite },
  summaryTotalValue: { fontFamily: fontFamilies.heading, fontSize: 22, color: colors.gold },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 34 },
  confirmButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: colors.gold, borderRadius: 12, paddingVertical: 16 },
  confirmText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 14, color: colors.white, letterSpacing: 2 },
  confirmPrice: { fontFamily: fontFamilies.heading, fontSize: 16, color: colors.white },
  // Success screen
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successTitle: { fontFamily: fontFamilies.heading, fontSize: 26, color: colors.textPrimary, marginBottom: 8 },
  successSubtitle: { fontFamily: fontFamilies.body, fontSize: 14, color: colors.textSecondary, marginBottom: 28 },
  successCard: { backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 20, width: '100%', marginBottom: 20 },
  successRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  successLabel: { fontFamily: fontFamilies.body, fontSize: 13, color: colors.textSecondary },
  successValue: { fontFamily: fontFamilies.bodyMedium, fontSize: 13, color: colors.textPrimary, textAlign: 'right', flex: 1, marginLeft: 12 },
  successPrice: { fontFamily: fontFamilies.heading, fontSize: 18, color: colors.gold },
  successDivider: { height: 1, backgroundColor: colors.borderLight, marginVertical: 8 },
  successNote: { fontFamily: fontFamilies.body, fontSize: 13, color: colors.textTertiary, textAlign: 'center', marginBottom: 28, lineHeight: 20 },
  doneButton: { backgroundColor: colors.navy, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 32, width: '100%', alignItems: 'center', marginBottom: 12 },
  doneButtonText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 14, color: colors.white, letterSpacing: 2 },
  anotherButton: { paddingVertical: 12 },
  anotherButtonText: { fontFamily: fontFamilies.bodySemiBold, fontSize: 14, color: colors.gold },
});
