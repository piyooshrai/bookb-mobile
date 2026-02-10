import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

interface ToggleRowProps {
  label: string;
  description: string;
  value: boolean;
  onToggle: (val: boolean) => void;
}

function ToggleRow({ label, description, value, onToggle }: ToggleRowProps) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.borderLight, true: colors.gold }}
        thumbColor={colors.white}
      />
    </View>
  );
}

interface ReminderRowProps {
  label: string;
  value: string;
}

function ReminderRow({ label, value }: ReminderRowProps) {
  return (
    <View style={styles.reminderRow}>
      <Text style={styles.reminderLabel}>{label}</Text>
      <TouchableOpacity style={styles.reminderSelector} activeOpacity={0.7}>
        <Text style={styles.reminderValue}>{value}</Text>
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path d="M6 9l6 6 6-6" stroke={colors.textSecondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </TouchableOpacity>
    </View>
  );
}

export default function NotificationSettingsScreen() {
  // Push notification toggles
  const [newBookings, setNewBookings] = useState(true);
  const [cancellations, setCancellations] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [staffUpdates, setStaffUpdates] = useState(false);
  const [paymentAlerts, setPaymentAlerts] = useState(true);

  // Email notification toggles
  const [dailySummary, setDailySummary] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [newClientSignup, setNewClientSignup] = useState(false);
  const [lowInventory, setLowInventory] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {/* Push Notifications */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Push Notifications</Text>
          </View>
          <ToggleRow
            label="New Bookings"
            description="Get notified when a client books an appointment"
            value={newBookings}
            onToggle={setNewBookings}
          />
          <ToggleRow
            label="Cancellations"
            description="Alerts when appointments are cancelled"
            value={cancellations}
            onToggle={setCancellations}
          />
          <ToggleRow
            label="Reminders"
            description="Upcoming appointment reminders"
            value={reminders}
            onToggle={setReminders}
          />
          <ToggleRow
            label="Staff Updates"
            description="Schedule changes and staff notifications"
            value={staffUpdates}
            onToggle={setStaffUpdates}
          />
          <ToggleRow
            label="Payment Alerts"
            description="Payment received and payout notifications"
            value={paymentAlerts}
            onToggle={setPaymentAlerts}
          />
        </View>

        {/* Email Notifications */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M22 6l-10 7L2 6" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Email Notifications</Text>
          </View>
          <ToggleRow
            label="Daily Summary"
            description="End of day summary of all activity"
            value={dailySummary}
            onToggle={setDailySummary}
          />
          <ToggleRow
            label="Weekly Report"
            description="Weekly performance and earnings report"
            value={weeklyReport}
            onToggle={setWeeklyReport}
          />
          <ToggleRow
            label="New Client Signup"
            description="When a new client registers with your salon"
            value={newClientSignup}
            onToggle={setNewClientSignup}
          />
          <ToggleRow
            label="Low Inventory Alert"
            description="When product stock is running low"
            value={lowInventory}
            onToggle={setLowInventory}
          />
        </View>

        {/* Reminder Settings */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M12 6v6l4 2" stroke={colors.navy} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.cardTitle}>Reminder Settings</Text>
          </View>
          <ReminderRow label="Client reminder" value="24 hours before" />
          <ReminderRow label="Staff reminder" value="1 hour before" />
          <ReminderRow label="Follow-up message" value="2 days after" />
        </View>
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
  body: { flex: 1 },
  bodyContent: { padding: 20 },

  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },

  // Toggle Row
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 12,
  },
  toggleLabel: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  toggleDescription: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.textTertiary,
  },

  // Reminder Row
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  reminderLabel: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  reminderSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.offWhite,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  reminderValue: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
