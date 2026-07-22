export const DEFAULT_CHALLENGES = [
  {
    id: "1",
    title: "30-Day Shred Challenge",
    description: "Burn fat, build lean muscle, and boost endurance. This intermediate-level workout split focuses on high-intensity interval training (HIIT) combined with core strength routines.",
    category: "Strength & Cardio",
    difficulty: "Intermediate",
    durationDays: 30,
    participants: 1420,
    xpReward: 500,
    rules: [
      "Log at least 5 workouts per week.",
      "Stay within 10% of your daily calorie target.",
      "Track your hydration daily (minimum 2.5L)."
    ],
    milestones: [
      { day: 5, label: "First Week Done" },
      { day: 15, label: "Halfway Shredded" },
      { day: 30, label: "Ultimate Shred Champion" }
    ]
  },
  {
    id: "2",
    title: "Core & Abs Blast",
    description: "Sculpt and strengthen your midsection with daily 15-minute core burnouts. Perfect for beginners and advanced lifters looking to reinforce structural strength.",
    category: "Core & Stability",
    difficulty: "Beginner",
    durationDays: 14,
    participants: 980,
    xpReward: 250,
    rules: [
      "Complete the daily core routine.",
      "No sugary drinks during the 14 days.",
      "Log daily weight updates."
    ],
    milestones: [
      { day: 7, label: "Core Foundation" },
      { day: 14, label: "Iron Core Master" }
    ]
  },
  {
    id: "3",
    title: "10k Daily Steps Club",
    description: "Get moving! Consistency is key. Accumulate 10,000 steps every day to improve cardiovascular health, reduce stress, and maintain active metabolic levels.",
    category: "Cardio",
    difficulty: "All Levels",
    durationDays: 21,
    participants: 2310,
    xpReward: 350,
    rules: [
      "Walk 10,000 steps daily (logged via health app screenshot or tracker input).",
      "Upload your steps count daily in the tracker."
    ],
    milestones: [
      { day: 7, label: "Consistent Walker" },
      { day: 14, label: "Stamina Builder" },
      { day: 21, label: "Centurion Hiker" }
    ]
  },
  {
    id: "4",
    title: "Flexibility & Vinyasa Flow",
    description: "Unlock tight hips, alleviate lower back tension, and expand your range of motion. This yoga program blends dynamic poses with breathing cycles for mental peace.",
    category: "Flexibility & Mindset",
    difficulty: "Beginner",
    durationDays: 10,
    participants: 650,
    xpReward: 200,
    rules: [
      "Perform the 20-minute stretching flow daily.",
      "Log your flexibility rating (1-10) in the comments."
    ],
    milestones: [
      { day: 5, label: "Limber & Loose" },
      { day: 10, label: "Zen Master" }
    ]
  }
];

export const DEFAULT_LEADERBOARD = [
  { rank: 1, username: "Alex_Shields", xp: 4850, level: 12, workouts: 54, badge: "Iron Warrior" },
  { rank: 2, username: "Sarah_Spins", xp: 4120, level: 10, workouts: 48, badge: "Cardio Queen" },
  { rank: 3, username: "GymGuru", xp: 3950, level: 9, workouts: 42, badge: "Master Lifter" },
  { rank: 4, username: "Flex_Master", xp: 3200, level: 8, workouts: 35, badge: "Nimber Yogi" },
  { rank: 5, username: "Yoga_Flow", xp: 2980, level: 7, workouts: 31, badge: "Mindfulness Expert" },
  { rank: 6, username: "FitnessPro", xp: 1250, level: 3, workouts: 12, badge: "Rising Star" } // Placeholder user that maps to current user
];

export const DEFAULT_WORKOUTS = [
  {
    id: "w-1",
    name: "Morning HIIT Blast",
    category: "Cardio",
    duration: 35,
    caloriesBurned: 380,
    date: "2026-07-20",
    intensity: "High",
    notes: "Felt tough in the heat, but hit new target heart rate. Completed 5 rounds."
  },
  {
    id: "w-2",
    name: "Upper Body Hypertrophy",
    category: "Strength",
    duration: 60,
    caloriesBurned: 420,
    date: "2026-07-21",
    intensity: "Medium",
    notes: "Pushed heavy bench press. 4 sets of 8 reps. Incremental weight increase."
  },
  {
    id: "w-3",
    name: "Deep Full-Body Stretch",
    category: "Flexibility",
    duration: 25,
    caloriesBurned: 95,
    date: "2026-07-22",
    intensity: "Low",
    notes: "Mainly focused on hip openers and spinal twists. Much needed recovery."
  }
];

export const DEFAULT_NUTRITION = [
  {
    id: "n-1",
    mealType: "Breakfast",
    name: "Oatmeal with Blueberries & Whey",
    calories: 450,
    protein: 35,
    carbs: 55,
    fat: 8,
    date: "2026-07-22"
  },
  {
    id: "n-2",
    mealType: "Lunch",
    name: "Grilled Chicken Breast with Quinoa & Asparagus",
    calories: 620,
    protein: 48,
    carbs: 65,
    fat: 12,
    date: "2026-07-22"
  },
  {
    id: "n-3",
    mealType: "Dinner",
    name: "Baked Salmon Fillet with Sweet Potato",
    calories: 550,
    protein: 38,
    carbs: 45,
    fat: 22,
    date: "2026-07-22"
  }
];

export const DEFAULT_GALLERY = [
  {
    id: "g-1",
    date: "2026-06-01",
    weight: 82.5,
    notes: "Day 1 of my fitness journey. Feeling motivated but have a long way to go. Focusing on calorie deficit.",
    beforeImg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80",
    afterImg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80", // same for start
    isInitial: true
  },
  {
    id: "g-2",
    date: "2026-07-15",
    weight: 77.2,
    notes: "6 weeks progress! Strength is going up, visible improvements in body composition. Core feels much tighter.",
    beforeImg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80",
    afterImg: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
    isInitial: false
  }
];
