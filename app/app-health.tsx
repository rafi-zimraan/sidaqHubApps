import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS } from '@/src/constants/theme';
import { runHealthCheck, HealthReport, HealthIssue } from '@/src/utils/appHealth';

function SeverityBadge({ severity }: { severity: HealthIssue['severity'] }) {
  const colors = {
    critical: { bg: '#FED7D7', text: '#C53030', icon: 'warning' },
    warning: { bg: '#FEFCBF', text: '#975A16', icon: 'alert-circle' },
    optimization: { bg: '#C6F6D5', text: '#276749', icon: 'bulb' },
    info: { bg: '#BEE3F8', text: '#2B6CB0', icon: 'information-circle' },
  };
  const c = colors[severity];
  return (
    <View style={[styles.severityBadge, { backgroundColor: c.bg }]}>
      <Ionicons name={c.icon as any} size={12} color={c.text} />
      <Text style={[styles.severityText, { color: c.text }]}>{severity}</Text>
    </View>
  );
}

function EffortBadge({ effort }: { effort: HealthIssue['effort'] }) {
  const colors: Record<string, string> = { easy: '#38A169', medium: '#D69E2E', hard: '#E53E3E' };
  const labels: Record<string, string> = { easy: 'Mudah', medium: 'Sedang', hard: 'Sulit' };
  return (
    <View style={[styles.effortBadge, { backgroundColor: colors[effort] + '20' }]}>
      <View style={[styles.effortDot, { backgroundColor: colors[effort] }]} />
      <Text style={[styles.effortText, { color: colors[effort] }]}>{labels[effort]}</Text>
    </View>
  );
}

function IssueCard({ issue, index }: { issue: HealthIssue; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 300, delay: index * 40, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.issueCard, { opacity }]}>
      <TouchableOpacity
        style={styles.issueHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.issueHeaderLeft}>
          <SeverityBadge severity={issue.severity} />
          <Text style={styles.issueCategory}>{issue.category}</Text>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textSecondary} />
      </TouchableOpacity>

      <Text style={styles.issueTitle}>{issue.title}</Text>
      <Text style={styles.issueDesc} numberOfLines={expanded ? undefined : 2}>{issue.description}</Text>

      {expanded && (
        <View style={styles.issueDetail}>
          <View style={styles.recBox}>
            <Ionicons name="bulb-outline" size={16} color={COLORS.gold} style={{ marginRight: 6 }} />
            <Text style={styles.recText}>{issue.recommendation}</Text>
          </View>
          <EffortBadge effort={issue.effort} />
        </View>
      )}
    </Animated.View>
  );
}

function ScoreRing({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 90) return '#38A169';
    if (score >= 70) return '#D69E2E';
    if (score >= 50) return '#DD6B20';
    return '#E53E3E';
  };
  const color = getColor();
  return (
    <View style={[styles.scoreRing, { borderColor: color }]}>
      <Text style={[styles.scoreValue, { color }]}>{score}</Text>
      <Text style={styles.scoreLabel}>Health</Text>
    </View>
  );
}

export default function AppHealthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [report, setReport] = useState<HealthReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<HealthIssue['severity'] | 'all'>('all');

  const scan = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const result = runHealthCheck();
      setReport(result);
      setLoading(false);
    }, 600);
  }, []);

  const filteredIssues = report
    ? filter === 'all'
      ? report.issues
      : report.issues.filter((i) => i.severity === filter)
    : [];

  const filterTabs = [
    { id: 'all' as const, label: `Semua (${report?.totalIssues || 0})` },
    { id: 'critical' as const, label: `Critical (${report?.criticalCount || 0})` },
    { id: 'warning' as const, label: `Warning (${report?.warningCount || 0})` },
    { id: 'optimization' as const, label: `Optimasi (${report?.optimizationCount || 0})` },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Health Check</Text>
        <View style={{ width: 36 }} />
      </View>

      {!report && !loading && (
        <View style={styles.hero}>
          <Ionicons name="heart-circle-outline" size={72} color={COLORS.primary} />
          <Text style={styles.heroTitle}>App Health Check</Text>
          <Text style={styles.heroDesc}>
            Analisis aplikasi secara otomatis untuk mendeteksi masalah performa, keamanan, kualitas kode, dan UX.
            Dapatkan rekomendasi tuning seperti layaknya senior developer.
          </Text>
          <TouchableOpacity style={styles.scanBtn} onPress={scan} activeOpacity={0.85}>
            <Ionicons name="scan-outline" size={20} color="#fff" />
            <Text style={styles.scanBtnText}>Mulai Scan</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Menganalisis aplikasi...</Text>
          <Text style={styles.loadingSub}>Memeriksa dependencies, konfigurasi, performa, keamanan...</Text>
        </View>
      )}

      {report && !loading && (
        <>
          <View style={styles.scoreBar}>
            <ScoreRing score={report.score} />
            <View style={styles.scoreInfo}>
              <Text style={styles.verdict}>{report.verdict}</Text>
              <Text style={styles.summary}>{report.summary}</Text>
            </View>
          </View>

          <View style={styles.filterRow}>
            {filterTabs.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[styles.filterTab, filter === t.id && styles.filterTabActive]}
                onPress={() => setFilter(t.id)}
              >
                <Text style={[styles.filterText, filter === t.id && styles.filterTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredIssues.map((issue, i) => (
              <IssueCard key={issue.id} issue={issue} index={i} />
            ))}
            <TouchableOpacity style={styles.rescanBtn} onPress={scan} activeOpacity={0.85}>
              <Ionicons name="refresh-outline" size={18} color={COLORS.primary} />
              <Text style={styles.rescanText}>Scan Ulang</Text>
            </TouchableOpacity>
            <View style={{ height: 48 }} />
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F7' },
  header: {
    backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingBottom: 16,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 17, color: '#fff' },

  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xl },
  heroTitle: { fontFamily: FONTS.bold, fontSize: 24, color: COLORS.text, marginTop: SPACING.md },
  heroDesc: {
    fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary,
    textAlign: 'center', lineHeight: 22, marginTop: SPACING.sm, marginBottom: SPACING.xl,
  },
  scanBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg, paddingVertical: 14, borderRadius: RADIUS.full, gap: 8,
  },
  scanBtnText: { fontFamily: FONTS.bold, fontSize: 16, color: '#fff' },

  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xl },
  loadingText: { fontFamily: FONTS.semiBold, fontSize: 17, color: COLORS.text, marginTop: SPACING.md },
  loadingSub: {
    fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary,
    textAlign: 'center', marginTop: SPACING.sm,
  },

  scoreBar: {
    flexDirection: 'row', padding: SPACING.md, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: SPACING.md,
  },
  scoreRing: {
    width: 80, height: 80, borderRadius: 40, borderWidth: 5,
    alignItems: 'center', justifyContent: 'center',
  },
  scoreValue: { fontFamily: FONTS.bold, fontSize: 24 },
  scoreLabel: { fontFamily: FONTS.medium, fontSize: 10, color: COLORS.textSecondary, marginTop: -2 },
  scoreInfo: { flex: 1, justifyContent: 'center' },
  verdict: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.text, lineHeight: 20 },
  summary: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginTop: 4, lineHeight: 18 },

  filterRow: {
    flexDirection: 'row', paddingHorizontal: SPACING.sm, paddingVertical: SPACING.sm,
    backgroundColor: '#fff', gap: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  filterTab: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full,
    backgroundColor: '#F4F5F7',
  },
  filterTabActive: { backgroundColor: COLORS.primary },
  filterText: { fontFamily: FONTS.medium, fontSize: 12, color: COLORS.textSecondary },
  filterTextActive: { color: '#fff' },

  listContent: { padding: SPACING.sm },
  issueCard: {
    backgroundColor: '#fff', borderRadius: RADIUS.md, padding: SPACING.md,
    marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border,
  },
  issueHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6,
  },
  issueHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  issueCategory: { fontFamily: FONTS.medium, fontSize: 11, color: COLORS.textSecondary },
  issueTitle: { fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.text, marginBottom: 4 },
  issueDesc: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },

  severityBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full,
  },
  severityText: { fontFamily: FONTS.semiBold, fontSize: 10, textTransform: 'uppercase' },

  issueDetail: { marginTop: SPACING.sm, gap: SPACING.sm },
  recBox: {
    flexDirection: 'row', backgroundColor: '#FFF8E1', borderRadius: RADIUS.sm,
    padding: SPACING.sm, borderWidth: 1, borderColor: COLORS.gold + '30',
  },
  recText: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.text, flex: 1, lineHeight: 20 },

  effortBadge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full, gap: 4,
  },
  effortDot: { width: 6, height: 6, borderRadius: 3 },
  effortText: { fontFamily: FONTS.semiBold, fontSize: 11 },

  rescanBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, marginTop: SPACING.sm, gap: 6,
  },
  rescanText: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.primary },
});
