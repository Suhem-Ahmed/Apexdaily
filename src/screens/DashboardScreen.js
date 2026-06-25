// src/screens/DashboardScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, StatusBar, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, addDays, subDays, isSameDay, parseISO } from 'date-fns';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { TaskCard, SectionHeader, EmptyState } from '../components';
import { CATEGORIES } from '../data/sampleTasks';

const { width } = Dimensions.get('window');
const DAYS_TO_SHOW = 7;

export default function DashboardScreen({ tasks, onToggleTask, onAddTask, onTaskPress, navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [nowTime, setNowTime] = useState(new Date());

  // Live clock tick
  useEffect(() => {
    const timer = setInterval(() => setNowTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Build 7-day date strip centred on today
  const dateStrip = Array.from({ length: DAYS_TO_SHOW }, (_, i) =>
    addDays(new Date(), i - 2)
  );

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const isToday = selectedDateStr === todayStr;

  const dayTasks = tasks.filter((t) => t.date === selectedDateStr)
    .sort((a, b) => a.startHour * 60 + a.startMinute - (b.startHour * 60 + b.startMinute));

  const completedCount = dayTasks.filter((t) => t.completed).length;
  const totalCount = dayTasks.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  const focusMins = dayTasks
    .filter((t) => t.category === 'focus' && t.completed)
    .reduce((sum, t) => sum + ((t.endHour * 60 + t.endMinute) - (t.startHour * 60 + t.startMinute)), 0);

  const nowHour = nowTime.getHours();
  const nowMin = nowTime.getMinutes();
  const nowFormatted = `${nowHour % 12 || 12}:${String(nowMin).padStart(2, '0')} ${nowHour < 12 ? 'AM' : 'PM'}`;

  const remainingTasks = isToday
    ? dayTasks.filter((t) => !t.completed && (t.startHour * 60 + t.startMinute) >= nowHour * 60 + nowMin).length
    : 0;

  // Progress ring (SVG-less approach using border)
  const ringSize = 86;
  const degrees = Math.round(progress * 360);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {nowHour < 12 ? 'Good Morning' : nowHour < 17 ? 'Good Afternoon' : 'Good Evening'}
            </Text>
            <Text style={styles.headerTitle}>Today's Plan</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
        </View>

        {/* ── Date Strip ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateStrip}
          style={{ marginTop: Spacing.xl }}
        >
          {dateStrip.map((date, i) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const isSelected = isSameDay(date, selectedDate);
            const isCurrentDay = dateStr === todayStr;
            const hasTasks = tasks.some((t) => t.date === dateStr);
            return (
              <TouchableOpacity
                key={i}
                onPress={() => setSelectedDate(date)}
                activeOpacity={0.7}
                style={[
                  styles.dateChip,
                  isSelected && styles.dateChipActive,
                ]}
              >
                <Text style={[styles.dayLabel, isSelected && styles.dayLabelActive]}>
                  {format(date, 'EEE').toUpperCase()}
                </Text>
                <Text style={[styles.dayNum, isSelected && styles.dayNumActive]}>
                  {format(date, 'd')}
                </Text>
                {hasTasks && (
                  <View style={[styles.dateDot, isSelected && styles.dateDotActive]} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Now Pill (today only) ── */}
        {isToday && (
          <View style={styles.nowPill}>
            <View style={styles.nowDot} />
            <Text style={styles.nowText}>
              Now — {nowFormatted}
              {remainingTasks > 0 ? ` · ${remainingTasks} task${remainingTasks > 1 ? 's' : ''} remaining` : ' · All clear!'}
            </Text>
          </View>
        )}

        {/* ── Progress + Stats ── */}
        <View style={styles.progressRow}>
          {/* Ring card */}
          <View style={[styles.ringCard, Shadow.sm]}>
            <View style={styles.ringOuter}>
              {/* Simulated progress ring with views */}
              <View style={[styles.ringTrack]} />
              <View style={[styles.ringFill, { transform: [{ rotate: `${degrees}deg` }] }]} />
              <View style={styles.ringCenter}>
                <Text style={styles.ringPct}>{Math.round(progress * 100)}%</Text>
                <Text style={styles.ringLabel}>done</Text>
              </View>
            </View>
            <Text style={styles.ringTitle}>Day Progress</Text>
          </View>

          {/* Stats column */}
          <View style={styles.statsCol}>
            <View style={[styles.miniStat, Shadow.sm]}>
              <Text style={styles.miniStatNum}>
                <Text style={{ color: Colors.amber }}>{completedCount}</Text>/{totalCount}
              </Text>
              <Text style={styles.miniStatLabel}>Tasks Complete</Text>
            </View>
            <View style={[styles.miniStat, Shadow.sm]}>
              <Text style={[styles.miniStatNum, { color: Colors.focus, fontSize: 18 }]}>
                {focusMins >= 60
                  ? `${Math.floor(focusMins / 60)}h ${focusMins % 60}m`
                  : `${focusMins}m`}
              </Text>
              <Text style={styles.miniStatLabel}>Focus Time</Text>
            </View>
          </View>
        </View>

        {/* ── Task List ── */}
        <SectionHeader
          title={isToday ? "Today's Tasks" : format(selectedDate, 'MMM d') + "'s Tasks"}
          action="View all"
          onAction={() => navigation?.navigate('Timeline')}
        />

        {dayTasks.length === 0 ? (
          <EmptyState
            icon="📋"
            title={`No tasks for ${isToday ? 'today' : format(selectedDate, 'MMM d')}`}
            subtitle="Tap the + button to add your first task"
            onAction={onAddTask}
            actionLabel="Add Task"
          />
        ) : (
          <View style={styles.taskList}>
            {dayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() => onToggleTask(task.id)}
                onPress={() => onTaskPress ? onTaskPress(task.id) : navigation?.navigate('TaskDetail', { taskId: task.id })}
              />
            ))}
          </View>
        )}

        {/* Bottom padding */}
        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
  },
  greeting: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.amber,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: Typography.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },

  // Date strip
  dateStrip: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  dateChip: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minWidth: 52,
  },
  dateChipActive: {
    backgroundColor: Colors.amber,
    borderColor: Colors.amber,
    ...Shadow.sm,
  },
  dayLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    marginBottom: 3,
  },
  dayLabelActive: { color: 'rgba(255,255,255,0.75)' },
  dayNum: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  dayNumActive: { color: Colors.white },
  dateDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.amber,
    marginTop: 4,
  },
  dateDotActive: { backgroundColor: 'rgba(255,255,255,0.6)' },

  // Now pill
  nowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginHorizontal: Spacing.xxl,
    marginTop: Spacing.lg,
    backgroundColor: Colors.amberBg,
    borderWidth: 1,
    borderColor: Colors.amberBorder,
    borderRadius: Radius.full,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 7,
  },
  nowDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.amber,
  },
  nowText: {
    fontSize: 12,
    color: Colors.amber,
    fontWeight: '600',
  },

  // Progress
  progressRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginHorizontal: Spacing.xxl,
    marginTop: Spacing.xl,
  },
  ringCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    width: 86,
    height: 86,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringTrack: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 7,
    borderColor: Colors.borderLight,
  },
  ringFill: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 7,
    borderColor: 'transparent',
    borderTopColor: Colors.amber,
    borderRightColor: Colors.amber,
  },
  ringCenter: {
    alignItems: 'center',
  },
  ringPct: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.amber,
    lineHeight: 22,
  },
  ringLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ringTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 10,
  },

  statsCol: {
    flex: 1,
    gap: Spacing.md,
  },
  miniStat: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.md,
    justifyContent: 'center',
  },
  miniStatNum: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  miniStatLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 2,
  },

  taskList: {
    paddingHorizontal: Spacing.xxl,
  },
});
