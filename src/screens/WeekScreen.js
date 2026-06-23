// src/screens/WeekScreen.js
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { CATEGORIES } from '../data/sampleTasks';
import { SectionHeader } from '../components';

export default function WeekScreen({ tasks, onAddTask }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const getTasksForDate = (date) =>
    tasks.filter((t) => t.date === format(date, 'yyyy-MM-dd'));

  const getCompletionForDate = (date) => {
    const dayTasks = getTasksForDate(date);
    if (dayTasks.length === 0) return 0;
    return dayTasks.filter((t) => t.completed).length / dayTasks.length;
  };

  // Week totals
  const weekTasks = weekDays.flatMap(getTasksForDate);
  const weekCompleted = weekTasks.filter((t) => t.completed).length;
  const weekRate = weekTasks.length > 0 ? Math.round((weekCompleted / weekTasks.length) * 100) : 0;
  const focusMins = weekTasks
    .filter((t) => t.category === 'focus' && t.completed)
    .reduce((sum, t) => sum + ((t.endHour * 60 + t.endMinute) - (t.startHour * 60 + t.startMinute)), 0);

  // Category breakdown
  const catBreakdown = Object.keys(CATEGORIES).map((key) => {
    const catTasks = weekTasks.filter((t) => t.category === key);
    return { key, count: catTasks.length, completed: catTasks.filter((t) => t.completed).length };
  }).filter((c) => c.count > 0).sort((a, b) => b.count - a.count);

  const maxCat = Math.max(...catBreakdown.map((c) => c.count), 1);

  // Upcoming tasks
  const upcoming = tasks
    .filter((t) => !t.completed && t.date >= todayStr)
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return (a.startHour * 60 + a.startMinute) - (b.startHour * 60 + b.startMinute);
    })
    .slice(0, 5);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              Week {format(weekStart, 'w')} · {format(weekStart, 'MMMM yyyy')}
            </Text>
            <Text style={styles.title}>Overview</Text>
          </View>
          <View style={styles.monthNav}>
            <TouchableOpacity style={styles.navBtn}>
              <Text style={styles.navBtnText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.navLabel}>{format(selectedDate, 'MMM')}</Text>
            <TouchableOpacity style={styles.navBtn}>
              <Text style={styles.navBtnText}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 7-day grid ── */}
        <View style={styles.weekGrid}>
          {/* Day labels */}
          <View style={styles.weekLabelRow}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <Text key={i} style={[styles.weekDayLabel, i >= 5 && styles.weekendLabel]}>{d}</Text>
            ))}
          </View>
          {/* Day cells */}
          <View style={styles.weekDayRow}>
            {weekDays.map((date, i) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const isToday = dateStr === todayStr;
              const isSelected = isSameDay(date, selectedDate);
              const completion = getCompletionForDate(date);
              const taskCount = getTasksForDate(date).length;

              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedDate(date)}
                  activeOpacity={0.7}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    isToday && !isSelected && styles.dayCellToday,
                  ]}
                >
                  <Text style={[
                    styles.dayCellNum,
                    isSelected && styles.dayCellNumSelected,
                    isToday && !isSelected && styles.dayCellNumToday,
                  ]}>
                    {format(date, 'd')}
                  </Text>
                  <Text style={[styles.dayCellCount, isSelected && { color: 'rgba(255,255,255,0.7)' }]}>
                    {taskCount}
                  </Text>
                  {/* Completion bar */}
                  {taskCount > 0 && (
                    <View style={styles.heatBar}>
                      <View style={[
                        styles.heatBarFill,
                        {
                          width: `${completion * 100}%`,
                          backgroundColor: isSelected ? 'rgba(255,255,255,0.5)' : Colors.amber,
                        },
                      ]} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Week Stats ── */}
        <View style={[styles.weekStats, Shadow.sm]}>
          {[
            { value: weekTasks.length, label: 'Tasks', color: Colors.amber },
            { value: `${Math.floor(focusMins / 60)}h`, label: 'Focus', color: Colors.focus },
            { value: `${weekRate}%`, label: 'Rate', color: Colors.health },
            { value: '🔥 5', label: 'Streak', color: Colors.textPrimary },
          ].map((s, i) => (
            <View key={i} style={[styles.weekStat, i < 3 && styles.weekStatBorder]}>
              <Text style={[styles.weekStatNum, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.weekStatLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Category Breakdown ── */}
        <SectionHeader title="By Category" action="Details →" />
        <View style={styles.catList}>
          {catBreakdown.map(({ key, count, completed }) => {
            const cat = CATEGORIES[key];
            return (
              <View key={key} style={[styles.catRow, Shadow.sm]}>
                <View style={[styles.catIcon, { backgroundColor: cat.bg }]}>
                  <Text style={styles.catEmoji}>{cat.icon}</Text>
                </View>
                <View style={styles.catInfo}>
                  <Text style={styles.catName}>{cat.label}</Text>
                  <View style={styles.catBarTrack}>
                    <View style={[
                      styles.catBarFill,
                      { width: `${(count / maxCat) * 100}%`, backgroundColor: cat.color },
                    ]} />
                  </View>
                </View>
                <Text style={styles.catCount}>{count} tasks</Text>
              </View>
            );
          })}
          {catBreakdown.length === 0 && (
            <Text style={styles.emptyMsg}>No tasks this week yet</Text>
          )}
        </View>

        {/* ── Upcoming ── */}
        <SectionHeader title="Coming Up" action="View all →" />
        <View style={styles.upcomingList}>
          {upcoming.map((task) => {
            const cat = CATEGORIES[task.category] || CATEGORIES.work;
            const isTaskToday = task.date === todayStr;
            const taskDate = isTaskToday ? 'Today' : format(new Date(task.date + 'T00:00'), 'EEE');
            return (
              <View key={task.id} style={[styles.upRow, Shadow.sm]}>
                <Text style={styles.upTime}>
                  {`${task.startHour % 12 || 12}:${String(task.startMinute).padStart(2, '0')}${task.startHour < 12 ? 'am' : 'pm'}`}
                </Text>
                <View style={[styles.upDot, { backgroundColor: cat.color }]} />
                <Text style={styles.upName} numberOfLines={1}>{task.title}</Text>
                <Text style={[styles.upDay, isTaskToday && { color: Colors.amber }]}>{taskDate}</Text>
              </View>
            );
          })}
          {upcoming.length === 0 && (
            <Text style={styles.emptyMsg}>All caught up! 🎉</Text>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={[styles.fab, Shadow.lg]} onPress={onAddTask}>
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  eyebrow: {
    fontSize: 10, fontWeight: '700', letterSpacing: 0.8,
    textTransform: 'uppercase', color: Colors.personal, marginBottom: 2,
  },
  title: {
    fontSize: Typography.xl, fontWeight: '700',
    color: Colors.textPrimary, letterSpacing: -0.4,
  },
  monthNav: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingBottom: 4 },
  navBtn: { padding: 4 },
  navBtnText: { fontSize: 20, color: Colors.textMuted },
  navLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },

  // Week grid
  weekGrid: {
    marginHorizontal: Spacing.xxl,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  weekLabelRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  weekDayLabel: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '600', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 },
  weekendLabel: { color: Colors.amberLight },
  weekDayRow: { flexDirection: 'row', gap: 4 },
  dayCell: {
    flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: Radius.md,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.borderLight,
    position: 'relative', overflow: 'hidden',
  },
  dayCellSelected: { backgroundColor: Colors.amber, borderColor: Colors.amber },
  dayCellToday: { borderColor: Colors.amber, borderWidth: 1.5 },
  dayCellNum: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  dayCellNumSelected: { color: Colors.white },
  dayCellNumToday: { color: Colors.amber },
  dayCellCount: { fontSize: 9, color: Colors.textMuted, fontWeight: '500', marginTop: 1 },
  heatBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: Colors.borderLight },
  heatBarFill: { height: '100%', borderRadius: 1 },

  // Week stats
  weekStats: {
    flexDirection: 'row',
    marginHorizontal: Spacing.xxl,
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.lg,
  },
  weekStat: { flex: 1, alignItems: 'center' },
  weekStatBorder: { borderRightWidth: 1, borderRightColor: Colors.borderLight },
  weekStatNum: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  weekStatLabel: { fontSize: 10, fontWeight: '600', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 },

  // Category
  catList: { paddingHorizontal: Spacing.xxl, gap: Spacing.sm },
  catRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.md,
  },
  catIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  catEmoji: { fontSize: 18 },
  catInfo: { flex: 1 },
  catName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 5 },
  catBarTrack: { height: 4, backgroundColor: Colors.surface, borderRadius: 2, overflow: 'hidden' },
  catBarFill: { height: '100%', borderRadius: 2 },
  catCount: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },

  // Upcoming
  upcomingList: { paddingHorizontal: Spacing.xxl, gap: Spacing.sm },
  upRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md, paddingVertical: 12,
  },
  upTime: { fontSize: 11, fontWeight: '600', color: Colors.textMuted, width: 46 },
  upDot: { width: 8, height: 8, borderRadius: 4 },
  upName: { flex: 1, fontSize: 13, fontWeight: '500', color: Colors.textPrimary },
  upDay: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },

  emptyMsg: { textAlign: 'center', color: Colors.textMuted, fontSize: Typography.sm, paddingVertical: Spacing.xl },

  fab: {
    position: 'absolute', bottom: 100, right: Spacing.xxl,
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: Colors.amber,
    alignItems: 'center', justifyContent: 'center',
  },
  fabIcon: { fontSize: 28, color: Colors.white, lineHeight: 32 },
});
