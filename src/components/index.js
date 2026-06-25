// src/components/index.js — Shared UI components

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { CATEGORIES, PRIORITY } from '../data/sampleTasks';

// ─── Category Tag ───────────────────────────────────────────────────────────
export const CategoryTag = ({ category, style }) => {
  const cat = CATEGORIES[category] || CATEGORIES.work;
  return (
    <View style={[styles.tag, { backgroundColor: cat.bg, borderColor: cat.color + '30' }, style]}>
      <Text style={[styles.tagText, { color: cat.color }]}>
        {cat.label.toUpperCase()}
      </Text>
    </View>
  );
};

// ─── Priority Dot ────────────────────────────────────────────────────────────
export const PriorityDot = ({ priority }) => {
  const p = PRIORITY[priority] || PRIORITY.low;
  return (
    <View style={[
      styles.priorityDot,
      { backgroundColor: p.color },
      priority === 'high' && styles.priorityDotGlow,
    ]} />
  );
};

// ─── Task Card ───────────────────────────────────────────────────────────────
export const TaskCard = ({ task, onToggle, onPress }) => {
  const cat = CATEGORIES[task.category] || CATEGORIES.work;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.taskCard, Shadow.sm, task.completed && styles.taskCardDone]}
    >
      {/* Left color bar */}
      <View style={[styles.leftBar, { backgroundColor: cat.color }]} />

      {/* Checkbox */}
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
        style={[styles.checkbox, task.completed && { backgroundColor: Colors.health, borderColor: Colors.health }]}
      >
        {task.completed && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.taskContent}>
        <Text style={[
          styles.taskTitle,
          task.completed && styles.taskTitleDone,
        ]} numberOfLines={1}>
          {task.title}
        </Text>
        <View style={styles.taskMeta}>
          <Text style={styles.taskTime}>
            {formatHourSimple(task.startHour, task.startMinute)} – {formatHourSimple(task.endHour, task.endMinute)}
          </Text>
          <CategoryTag category={task.category} style={{ marginLeft: Spacing.xs }} />
        </View>
      </View>

      {/* Priority */}
      <PriorityDot priority={task.priority} />
    </TouchableOpacity>
  );
};

// ─── Section Header ──────────────────────────────────────────────────────────
export const SectionHeader = ({ title, action, onAction }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {action && (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.sectionAction}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── Stat Card ───────────────────────────────────────────────────────────────
export const StatCard = ({ value, label, color, style }) => (
  <View style={[styles.statCard, Shadow.sm, style]}>
    <Text style={[styles.statValue, { color: color || Colors.amber }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ─── Empty State ─────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, subtitle, onAction, actionLabel }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>{icon || '📋'}</Text>
    <Text style={styles.emptyTitle}>{title || 'No tasks yet'}</Text>
    <Text style={styles.emptySubtitle}>{subtitle || 'Tap + to add your first task'}</Text>
    {onAction && (
      <TouchableOpacity style={styles.emptyAction} onPress={onAction}>
        <Text style={styles.emptyActionText}>{actionLabel || 'Add Task'}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// Helper
const formatHourSimple = (h, m = 0) => {
  const hour = h % 12 || 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  const min = m === 0 ? '00' : String(m).padStart(2, '0');
  return `${hour}:${min} ${ampm}`;
};

const styles = StyleSheet.create({
  // Tag
  tag: {
    borderRadius: Radius.sm,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
  },

  // Priority dot
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  priorityDotGlow: {
    shadowColor: Colors.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 2,
  },

  // Task Card
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    paddingLeft: Spacing.xl,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    position: 'relative',
    overflow: 'hidden',
  },
  taskCardDone: {
    opacity: 0.55,
  },
  leftBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: Radius.lg,
    borderBottomLeftRadius: Radius.lg,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    flexShrink: 0,
    backgroundColor: Colors.white,
  },
  checkmark: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '700',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTime: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionAction: {
    fontSize: Typography.sm,
    color: Colors.amber,
    fontWeight: '500',
  },

  // Stat card
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 3,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl * 2,
    paddingHorizontal: Spacing.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyAction: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.amber,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
  },
  emptyActionText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: Typography.sm,
  },
});
