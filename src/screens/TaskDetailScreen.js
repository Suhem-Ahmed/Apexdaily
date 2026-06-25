// src/screens/TaskDetailScreen.js
// Full-screen task detail view — opened by tapping a task card
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { CATEGORIES, PRIORITY, formatHour } from '../data/sampleTasks';

export default function TaskDetailScreen({ route, navigation, onToggleTask }) {
  const { task } = route.params || {};

  if (!task) {
    navigation.goBack();
    return null;
  }

  const cat = CATEGORIES[task.category] || CATEGORIES.work;
  const pri = PRIORITY[task.priority] || PRIORITY.medium;
  const durationMins =
    (task.endHour * 60 + task.endMinute) - (task.startHour * 60 + task.startMinute);
  const durationLabel =
    durationMins >= 60
      ? `${Math.floor(durationMins / 60)}h ${durationMins % 60 > 0 ? `${durationMins % 60}m` : ''}`
      : `${durationMins}m`;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('AddTask', { task })}
        >
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}>

        {/* Category + Status */}
        <View style={styles.topRow}>
          <View style={[styles.catBadge, { backgroundColor: cat.bg, borderColor: cat.color + '40' }]}>
            <Text style={styles.catEmoji}>{cat.icon}</Text>
            <Text style={[styles.catLabel, { color: cat.color }]}>{cat.label}</Text>
          </View>
          <View style={[styles.statusBadge, task.completed ? styles.statusDone : styles.statusPending]}>
            <Text style={[styles.statusText, task.completed ? styles.statusTextDone : styles.statusTextPending]}>
              {task.completed ? '✓ Completed' : '○ Pending'}
            </Text>
          </View>
        </View>

        {/* Task title */}
        <Text style={[styles.taskTitle, task.completed && styles.taskTitleDone]}>
          {task.title}
        </Text>

        {/* Time card */}
        <View style={[styles.infoCard, Shadow.sm]}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>⏰</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>
                {formatHour(task.startHour, task.startMinute)} – {formatHour(task.endHour, task.endMinute)}
              </Text>
            </View>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{durationLabel}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.borderLight }]}>
            <Text style={styles.infoIcon}>📅</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{task.date}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.borderLight }]}>
            <Text style={styles.infoIcon}>🎯</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Priority</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <View style={[styles.priorityDot, { backgroundColor: pri.color }]} />
                <Text style={[styles.infoValue, { color: pri.color }]}>{pri.label}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notes */}
        {task.notes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={[styles.notesCard, Shadow.sm]}>
              <Text style={styles.notesText}>{task.notes}</Text>
            </View>
          </View>
        ) : null}

        {/* Toggle complete button */}
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            Shadow.md,
            task.completed && styles.toggleBtnDone,
          ]}
          onPress={() => {
            onToggleTask(task.id);
            navigation.goBack();
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.toggleBtnText}>
            {task.completed ? '↩ Mark as Incomplete' : '✓ Mark as Complete'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1, paddingHorizontal: Spacing.xxl },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { padding: 4 },
  backBtnText: { fontSize: 15, color: Colors.textSecondary, fontWeight: '500' },
  editBtn: { padding: 4 },
  editBtnText: { fontSize: 15, color: Colors.amber, fontWeight: '700' },

  topRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: Spacing.xl,
  },
  catBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: Radius.full, borderWidth: 1,
  },
  catEmoji: { fontSize: 14 },
  catLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

  statusBadge: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1,
  },
  statusDone: { backgroundColor: Colors.healthBg, borderColor: Colors.health + '40' },
  statusPending: { backgroundColor: Colors.amberBg, borderColor: Colors.amberBorder },
  statusText: { fontSize: 12, fontWeight: '700' },
  statusTextDone: { color: Colors.health },
  statusTextPending: { color: Colors.amber },

  taskTitle: {
    fontSize: 26, fontWeight: '700', color: Colors.textPrimary,
    letterSpacing: -0.5, lineHeight: 32, marginTop: Spacing.lg,
  },
  taskTitleDone: { textDecorationLine: 'line-through', color: Colors.textMuted },

  infoCard: {
    marginTop: Spacing.xl, backgroundColor: Colors.white,
    borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.borderLight,
    padding: Spacing.lg,
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  infoIcon: { fontSize: 18, marginTop: 2 },
  infoContent: { flex: 1 },
  infoLabel: {
    fontSize: 10, fontWeight: '700', color: Colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 3,
  },
  infoValue: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  durationBadge: {
    backgroundColor: Colors.amberBg, borderRadius: Radius.md,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: Colors.amberBorder,
  },
  durationText: { fontSize: 12, fontWeight: '700', color: Colors.amber },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },

  section: { marginTop: Spacing.xl },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: Spacing.sm,
  },
  notesCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.lg,
  },
  notesText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21 },

  toggleBtn: {
    marginTop: Spacing.xxxl, backgroundColor: Colors.amber,
    borderRadius: Radius.xl, paddingVertical: 16, alignItems: 'center',
  },
  toggleBtnDone: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  toggleBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});
