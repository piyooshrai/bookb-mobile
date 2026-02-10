import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

type NotificationType =
  | 'appointment_confirmed'
  | 'appointment_reminder'
  | 'reward_earned'
  | 'appointment_canceled'
  | 'order_ready';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  group: 'today' | 'yesterday' | 'earlier';
}

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'appointment_confirmed',
    title: 'Appointment Confirmed',
    message: 'Your haircut with Marcus on Feb 12 at 2:00 PM has been confirmed.',
    time: '10 min ago',
    read: false,
    group: 'today',
  },
  {
    id: '2',
    type: 'reward_earned',
    title: 'Reward Earned!',
    message: 'You earned 10 coins for completing your appointment. Keep it up!',
    time: '1 hr ago',
    read: false,
    group: 'today',
  },
  {
    id: '3',
    type: 'appointment_reminder',
    title: 'Upcoming Appointment',
    message: 'Reminder: You have a beard trim with James tomorrow at 11:00 AM.',
    time: '3 hrs ago',
    read: false,
    group: 'today',
  },
  {
    id: '4',
    type: 'order_ready',
    title: 'Order Ready for Pickup',
    message: 'Your hair product order (#4821) is ready for pickup at the front desk.',
    time: '5 hrs ago',
    read: true,
    group: 'today',
  },
  {
    id: '5',
    type: 'appointment_canceled',
    title: 'Appointment Canceled',
    message: 'Your coloring session on Feb 9 has been canceled. Please rebook at your convenience.',
    time: 'Yesterday, 4:30 PM',
    read: true,
    group: 'yesterday',
  },
  {
    id: '6',
    type: 'reward_earned',
    title: 'Referral Bonus!',
    message: 'Emma T. booked their first appointment using your code. You earned 50 coins!',
    time: 'Yesterday, 11:15 AM',
    read: true,
    group: 'yesterday',
  },
  {
    id: '7',
    type: 'appointment_confirmed',
    title: 'Appointment Confirmed',
    message: 'Your deep conditioning treatment with Alicia on Feb 8 at 3:30 PM is confirmed.',
    time: 'Mon, 9:00 AM',
    read: true,
    group: 'earlier',
  },
  {
    id: '8',
    type: 'appointment_reminder',
    title: 'Don\'t Forget!',
    message: 'Your appointment with Marcus is in 1 hour. See you soon!',
    time: 'Mon, 1:00 PM',
    read: true,
    group: 'earlier',
  },
  {
    id: '9',
    type: 'order_ready',
    title: 'Order Shipped',
    message: 'Your online order (#4798) has shipped and is on its way. Track it in your orders.',
    time: 'Sun, 6:45 PM',
    read: true,
    group: 'earlier',
  },
];

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'appointment_confirmed':
      return {
        bgColor: colors.successLight,
        iconColor: colors.successDark,
        icon: (color: string) => (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M20 6L9 17l-5-5"
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        ),
      };
    case 'appointment_reminder':
      return {
        bgColor: colors.infoLight,
        iconColor: colors.infoDark,
        icon: (color: string) => (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={1.8} />
            <Line x1={12} y1={6} x2={12} y2={12} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
            <Line x1={12} y1={12} x2={16} y2={14} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
          </Svg>
        ),
      };
    case 'reward_earned':
      return {
        bgColor: colors.warningLight,
        iconColor: colors.warningDark,
        icon: (color: string) => (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={1.8} />
            <Circle cx={12} cy={12} r={6.5} stroke={color} strokeWidth={1} />
            <Path
              d="M12 8v8M9.5 10.5c0-.83.67-1.5 1.5-1.5h1c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-1c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h1c.83 0 1.5-.67 1.5-1.5"
              stroke={color}
              strokeWidth={1}
              strokeLinecap="round"
            />
          </Svg>
        ),
      };
    case 'appointment_canceled':
      return {
        bgColor: colors.errorLight,
        iconColor: colors.errorDark,
        icon: (color: string) => (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={1.8} />
            <Line x1={15} y1={9} x2={9} y2={15} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
            <Line x1={9} y1={9} x2={15} y2={15} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
          </Svg>
        ),
      };
    case 'order_ready':
      return {
        bgColor: colors.infoLight,
        iconColor: colors.infoDark,
        icon: (color: string) => (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Rect x={2} y={7} width={20} height={14} rx={2} stroke={color} strokeWidth={1.8} />
            <Path d="M16 7V5a4 4 0 0 0-8 0v2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
          </Svg>
        ),
      };
  }
}

function groupLabel(group: Notification['group']): string {
  switch (group) {
    case 'today':
      return 'Today';
    case 'yesterday':
      return 'Yesterday';
    case 'earlier':
      return 'Earlier This Week';
  }
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleNotificationPress = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const groups: Notification['group'][] = ['today', 'yesterday', 'earlier'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Navy header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke={colors.textWhite}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>

          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>

          {unreadCount > 0 ? (
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={handleMarkAllRead}
              activeOpacity={0.7}
            >
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 6L7 17l-4-4"
                  stroke={colors.gold}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M22 10L11 21"
                  stroke={colors.gold}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.markAllText}>Read all</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerSpacer} />
          )}
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {groups.map((group) => {
          const groupNotifications = notifications.filter((n) => n.group === group);
          if (groupNotifications.length === 0) return null;

          return (
            <View key={group} style={styles.section}>
              <Text style={styles.sectionTitle}>{groupLabel(group)}</Text>
              <View style={styles.card}>
                {groupNotifications.map((notification, index) => {
                  const iconConfig = getNotificationIcon(notification.type);
                  return (
                    <TouchableOpacity
                      key={notification.id}
                      style={[
                        styles.notificationRow,
                        !notification.read && styles.notificationRowUnread,
                        index > 0 && styles.rowBorder,
                      ]}
                      activeOpacity={0.7}
                      onPress={() => handleNotificationPress(notification.id)}
                    >
                      <View style={[styles.iconCircle, { backgroundColor: iconConfig.bgColor }]}>
                        {iconConfig.icon(iconConfig.iconColor)}
                      </View>
                      <View style={styles.notificationContent}>
                        <View style={styles.notificationHeader}>
                          <Text
                            style={[
                              styles.notificationTitle,
                              !notification.read && styles.notificationTitleUnread,
                            ]}
                            numberOfLines={1}
                          >
                            {notification.title}
                          </Text>
                          {!notification.read && <View style={styles.unreadDot} />}
                        </View>
                        <Text style={styles.notificationMessage} numberOfLines={2}>
                          {notification.message}
                        </Text>
                        <Text style={styles.notificationTime}>{notification.time}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}

        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                  stroke={colors.textTertiary}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M13.73 21a2 2 0 0 1-3.46 0"
                  stroke={colors.textTertiary}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtext}>
              You're all caught up! We'll let you know when something new comes in.
            </Text>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmGrey },
  header: {
    backgroundColor: colors.navy,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    color: colors.textWhite,
  },
  countBadge: {
    backgroundColor: colors.gold,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    color: colors.white,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(196, 151, 61, 0.15)',
  },
  markAllText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    color: colors.gold,
  },
  headerSpacer: {
    width: 36,
  },

  // Body
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 20 },

  // Section
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: 4,
  },

  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },

  // Notification row
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },
  notificationRowUnread: {
    backgroundColor: '#fdfcfa',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  notificationTitle: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  notificationTitleUnread: {
    fontFamily: fontFamilies.bodySemiBold,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
  },
  notificationMessage: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationTime: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    color: colors.textTertiary,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: fontFamilies.heading,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
