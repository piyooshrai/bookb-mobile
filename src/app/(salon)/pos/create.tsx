import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const services = [
  { id: '1', name: 'Haircut & Style', price: 65 },
  { id: '2', name: 'Blowout', price: 45 },
  { id: '3', name: 'Balayage', price: 185 },
  { id: '4', name: 'Root Touch-Up', price: 85 },
  { id: '5', name: 'Keratin Treatment', price: 220 },
  { id: '6', name: 'Deep Conditioning', price: 55 },
];

const paymentMethods = ['Card', 'Cash', 'Apple Pay'];

export default function CreatePOSScreen() {
  const router = useRouter();
  const [clientName, setClientName] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [tip, setTip] = useState('');

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const servicesTotal = selectedServices.reduce((sum, serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return sum + (service?.price || 0);
  }, 0);

  const tipAmount = parseFloat(tip.replace(/[^0-9.]/g, '')) || 0;
  const total = servicesTotal + tipAmount;

  const handleCompleteTransaction = () => {
    Alert.alert('Success', 'Transaction completed', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
              <Path d="M15 18l-6-6 6-6" stroke={colors.textWhite} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>New Transaction</Text>
            <Text style={styles.subtitle}>Create a point of sale entry</Text>
          </View>
        </View>
      </View>

      {/* Body */}
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {/* Client Name */}
        <View>
          <Text style={styles.sectionTitle}>Client Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Client name"
            placeholderTextColor="#a39e96"
            value={clientName}
            onChangeText={setClientName}
          />
        </View>

        {/* Services */}
        <View>
          <Text style={styles.sectionTitle}>Select Services</Text>
          <View style={{ gap: 10 }}>
            {services.map(service => {
              const isSelected = selectedServices.includes(service.id);
              return (
                <TouchableOpacity
                  key={service.id}
                  style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
                  onPress={() => toggleService(service.id)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.servicePrice}>${service.price}</Text>
                  </View>
                  {isSelected && (
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                      <Circle cx={12} cy={12} r={10} fill={colors.gold} />
                      <Path d="M8 12l2 2 4-4" stroke={colors.white} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Payment Method */}
        <View>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={{ gap: 10 }}>
            {paymentMethods.map(method => {
              const isSelected = paymentMethod === method;
              return (
                <TouchableOpacity
                  key={method}
                  style={styles.radioCard}
                  onPress={() => setPaymentMethod(method)}
                >
                  <View style={styles.radioOuter}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>{method}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Add Tip */}
        <View>
          <Text style={styles.sectionTitle}>Add Tip</Text>
          <TextInput
            style={styles.input}
            placeholder="$0.00"
            placeholderTextColor="#a39e96"
            value={tip}
            onChangeText={setTip}
            keyboardType="numeric"
          />
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Services</Text>
            <Text style={styles.summaryValue}>${servicesTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tip</Text>
            <Text style={styles.summaryValue}>${tipAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.button} onPress={handleCompleteTransaction}>
          <Text style={styles.buttonText}>COMPLETE TRANSACTION</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmGrey,
  },
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
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
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
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 20,
    gap: 12,
  },
  sectionTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
    marginTop: 4,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  serviceCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceCardSelected: {
    borderColor: colors.gold,
    borderWidth: 1.5,
    backgroundColor: 'rgba(196,151,61,0.03)',
  },
  serviceName: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  servicePrice: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  radioCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.navy,
  },
  radioLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  summary: {
    backgroundColor: colors.navy,
    borderRadius: 14,
    padding: 18,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  summaryValue: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textWhite,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 4,
  },
  totalLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 16,
    color: colors.textWhite,
  },
  totalValue: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.gold,
  },
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
  button: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.white,
    letterSpacing: 2,
  },
});
