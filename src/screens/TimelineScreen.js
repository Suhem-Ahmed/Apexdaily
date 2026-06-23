// src/screens/TimelineScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, isSameDay } from 'date-fns';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { CategoryTag } from '../components';
import { CATEGORIES, formatHour } from '../data/sampleTasks';

const { width } = Dimensions.get('window');
const HOUR_HEIGHT = 72; // px per hour
const LEFT_GUTTER = 52;
const HOURS = Array.from({ length: 18 }, (_, i) => i + 5); // 5AM – 10PM

export default function TimelineScreen({ tasks, onToggleTask, onAddTask, onTaskPress }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [now, setNow] = useState(new Date());
  const scrollRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll to current hour on mount
  useEffect(() => {
    const currentHour = now.getHours();
    const scrollY = Math.max(0, (currentHour - 5 - 1) * HOUR_HEIGHT);
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: scrollY, animated: true });
    }, 300);
  }, []);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const isToday = selectedDateStr === todayStr;

  const dayTasks = tasks.filter((t) => t.date === selectedDateStr);

  const nowHour = now.getHours();
  const nowMin = now.getMinutes();
  const nowTopOffset = (nowHour - 5) * HOUR_HEIGHT + (nowMin / 60) * HOUR_HEIGHT;
  const nowFormatted = formatHour(nowHour, nowMin);

  // Position a task block on the timeline
  const getTaskStyle = (task) => {
    const topOffset = (task.startHour - 5) * HOUR_HEIGHT + (task.startMinute / 60) * HOUR_HEIGHT;
    const durationHours = ((task.endHour * 60 + task.endMinute) - (task.startHour * 60 + task.startMinute)) / 60;
    const height = Math.max(durationHours * HOUR_HEIGHT - 4, 36);
    return { top: topOffset + 2, height };
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>
            {isToday ? 'Today' : format(selectedDate, 'EEE, MMM d')}
          </Text>
          <Text style={styles.title}>Timeline</Text>
        </View>

        {/* View toggle */}
        <View style={styles.viewToggle}>
          {['Day', 'Hour', 'Week'].map((v) => (
            <TouchableOpacity
              key={v}
              style={[styles.toggleBtn, v === 'Hour' && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleLabel, v === 'Hour' && styles.toggleLabelActive]}>
                {v}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Timeline ── */}
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.timelineContainer}>
          {/* Hour grid lines */}
          {HOURS.map((hour) => (
            <View
              key={hour}
              style={[styles.hourRow, { top: (hour - 5) * HOUR_HEIGHT }]}
            >
              <Text style={[
                styles.hourLabel,
                isToday && hour === nowHour && styles.hourLabelActive,
              ]}>
                {hour === 0 ? '12' : hour > 12 ? `${hour - 12}` : `${hour}`}
                <Text style={styles.hourAmpm}>{hour < 12 ? 'am' : 'pm'}</Text>
              </Text>
              <View style={styles.hourLine} />
            </View>
          ))}

          {/* Task blocks */}
          {dayTasks.map((task) => {
            const cat = CATEGORIES[task.category] || CATEGORIES.work;
            const pos = getTaskStyle(task);
            const isShort = pos.height < 55;

            return (
              <TouchableOpacity
                key={task.id}
                activeOpacity={0.75}
                onPress={() => onTaskPress ? onTaskPress(task.id) : onToggleTask(task.id)}
                style={[
                  styles.taskBlock,
                  {
                    top: pos.top,
                    height: pos.height,
                    backgroundColor: task.completed ? Colors.surface : cat.bg,
                    borderColor: task.completed ? Colors.border : cat.color + '40',
                    borderLeftColor: cat.color,
                    opacity: task.completed ? 0.6 : 1,
                  },
                  Shadow.sm,
                ]}
              >
                <Text
                  style={[
                    styles.blockTitle,
                    { color: task.completed ? Colors.textMuted : cat.color },
                    task.completed && { textDecorationLine: 'line-through' },
                  ]}
                  numberOfLines={isShort ? 1 : 2}
                >
                  {task.title}
                </Text>
                {!isShort && (
                  <Text style={[styles.blockTime, { color: cat.color + 'AA' }]}>
                    {formatHour(task.startHour, task.startMinute)} – {formatHour(task.endHour, task.endMinute)}
                  </Text>
                )}
                {!isShort && (
                  <CategoryTag category={task.category} style={{ marginTop: 3, alignSelf: 'flex-start' }} />
                )}
              </TouchableOpacity>
            );
          })}

          {/* ── NOW LINE ── */}
          {isToday && nowHour >= 5 && nowHour <= 22 && (
            <View style={[styles.nowLineWrap, { top: nowTopOffset }]}>
              <View style={styles.nowDot} />
              <View style={styles.nowPill}>
                <Text style={styles.nowPillText}>{nowFormatted}</Text>
              </View>
              <View style={styles.nowLine} />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add button */}
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.bg,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.focus,
    marginBottom: 2,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
  },
  toggleBtnActive: {
    backgroundColor: Colors.focus,
    ...Shadow.sm,
  },
  toggleLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  toggleLabelActive: {
    color: Colors.white,
  },

  // Timeline
  timelineContainer: {
    marginLeft: LEFT_GUTTER,
    marginRight: Spacing.lg,
    position: 'relative',
    height: HOURS.length * HOUR_HEIGHT + 60,
  },
  hourRow: {
    position: 'absolute',
    left: -LEFT_GUTTER,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    height: HOUR_HEIGHT,
  },
  hourLabel: {
    width: LEFT_GUTTER - 10,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textMuted,
    paddingRight: 10,
  },
  hourAmpm: {
    fontSize: 9,
    fontWeight: '400',
  },
  hourLabelActive: {
    color: Colors.amber,
    fontWeight: '700',
  },
  hourLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },

  // Task block
  taskBlock: {
    position: 'absolute',
    left: 4,
    right: 0,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderLeftWidth: 3,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: 'hidden',
  },
  blockTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.1,
    lineHeight: 16,
  },
  blockTime: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },

  // Now line
  nowLineWrap: {
    position: 'absolute',
    left: -LEFT_GUTTER + 2,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
  },
  nowDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.amber,
    shadowColor: Colors.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3,
  },
  nowPill: {
    backgroundColor: Colors.amber,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginHorizontal: 4,
    shadowColor: Colors.amber,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  nowPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.2,
  },
  nowLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: Colors.amber,
    opacity: 0.5,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 100,
    right: Spacing.xxl,
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    fontSize: 28,
    color: Colors.white,
    lineHeight: 32,
  },
});
