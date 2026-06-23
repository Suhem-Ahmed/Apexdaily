// src/screens/GoalsScreen.js
import React, { useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, subDays } from 'date-fns';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { CATEGORIES } from '../data/sampleTasks';
import { SectionHeader } from '../components';

export default function GoalsScreen({ tasks }) {
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // Last 14 days completion data
  const last14 = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const date = subDays(new Date(), 13 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayTasks = tasks.filter((t) => t.date === dateStr);
      const rate = dayTasks.length > 0
        ? dayTasks.filter((t) => t.completed).length / dayTasks.length
        : null;
      return { date, dateStr, rate, count: dayTasks.length };
    });
  }, [tasks]);

  // Current streak calculation
  const streak = useMemo(() => {
    let count = 0;
    for (let i = 0; i < 30; i++) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayTasks = tasks.filter((t) => t.date === dateStr);
      if (dayTasks.length === 0) {
        if (i === 0) continue; // today might not have tasks yet
        break;
      }
      const allDone = dayTasks.every((t) => t.completed);
      if (allDone) count++;
      else break;
    }
    return count;
  }, [tasks]);

  // All-time stats
  const totalTasks = tasks.length;
  const totalCompleted = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  const totalFocusMins = tasks
    .filter((t) => t.category === 'focus' && t.completed)
    .reduce((sum, t) => sum + ((t.endHour * 60 + t.endMinute) - (t.startHour * 60 + t.startMinute)), 0);

  // Category totals all-time
  const catTotals = Object.keys(CATEGORIES).map((key) => {
    const catTasks = tasks.filter((t) => t.category === key);
    const completed = catTasks.filter((t) => t.completed).length;
    return { key, total: catTasks.length, completed };
  }).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>Your Progress</Text>
          <Text style={styles.title}>Goals & Insights</Text>
        </View>

        {/* Streak hero card */}
        <View style={[styles.streakCard, Shadow.md]}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakNum}>{streak}</Text>
          <Text style={styles.streakLabel}>
            {streak === 1 ? 'Day Streak' : 'Day Streak'}
          </Text>
          <Text style={styles.streakSub}>
            {streak > 0 ? 'Keep the momentum going!' : 'Complete all tasks today to start a streak'}
          </Text>
        </View>

        {/* All-time stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, Shadow.sm]}>
            <Text style={[styles.statBoxNum, { color: Colors.amber }]}>{totalCompleted}</Text>
            <Text style={styles.statBoxLabel}>Tasks Done</Text>
          </View>
          <View style={[styles.statBox, Shadow.sm]}>
            <Text style={[styles.statBoxNum, { color: Colors.health }]}>{completionRate}%</Text>
            <Text style={styles.statBoxLabel}>Completion</Text>
          </View>
          <View style={[styles.statBox, Shadow.sm]}>
            <Text style={[styles.statBoxNum, { color: Colors.focus }]}>
              {Math.floor(totalFocusMins / 60)}h
            </Text>
            <Text style={styles.statBoxLabel}>Focus Time</Text>
          </View>
        </View>

        {/* 14-day activity */}
        <SectionHeader title="Last 14 Days" />
        <View style={[styles.activityCard, Shadow.sm]}>
          <View style={styles.activityBars}>
            {last14.map((day, i) => {
              const height = day.rate === null ? 4 : Math.max(day.rate * 64, 4);
              const isToday = day.dateStr === todayStr;
              return (
                <View key={i} style={styles.activityBarCol}>
                  <View style={styles.activityBarTrack}>
                    <View style={[
                      styles.activityBarFill,
                      {
                        height,
                        backgroundColor: day.rate === null
                          ? Colors.borderLight
                          : day.rate >= 0.8 ? Colors.health
                          : day.rate >= 0.4 ? Colors.amber
                          : Colors.focusBg,
                      },
                      isToday && { borderWidth: 1.5, borderColor: Colors.amber },
                    ]} />
                  </View>
                  <Text style={styles.activityDayLabel}>{format(day.date, 'EEEEE')}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Category totals */}
        <SectionHeader title="All-Time by Category" />
        <View style={styles.catList}>
          {catTotals.map(({ key, total, completed }) => {
            const cat = CATEGORIES[key];
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            return (
              <View key={key} style={[styles.catCard, Shadow.sm]}>
                <View style={[styles.catIconBox, { backgroundColor: cat.bg }]}>
                  <Text style={styles.catEmoji}>{cat.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.catCardTop}>
                    <Text style={styles.catCardName}>{cat.label}</Text>
                    <Text style={[styles.catCardPct, { color: cat.color }]}>{pct}%</Text>
                  </View>
                  <View style={styles.catCardBarTrack}>
                    <View style={[styles.catCardBarFill, { width: `${pct}%`, backgroundColor: cat.color }]} />
                  </View>
                  <Text style={styles.catCardSub}>{completed} of {total} completed</Text>
                </View>
              </View>
            );
          })}
          {catTotals.length === 0 && (
            <Text style={styles.emptyMsg}>Add tasks to see your category breakdown</Text>
          )}
        </View>

        {/* Motivational footer */}
        <View style={styles.footerCard}>
          <Text style={styles.footerText}>
            {completionRate >= 70
              ? "You're crushing it. Consistency compounds — keep showing up."
              : "Every task completed is a vote for the person you're becoming."}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },

  header: { paddingHorizontal: Spacing.xxl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.health, marginBottom: 2 },
  title: { fontSize: Typography.xl, fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.4 },

  streakCard: {
    marginHorizontal: Spacing.xxl,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.amberBorder,
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  streakEmoji: { fontSize: 36, marginBottom: 4 },
  streakNum: { fontSize: 42, fontWeight: '700', color: Colors.amber, letterSpacing: -1 },
  streakLabel: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 2 },
  streakSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 8, textAlign: 'center' },

  statsGrid: { flexDirection: 'row', gap: Spacing.sm, marginHorizontal: Spacing.xxl, marginTop: Spacing.lg },
  statBox: {
    flex: 1, backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderLight,
    paddingVertical: Spacing.lg, alignItems: 'center',
  },
  statBoxNum: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  statBoxLabel: { fontSize: 9, fontWeight: '600', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 3, textAlign: 'center' },

  activityCard: {
    marginHorizontal: Spacing.xxl,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.lg,
  },
  activityBars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 90 },
  activityBarCol: { alignItems: 'center', flex: 1 },
  activityBarTrack: { height: 64, justifyContent: 'flex-end' },
  activityBarFill: { width: 12, borderRadius: 4, minHeight: 4 },
  activityDayLabel: { fontSize: 9, color: Colors.textMuted, marginTop: 6, fontWeight: '600' },

  catList: { paddingHorizontal: Spacing.xxl, gap: Spacing.sm },
  catCard: {
    flexDirection: 'row', gap: Spacing.md, alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.md,
  },
  catIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  catEmoji: { fontSize: 18 },
  catCardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catCardName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  catCardPct: { fontSize: 13, fontWeight: '700' },
  catCardBarTrack: { height: 5, backgroundColor: Colors.surface, borderRadius: 3, overflow: 'hidden' },
  catCardBarFill: { height: '100%', borderRadius: 3 },
  catCardSub: { fontSize: 10, color: Colors.textMuted, marginTop: 4 },

  emptyMsg: { textAlign: 'center', color: Colors.textMuted, fontSize: Typography.sm, paddingVertical: Spacing.xl },

  footerCard: {
    marginHorizontal: Spacing.xxl, marginTop: Spacing.xl,
    backgroundColor: Colors.amberBg, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.amberBorder,
    padding: Spacing.lg,
  },
  footerText: { fontSize: 13, color: Colors.amber, fontWeight: '500', textAlign: 'center', lineHeight: 19, fontStyle: 'italic' },
});
