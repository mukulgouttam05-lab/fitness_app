import {
  DEFAULT_CHALLENGES,
  DEFAULT_LEADERBOARD,
  DEFAULT_WORKOUTS,
  DEFAULT_NUTRITION,
  DEFAULT_GALLERY
} from '../data/mockData';

// Initialize Local Storage keys with default mock data if not set
export const initLocalStorage = (forceReset = false) => {
  if (forceReset) {
    localStorage.clear();
  }

  // Seeding default users
  if (!localStorage.getItem('fc_users') || forceReset) {
    const defaultUsers = [
      {
        id: 'u-1',
        username: 'FitnessPro',
        email: 'demo@fitness.com',
        password: 'password123',
        age: 25,
        weight: 75,
        height: 180,
        dailyCalorieTarget: 2400,
        avatar: '',
        xp: 100,
        createdAt: '2026-06-01'
      }
    ];
    localStorage.setItem('fc_users', JSON.stringify(defaultUsers));
  }

  // Seeding challenges
  if (!localStorage.getItem('fc_challenges') || forceReset) {
    localStorage.setItem('fc_challenges', JSON.stringify(DEFAULT_CHALLENGES));
  }

  // Seeding user's joined challenges (default joined 30-Day Shred)
  if (!localStorage.getItem('fc_joinedChallenges') || forceReset) {
    localStorage.setItem('fc_joinedChallenges', JSON.stringify(['1']));
  }

  // Seeding workouts log
  if (!localStorage.getItem('fc_workouts') || forceReset) {
    localStorage.setItem('fc_workouts', JSON.stringify(DEFAULT_WORKOUTS));
  }

  // Seeding leaderboard
  if (!localStorage.getItem('fc_leaderboard') || forceReset) {
    localStorage.setItem('fc_leaderboard', JSON.stringify(DEFAULT_LEADERBOARD));
  }

  // Seeding nutrition logs
  if (!localStorage.getItem('fc_nutrition') || forceReset) {
    localStorage.setItem('fc_nutrition', JSON.stringify(DEFAULT_NUTRITION));
  }

  // Seeding progress gallery
  if (!localStorage.getItem('fc_gallery') || forceReset) {
    localStorage.setItem('fc_gallery', JSON.stringify(DEFAULT_GALLERY));
  }

  // Seeding theme settings
  if (!localStorage.getItem('fc_theme') || forceReset) {
    localStorage.setItem('fc_theme', 'dark');
  }

  // Seed default session if we want to simulate logged-in status
  if (!localStorage.getItem('fc_currentUser') && !forceReset) {
    const users = JSON.parse(localStorage.getItem('fc_users'));
    localStorage.setItem('fc_currentUser', JSON.stringify(users[0]));
  }
};

// Check if user is logged in
export const getCurrentUser = () => {
  const user = localStorage.getItem('fc_currentUser');
  return user ? JSON.parse(user) : null;
};

// Authentication: Login
export const loginUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem('fc_users') || '[]');
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    throw new Error('Invalid email or password.');
  }
  localStorage.setItem('fc_currentUser', JSON.stringify(user));
  return user;
};

// Authentication: Register
export const registerUser = (username, email, password, age, weight, height, calorieTarget) => {
  const users = JSON.parse(localStorage.getItem('fc_users') || '[]');
  const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    throw new Error('An account with this email already exists.');
  }

  const newUser = {
    id: 'u-' + Date.now(),
    username,
    email,
    password,
    age: parseInt(age) || 20,
    weight: parseFloat(weight) || 70,
    height: parseFloat(height) || 170,
    dailyCalorieTarget: parseInt(calorieTarget) || 2000,
    avatar: '',
    xp: 100,
    createdAt: new Date().toISOString().split('T')[0]
  };

  users.push(newUser);
  localStorage.setItem('fc_users', JSON.stringify(users));

  // Add user to Leaderboard with initial stats
  const leaderboard = JSON.parse(localStorage.getItem('fc_leaderboard') || '[]');
  leaderboard.push({
    rank: leaderboard.length + 1,
    username: newUser.username,
    xp: 100, // starting gift
    level: 1,
    workouts: 0,
    badge: 'Rookie'
  });
  localStorage.setItem('fc_leaderboard', JSON.stringify(leaderboard));

  // Auto-login after registration
  localStorage.setItem('fc_currentUser', JSON.stringify(newUser));
  return newUser;
};

// Authentication: Logout
export const logoutUser = () => {
  localStorage.removeItem('fc_currentUser');
};

// Update user profile details
export const updateProfile = (updatedDetails) => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('No user is currently logged in.');

  const updatedUser = { ...currentUser, ...updatedDetails };
  localStorage.setItem('fc_currentUser', JSON.stringify(updatedUser));

  // Update in user directory
  const users = JSON.parse(localStorage.getItem('fc_users') || '[]');
  const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
  localStorage.setItem('fc_users', JSON.stringify(updatedUsers));

  // Update in leaderboard if username changed
  if (updatedDetails.username && updatedDetails.username !== currentUser.username) {
    const leaderboard = JSON.parse(localStorage.getItem('fc_leaderboard') || '[]');
    const updatedLeaderboard = leaderboard.map(l => 
      l.username === currentUser.username ? { ...l, username: updatedDetails.username } : l
    );
    localStorage.setItem('fc_leaderboard', JSON.stringify(updatedLeaderboard));
  }
};

// Leaderboard helpers
export const getLeaderboard = () => {
  const leaderboard = JSON.parse(localStorage.getItem('fc_leaderboard') || '[]');
  // Sort leaderboard by XP descending
  const sorted = [...leaderboard].sort((a, b) => b.xp - a.xp);
  return sorted.map((item, index) => ({ ...item, rank: index + 1 }));
};

// Award XP helper to current user
export const awardUserXP = (xpAmount, workoutIncrement = 0) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  let finalXP = 100;

  const leaderboard = JSON.parse(localStorage.getItem('fc_leaderboard') || '[]');
  const updatedLeaderboard = leaderboard.map(entry => {
    if (entry.username.toLowerCase() === currentUser.username.toLowerCase()) {
      const newXp = Math.max(0, (entry.xp || 100) + xpAmount);
      const newLevel = Math.floor(newXp / 500) + 1; // 500 XP per level
      const newWorkouts = (entry.workouts || 0) + workoutIncrement;
      
      // Upgrade badges based on level
      let badge = entry.badge || 'Rookie';
      if (newLevel >= 12) badge = 'Gym Legend';
      else if (newLevel >= 8) badge = 'Iron Warrior';
      else if (newLevel >= 5) badge = 'Workout Warrior';
      else if (newLevel >= 3) badge = 'Rising Star';
      
      finalXP = newXp;
      return { ...entry, xp: newXp, level: newLevel, workouts: newWorkouts, badge };
    }
    return entry;
  });

  localStorage.setItem('fc_leaderboard', JSON.stringify(updatedLeaderboard));

  // Sync to currentUser so the UI registers it immediately
  currentUser.xp = finalXP;
  localStorage.setItem('fc_currentUser', JSON.stringify(currentUser));

  // Sync to users list
  const users = JSON.parse(localStorage.getItem('fc_users') || '[]');
  const updatedUsers = users.map(u => u.id === currentUser.id ? { ...u, xp: finalXP } : u);
  localStorage.setItem('fc_users', JSON.stringify(updatedUsers));
};

// Workouts log CRUD
export const getWorkouts = () => {
  return JSON.parse(localStorage.getItem('fc_workouts') || '[]');
};

export const addWorkout = (workout) => {
  const workouts = getWorkouts();
  const newWorkout = {
    ...workout,
    id: 'w-' + Date.now(),
    duration: parseInt(workout.duration) || 0,
    caloriesBurned: parseInt(workout.caloriesBurned) || 0
  };
  workouts.unshift(newWorkout); // latest first
  localStorage.setItem('fc_workouts', JSON.stringify(workouts));

  // Award 100 XP for logging a workout and increment workout count
  awardUserXP(100, 1);
  return newWorkout;
};

export const updateWorkout = (updatedWorkout) => {
  const workouts = getWorkouts();
  const updated = workouts.map(w => w.id === updatedWorkout.id ? {
    ...updatedWorkout,
    duration: parseInt(updatedWorkout.duration) || 0,
    caloriesBurned: parseInt(updatedWorkout.caloriesBurned) || 0
  } : w);
  localStorage.setItem('fc_workouts', JSON.stringify(updated));
};

export const deleteWorkout = (id) => {
  const workouts = getWorkouts();
  const filtered = workouts.filter(w => w.id !== id);
  localStorage.setItem('fc_workouts', JSON.stringify(filtered));

  // Deduct 100 XP and decrement workout counter
  awardUserXP(-100, -1);
};

// Challenges joined tracker
export const getChallenges = () => {
  return JSON.parse(localStorage.getItem('fc_challenges') || '[]');
};

export const getJoinedChallenges = () => {
  return JSON.parse(localStorage.getItem('fc_joinedChallenges') || '[]');
};

export const joinChallenge = (challengeId) => {
  const joined = getJoinedChallenges();
  if (joined.includes(challengeId)) return;

  joined.push(challengeId);
  localStorage.setItem('fc_joinedChallenges', JSON.stringify(joined));

  // Increment participant count in challenge list
  const challenges = getChallenges();
  const updatedChallenges = challenges.map(c => 
    c.id === challengeId ? { ...c, participants: c.participants + 1 } : c
  );
  localStorage.setItem('fc_challenges', JSON.stringify(updatedChallenges));

  // Award 200 XP for taking action and joining a challenge
  awardUserXP(200, 0);
};

export const leaveChallenge = (challengeId) => {
  const joined = getJoinedChallenges();
  const filtered = joined.filter(id => id !== challengeId);
  localStorage.setItem('fc_joinedChallenges', JSON.stringify(filtered));

  // Decrement participant count
  const challenges = getChallenges();
  const updatedChallenges = challenges.map(c => 
    c.id === challengeId ? { ...c, participants: Math.max(0, c.participants - 1) } : c
  );
  localStorage.setItem('fc_challenges', JSON.stringify(updatedChallenges));

  // Deduct 200 XP
  awardUserXP(-200, 0);
};

// Nutrition Tracker CRUD
export const getNutritionLogs = () => {
  return JSON.parse(localStorage.getItem('fc_nutrition') || '[]');
};

export const addNutritionMeal = (meal) => {
  const logs = getNutritionLogs();
  const newMeal = {
    ...meal,
    id: 'n-' + Date.now(),
    calories: parseInt(meal.calories) || 0,
    protein: parseInt(meal.protein) || 0,
    carbs: parseInt(meal.carbs) || 0,
    fat: parseInt(meal.fat) || 0
  };
  logs.unshift(newMeal);
  localStorage.setItem('fc_nutrition', JSON.stringify(logs));

  // Award 30 XP for logging nutrition
  awardUserXP(30, 0);
  return newMeal;
};

export const deleteNutritionMeal = (id) => {
  const logs = getNutritionLogs();
  const filtered = logs.filter(l => l.id !== id);
  localStorage.setItem('fc_nutrition', JSON.stringify(filtered));

  // Deduct 30 XP
  awardUserXP(-30, 0);
};

// Progress Gallery before/after
export const getGalleryLogs = () => {
  return JSON.parse(localStorage.getItem('fc_gallery') || '[]');
};

export const addGalleryLog = (log) => {
  const gallery = getGalleryLogs();
  const newLog = {
    ...log,
    id: 'g-' + Date.now(),
    weight: parseFloat(log.weight) || 70,
    isInitial: false
  };
  gallery.unshift(newLog);
  localStorage.setItem('fc_gallery', JSON.stringify(gallery));

  // Award 150 XP for uploading progress
  awardUserXP(150, 0);
  return newLog;
};

// Theme preference
export const getTheme = () => {
  return localStorage.getItem('fc_theme') || 'dark';
};

export const toggleTheme = () => {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('fc_theme', next);
  return next;
};
