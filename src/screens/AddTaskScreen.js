// src/screens/AddTaskScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { CATEGORIES, PRIORITY, generateId } from '../data/sampleTasks';

const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = [0, 15, 30, 45];

export default function AddTaskScreen({ navigation, route, onSave, onDelete }) {
  const existingTask = route?.params?.task;
  const isEditing = !!existingTask;

  const [title, setTitle] = useState(existingTask?.title || '');
  const [notes, setNotes] = useState(existingTask?.notes || '');
  const [category, setCategory] = useState(existingTask?.category || 'work');
  const [priority, setPriority] = useState(existingTask?.priority || 'medium');
  const [date] = useState(existingTask?.date || format(new Date(), 'yyyy-MM-dd'));

  const [startHour, setStartHour] = useState(existingTask?.startHour ?? new Date().getHours());
  const [startMinute, setStartMinute] = useState(existingTask?.startMinute ?? 0);
  const [endHour, setEndHour] = useState(existingTask?.endHour ?? (new Date().getHours() + 1) % 24);
  const [endMinute, setEndMinute] = useState(existingTask?.endMinute ?? 0);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please give your task a name.');
      return;
    }
    const task = {
      id: existingTask?.id || generateId(),
      title: title.trim(),
      notes: notes.trim(),
      category,
      priority,
      date,
      startHour,
      startMinute,
      endHour,
      endMinute,
      completed: existingTask?.completed || false,
    };
    onSave(task);
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: () => {
            onDelete(existingTask.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const formatPickerTime = (h, m) => {
    const hour = h % 12 || 12;
    const ampm = h < 12 ? 'AM' : 'PM';
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Task' : 'New Task'}</Text>
        <TouchableOpacity onPress={handleSave} style={styles.headerBtn}>
          <Text style={[styles.headerBtnText, styles.saveBtnText]}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}>

          {/* Title input */}
          <View style={styles.section}>
            <Text style={styles.label}>Task Name</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="e.g. Deep Work — Project Alpha"
              placeholderTextColor={Colors.textMuted}
              value={title}
              onChangeText={setTitle}
              autoFocus={!isEditing}
            />
          </View>

          {/* Time range */}
          <View style={styles.section}>
            <Text style={styles.label}>Time</Text>
            <View style={styles.timeRow}>
              <TouchableOpacity
                style={[styles.timeBox, Shadow.sm]}
                onPress={() => { setShowStartPicker(!showStartPicker); setShowEndPicker(false); }}
              >
                <Text style={styles.timeBoxLabel}>START</Text>
                <Text style={styles.timeBoxValue}>{formatPickerTime(startHour, startMinute)}</Text>
              </TouchableOpacity>
              <Text style={styles.timeArrow}>→</Text>
              <TouchableOpacity
                style={[styles.timeBox, Shadow.sm]}
                onPress={() => { setShowEndPicker(!showEndPicker); setShowStartPicker(false); }}
              >
                <Text style={styles.timeBoxLabel}>END</Text>
                <Text style={styles.timeBoxValue}>{formatPickerTime(endHour, endMinute)}</Text>
              </TouchableOpacity>
            </View>

            {/* Inline time picker */}
            {(showStartPicker || showEndPicker) && (
              <View style={[styles.pickerCard, Shadow.sm]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerRow}>
                  {Array.from({ length: 24 }, (_, h) => (
                    <TouchableOpacity
                      key={h}
                      style={[
                        styles.pickerChip,
                        (showStartPicker ? startHour : endHour) === h && styles.pickerChipActive,
                      ]}
                      onPress={() => showStartPicker ? setStartHour(h) : setEndHour(h)}
                    >
                      <Text style={[
                        styles.pickerChipText,
                        (showStartPicker ? startHour : endHour) === h && styles.pickerChipTextActive,
                      ]}>
                        {h % 12 || 12}{h < 12 ? 'AM' : 'PM'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={styles.minuteRow}>
                  {MINUTES.map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={[
                        styles.minuteChip,
                        (showStartPicker ? startMinute : endMinute) === m && styles.pickerChipActive,
                      ]}
                      onPress={() => showStartPicker ? setStartMinute(m) : setEndMinute(m)}
                    >
                      <Text style={[
                        styles.pickerChipText,
                        (showStartPicker ? startMinute : endMinute) === m && styles.pickerChipTextActive,
                      ]}>
                        :{String(m).padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.chipGrid}>
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => setCategory(key)}
                  style={[
                    styles.catChip,
                    { borderColor: category === key ? cat.color : Colors.borderLight },
                    category === key && { backgroundColor: cat.bg },
                  ]}
                >
                  <Text style={styles.catChipEmoji}>{cat.icon}</Text>
                  <Text style={[
                    styles.catChipText,
                    category === key && { color: cat.color, fontWeight: '700' },
                  ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Priority */}
          <View style={styles.section}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityRow}>
              {Object.entries(PRIORITY).map(([key, p]) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => setPriority(key)}
                  style={[
                    styles.priorityChip,
                    priority === key && { backgroundColor: p.color, borderColor: p.color },
                  ]}
                >
                  <View style={[styles.priorityDotSmall, { backgroundColor: priority === key ? Colors.white : p.color }]} />
                  <Text style={[
                    styles.priorityChipText,
                    priority === key && { color: Colors.white, fontWeight: '700' },
                  ]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add details, links, or context..."
              placeholderTextColor={Colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Delete button (edit mode only) */}
          {isEditing && (
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Text style={styles.deleteBtnText}>Delete Task</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerBtn: { padding: 4, minWidth: 60 },
  headerBtnText: { fontSize: 15, color: Colors.textSecondary, fontWeight: '500' },
  saveBtnText: { color: Colors.amber, fontWeight: '700', textAlign: 'right' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },

  section: { marginTop: Spacing.xl },
  label: {
    fontSize: 11, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: Spacing.sm,
  },

  titleInput: {
    fontSize: 17, fontWeight: '600', color: Colors.textPrimary,
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
  },

  timeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  timeBox: {
    flex: 1, backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderLight,
    padding: Spacing.md, alignItems: 'center',
  },
  timeBoxLabel: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, letterSpacing: 0.6, marginBottom: 4 },
  timeBoxValue: { fontSize: 16, fontWeight: '700', color: Colors.amber },
  timeArrow: { fontSize: 16, color: Colors.textMuted },

  pickerCard: {
    marginTop: Spacing.md, backgroundColor: Colors.white,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.borderLight,
    padding: Spacing.md,
  },
  pickerRow: { flexDirection: 'row' },
  pickerChip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.md,
    backgroundColor: Colors.surface, marginRight: 6,
  },
  pickerChipActive: { backgroundColor: Colors.amber },
  pickerChipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  pickerChipTextActive: { color: Colors.white },
  minuteRow: { flexDirection: 'row', gap: 6, marginTop: Spacing.md },
  minuteChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.md,
    backgroundColor: Colors.surface,
  },

  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: Radius.full, borderWidth: 1.5,
    backgroundColor: Colors.white,
  },
  catChipEmoji: { fontSize: 14 },
  catChipText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },

  priorityRow: { flexDirection: 'row', gap: Spacing.sm },
  priorityChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: Spacing.md, borderRadius: Radius.lg,
    borderWidth: 1.5, borderColor: Colors.borderLight, backgroundColor: Colors.white,
  },
  priorityDotSmall: { width: 7, height: 7, borderRadius: 3.5 },
  priorityChipText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },

  notesInput: {
    fontSize: 14, color: Colors.textPrimary,
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderLight,
    padding: Spacing.lg, minHeight: 90,
  },

  deleteBtn: {
    marginTop: Spacing.xxl, alignItems: 'center',
    paddingVertical: Spacing.md, borderRadius: Radius.lg,
    backgroundColor: '#FEECEC', borderWidth: 1, borderColor: '#F5C6C6',
  },
  deleteBtnText: { color: '#C0392B', fontWeight: '700', fontSize: 14 },
});
