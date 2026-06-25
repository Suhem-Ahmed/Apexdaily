// App.js — APEX Daily root
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import DashboardScreen from './src/screens/DashboardScreen';
import TimelineScreen from './src/screens/TimelineScreen';
import WeekScreen from './src/screens/WeekScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';
import TaskDetailScreen from './src/screens/TaskDetailScreen';

import { Colors, Typography } from './src/theme';
import { saveTasks, loadTasks } from './src/storage';
import { getSampleTasks } from './src/data/sampleTasks';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ─── Tab Icons ───────────────────────────────────────────────────────────────
const TabIcon = ({ label, focused }) => {
  const icons = { Today: '⊡', Timeline: '⏱', Week: '▦', Goals: '◎' };
  return (
    <Text style={{
      fontSize: 22,
      opacity: focused ? 1 : 0.35,
      color: focused ? Colors.amber : Colors.textMuted,
    }}>
      {icons[label]}
    </Text>
  );
};

// ─── Bottom Tabs ─────────────────────────────────────────────────────────────
function MainTabs({ tasks, onToggleTask, navigation }) {
  const goAdd = useCallback(() => navigation.navigate('AddTask'), [navigation]);
  const goDetail = useCallback((taskId) => navigation.navigate('TaskDetail', { taskId }), [navigation]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        tabBarActiveTintColor: Colors.amber,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 84,
          paddingTop: 8,
          paddingBottom: 24,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 0.4,
        },
      })}
    >
      <Tab.Screen name="Today">
        {(props) => (
          <DashboardScreen
            {...props}
            tasks={tasks}
            onToggleTask={onToggleTask}
            onAddTask={goAdd}
            onTaskPress={goDetail}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Timeline">
        {(props) => (
          <TimelineScreen
            {...props}
            tasks={tasks}
            onToggleTask={onToggleTask}
            onAddTask={goAdd}
            onTaskPress={goDetail}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Week">
        {(props) => (
          <WeekScreen {...props} tasks={tasks} onAddTask={goAdd} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Goals">
        {(props) => <GoalsScreen {...props} tasks={tasks} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await loadTasks();
      if (saved && saved.length > 0) {
        setTasks(saved);
      } else {
        const sample = getSampleTasks();
        setTasks(sample);
        await saveTasks(sample);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) saveTasks(tasks);
  }, [tasks, loading]);

  const handleToggleTask = useCallback((taskId) => {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, completed: !t.completed } : t));
  }, []);

  const handleSaveTask = useCallback((task) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === task.id);
      return exists ? prev.map((t) => t.id === task.id ? task : t) : [...prev, task];
    });
  }, []);

  const handleDeleteTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingScreen}>
          <Text style={styles.loadingIcon}>⏱</Text>
          <ActivityIndicator size="large" color={Colors.amber} style={{ marginTop: 16 }} />
          <Text style={styles.loadingText}>Apex Daily</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Main tab layout */}
          <Stack.Screen name="Main">
            {(props) => (
              <MainTabs
                {...props}
                tasks={tasks}
                onToggleTask={handleToggleTask}
              />
            )}
          </Stack.Screen>

          {/* Add Task modal */}
          <Stack.Screen
            name="AddTask"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          >
            {(props) => (
              <AddTaskScreen
                {...props}
                onSave={handleSaveTask}
                onDelete={handleDeleteTask}
              />
            )}
          </Stack.Screen>

          {/* Edit Task modal (same screen, pre-filled) */}
          <Stack.Screen
            name="EditTask"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          >
            {(props) => {
              const task = tasks.find((t) => t.id === props.route.params?.taskId);
              return (
                <AddTaskScreen
                  {...props}
                  route={{ ...props.route, params: { task } }}
                  onSave={handleSaveTask}
                  onDelete={handleDeleteTask}
                />
              );
            }}
          </Stack.Screen>

          {/* Task detail view */}
          <Stack.Screen
            name="TaskDetail"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          >
            {(props) => {
              const task = tasks.find((t) => t.id === props.route.params?.taskId);
              return (
                <TaskDetailScreen
                  {...props}
                  route={{ ...props.route, params: { task } }}
                  onToggleTask={handleToggleTask}
                />
              );
            }}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIcon: { fontSize: 48 },
  loadingText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.amber,
    letterSpacing: -0.3,
  },
});
