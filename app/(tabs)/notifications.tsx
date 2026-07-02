import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  RefreshControl, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { apiGet, apiPut } from '@/src/utils/api';
import { COLORS, FONTS, SPACING, formatTime } from '@/src/constants/theme';

const NOTIF_ICON: Record<string, string> = {
  follow: '👤',
  reaction: '🤲',
  comment: '💬',
  halaqah_register: '🕌',
  default: '🔔',
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await apiGet('/api/notifications');
      setNotifications(data);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = useCallback(() => { setRefreshing(true); loadData(); }, []);

  const markAllRead = async () => {
    try {
      await apiPut('/api/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {}
  };

  const markRead = async (id: string) => {
    try {
      await apiPut(`/api/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => n.notification_id === id ? { ...n, is_read: true } : n));
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifikasi</Text>
          {unreadCount > 0 && <Text style={styles.unreadBadge}>{unreadCount} belum dibaca</Text>}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity testID="mark-all-read-btn" onPress={markAllRead} style={styles.readAllBtn}>
            <Text style={styles.readAllText}>Tandai semua dibaca</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.notification_id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            testID={`notification-${item.notification_id}`}
            style={[styles.notifCard, !item.is_read && styles.notifUnread]}
            onPress={() => markRead(item.notification_id)}
            activeOpacity={0.8}
          >
            <View style={styles.notifIcon}>
              <Text style={styles.notifIconText}>{NOTIF_ICON[item.type] || NOTIF_ICON.default}</Text>
            </View>
            <View style={styles.notifContent}>
              <Text style={styles.notifMessage}>{item.message}</Text>
              <Text style={styles.notifTime}>{formatTime(item.created_at)}</Text>
            </View>
            {!item.is_read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>Belum ada notifikasi</Text>
            <Text style={styles.emptyText}>Notifikasi akan muncul ketika ada aktivitas di akunmu</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
    backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 22, color: COLORS.primary },
  unreadBadge: { fontFamily: FONTS.medium, fontSize: 12, color: COLORS.gold, marginTop: 2 },
  readAllBtn: { paddingHorizontal: SPACING.sm, paddingVertical: 6 },
  readAllText: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.primary },
  notifCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    marginHorizontal: SPACING.md, marginTop: SPACING.sm,
    borderRadius: 18, padding: SPACING.md, gap: SPACING.sm,
    shadowColor: '#1A2E35', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 2,
  },
  notifUnread: { borderLeftWidth: 3, borderLeftColor: COLORS.primary, backgroundColor: COLORS.quoteBox },
  notifIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  notifIconText: { fontSize: 22 },
  notifContent: { flex: 1 },
  notifMessage: { fontFamily: FONTS.medium, fontSize: 14, color: COLORS.text, lineHeight: 20 },
  notifTime: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: SPACING.xl },
  emptyIcon: { fontSize: 56, marginBottom: SPACING.md },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.text, marginBottom: 8 },
  emptyText: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
});
