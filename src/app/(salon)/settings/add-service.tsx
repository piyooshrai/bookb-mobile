import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { useCreateService } from '@/hooks/useServices';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AddServiceScreen() {
  const router = useRouter();
  const isDemo = useAuthStore((s) => s.isDemo);
  const salonId = useAuthStore((s) => s.salonId);

  const createServiceMutation = useCreateService();

  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [isMainService, setIsMainService] = useState(true);
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [leadTime, setLeadTime] = useState('');
  const [breakTime, setBreakTime] = useState('');

  const handleSave = () => {
    if (isDemo) {
      Alert.alert('Success', 'Service added', [
        { text: 'OK', onPress: () => router.back() },
      ]);
      return;
    }

    if (!serviceName.trim()) {
      Alert.alert('Validation', 'Please enter a service name');
      return;
    }

    createServiceMutation.mutate(
      {
        title: serviceName.trim(),
        description: description.trim(),
        charges: parseFloat(price) || 0,
        requiredTime: parseInt(duration) || 30,
        leadTime: parseInt(leadTime) || 0,
        breakTime: parseInt(breakTime) || 0,
        isMainService,
        salon: salonId || undefined,
      },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Service added', [
            { text: 'OK', onPress: () => router.back() },
          ]);
        },
        onError: (err: any) => {
          Alert.alert('Error', err?.message || 'Failed to create service');
        },
      },
    );
  };

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
          <View style={styles.headerTitleArea}>
            <Text style={styles.title}>Add Service</Text>
            <Text style={styles.subtitle}>Create a new service offering</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Service Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Service Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Haircut & Style"
            placeholderTextColor={colors.textTertiary}
            value={serviceName}
            onChangeText={setServiceName}
          />
        </View>

        {/* Description */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the service..."
            placeholderTextColor={colors.textTertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Category - Main Service Toggle */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleOption, isMainService && styles.toggleOptionActive]}
              onPress={() => setIsMainService(true)}
              activeOpacity={0.7}
            >
              <View style={[styles.toggleRadio, isMainService && styles.toggleRadioActive]}>
                {isMainService && <View style={styles.toggleRadioDot} />}
              </View>
              <Text style={[styles.toggleText, isMainService && styles.toggleTextActive]}>Main Service</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleOption, !isMainService && styles.toggleOptionActive]}
              onPress={() => setIsMainService(false)}
              activeOpacity={0.7}
            >
              <View style={[styles.toggleRadio, !isMainService && styles.toggleRadioActive]}>
                {!isMainService && <View style={styles.toggleRadioDot} />}
              </View>
              <Text style={[styles.toggleText, !isMainService && styles.toggleTextActive]}>Add-On Service</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Price ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 65"
            placeholderTextColor={colors.textTertiary}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>

        {/* Duration */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 45"
            placeholderTextColor={colors.textTertiary}
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />
        </View>

        {/* Lead Time & Break Time */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Scheduling</Text>
          <View style={styles.doubleRow}>
            <View style={styles.halfField}>
              <Text style={styles.subLabel}>Lead Time (min)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 15"
                placeholderTextColor={colors.textTertiary}
                value={leadTime}
                onChangeText={setLeadTime}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.subLabel}>Break Time (min)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 10"
                placeholderTextColor={colors.textTertiary}
                value={breakTime}
                onChangeText={setBreakTime}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Bottom spacer for save button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8} disabled={createServiceMutation.isPending}>
          {createServiceMutation.isPending ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>SAVE SERVICE</Text>
          )}
        </TouchableOpacity>
      </View>
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
  headerTitleArea: { flex: 1 },
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
  bodyContent: { padding: 20, gap: 18 },

  // Form fields
  fieldGroup: {},
  label: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 6,
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
  textArea: {
    minHeight: 80,
    paddingTop: 14,
  },

  // Toggle (Main Service / Add-On)
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
  },
  toggleOptionActive: {
    borderColor: colors.navy,
    backgroundColor: colors.offWhite,
  },
  toggleRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleRadioActive: {
    borderColor: colors.navy,
  },
  toggleRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.navy,
  },
  toggleText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.textPrimary,
  },

  // Double row
  doubleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },

  // Save button
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 34,
    backgroundColor: colors.warmGrey,
  },
  saveButton: {
    backgroundColor: colors.gold,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.white,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
