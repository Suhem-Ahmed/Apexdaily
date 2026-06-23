// src/data/sampleTasks.js
import { format, addDays } from 'date-fns';

const today = format(new Date(), 'yyyy-MM-dd');
const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

export const CATEGORIES = {
  work: { label: 'Work', color: '#C96A0A', bg: '#FEF3E6', icon: '💼' },
  focus: { label: 'Focus', color: '#1D6FA4', bg: '#E8F2FA', icon: '⚡' },
  health: { label: 'Health', color: '#1A7D5A', bg: '#E6F5EF', icon: '🏃' },
  personal: { label: 'Personal', color: '#7040B0', bg: '#F0EAF8', icon: '🎯' },
  break: { label: 'Break', color: '#78716C', bg: '#F4EFE6', icon: '☕' },
};

export const PRIORITY = {
  high: { label: 'High', color: '#C96A0A' },
  medium: { label: 'Medium', color: '#1D6FA4' },
  low: { label: 'Low', color: '#A8A29E' },
};

export const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

export const getSampleTasks = () => [
  {
    id: generateId(),
    title: 'Morning Run',
    category: 'health',
    priority: 'medium',
    date: today,
    startHour: 6,
    startMinute: 0,
    endHour: 6,
    endMinute: 45,
    completed: true,
    notes: '5km easy pace',
  },
  {
    id: generateId(),
    title: 'Review Emails & Inbox',
    category: 'work',
    priority: 'low',
    date: today,
    startHour: 8,
    startMinute: 0,
    endHour: 9,
    endMinute: 0,
    completed: true,
    notes: '',
  },
  {
    id: generateId(),
    title: 'Deep Work — Project Alpha',
    category: 'focus',
    priority: 'high',
    date: today,
    startHour: 9,
    startMinute: 0,
    endHour: 11,
    endMinute: 30,
    completed: false,
    notes: 'No interruptions. Phone on silent.',
  },
  {
    id: generateId(),
    title: 'Team Standup Call',
    category: 'work',
    priority: 'medium',
    date: today,
    startHour: 11,
    startMinute: 30,
    endHour: 12,
    endMinute: 0,
    completed: false,
    notes: '',
  },
  {
    id: generateId(),
    title: 'Lunch Break',
    category: 'break',
    priority: 'low',
    date: today,
    startHour: 12,
    startMinute: 0,
    endHour: 13,
    endMinute: 0,
    completed: false,
    notes: '',
  },
  {
    id: generateId(),
    title: 'Client Report Draft',
    category: 'work',
    priority: 'high',
    date: today,
    startHour: 13,
    startMinute: 0,
    endHour: 15,
    endMinute: 0,
    completed: false,
    notes: 'Due by end of week',
  },
  {
    id: generateId(),
    title: 'Personal Admin',
    category: 'personal',
    priority: 'low',
    date: today,
    startHour: 15,
    startMinute: 30,
    endHour: 16,
    endMinute: 30,
    completed: false,
    notes: 'Bills, appointments, errands',
  },
  {
    id: generateId(),
    title: 'Gym — Chest & Arms',
    category: 'health',
    priority: 'medium',
    date: today,
    startHour: 18,
    startMinute: 0,
    endHour: 19,
    endMinute: 30,
    completed: false,
    notes: '4 sets each exercise',
  },
  {
    id: generateId(),
    title: 'Read — 30 Minutes',
    category: 'personal',
    priority: 'low',
    date: today,
    startHour: 21,
    startMinute: 0,
    endHour: 21,
    endMinute: 30,
    completed: false,
    notes: '',
  },
  {
    id: generateId(),
    title: 'Quarterly Review Prep',
    category: 'work',
    priority: 'high',
    date: tomorrow,
    startHour: 9,
    startMinute: 0,
    endHour: 11,
    endMinute: 0,
    completed: false,
    notes: '',
  },
  {
    id: generateId(),
    title: 'Morning Yoga',
    category: 'health',
    priority: 'medium',
    date: tomorrow,
    startHour: 6,
    startMinute: 30,
    endHour: 7,
    endMinute: 15,
    completed: false,
    notes: '',
  },
];

export const formatHour = (h, m = 0) => {
  const hour = h % 12 || 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  const min = m === 0 ? '00' : String(m).padStart(2, '0');
  return `${hour}:${min} ${ampm}`;
};

export const formatTimeRange = (startH, startM, endH, endM) =>
  `${formatHour(startH, startM)} – ${formatHour(endH, endM)}`;

export const getDurationMins = (startH, startM, endH, endM) =>
  (endH * 60 + endM) - (startH * 60 + startM);
