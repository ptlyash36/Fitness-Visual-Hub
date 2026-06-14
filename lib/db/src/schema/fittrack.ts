import { pgTable, serial, text, integer, real, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const workoutCategoryEnum = pgEnum("workout_category", ["Cardio", "Strength", "Yoga", "HIIT"]);
export const mealTypeEnum = pgEnum("meal_type", ["Breakfast", "Lunch", "Dinner", "Snack"]);
export const goalTypeEnum = pgEnum("goal_type", ["WeightLoss", "MuscleGain", "Steps", "Cardio", "Custom"]);

export const dashboardStatsTable = pgTable("dashboard_stats", {
  id: serial("id").primaryKey(),
  steps: integer("steps").notNull().default(0),
  caloriesBurned: integer("calories_burned").notNull().default(0),
  waterIntakeMl: integer("water_intake_ml").notNull().default(0),
  sleepHours: real("sleep_hours").notNull().default(0),
  heartRate: integer("heart_rate").notNull().default(0),
  bmiValue: real("bmi_value").notNull().default(0),
  weightKg: real("weight_kg").notNull().default(0),
  date: text("date").notNull(),
});

export const workoutsTable = pgTable("workouts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: workoutCategoryEnum("category").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  exercises: text("exercises").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const mealsTable = pgTable("meals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  calories: integer("calories").notNull(),
  protein: real("protein").notNull().default(0),
  carbs: real("carbs").notNull().default(0),
  fat: real("fat").notNull().default(0),
  mealType: mealTypeEnum("meal_type").notNull(),
  loggedAt: timestamp("logged_at").notNull().defaultNow(),
});

export const goalsTable = pgTable("goals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: goalTypeEnum("type").notNull(),
  targetValue: real("target_value").notNull(),
  currentValue: real("current_value").notNull().default(0),
  unit: text("unit").notNull(),
  deadline: text("deadline"),
  achieved: boolean("achieved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const measurementsTable = pgTable("measurements", {
  id: serial("id").primaryKey(),
  weightKg: real("weight_kg").notNull(),
  chestCm: real("chest_cm"),
  waistCm: real("waist_cm"),
  hipsCm: real("hips_cm"),
  loggedAt: timestamp("logged_at").notNull().defaultNow(),
});

export const communityPostsTable = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  avatarUrl: text("avatar_url"),
  content: text("content").notNull(),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const trainersTable = pgTable("trainers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  specialty: text("specialty").notNull(),
  rating: real("rating").notNull().default(5),
  reviewCount: integer("review_count").notNull().default(0),
  hourlyRate: integer("hourly_rate").notNull().default(50),
  bio: text("bio").notNull(),
  available: boolean("available").notNull().default(true),
});

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").notNull().references(() => trainersTable.id),
  clientName: text("client_name").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  status: text("status").notNull().default("confirmed"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDashboardStatsSchema = createInsertSchema(dashboardStatsTable).omit({ id: true });
export const insertWorkoutSchema = createInsertSchema(workoutsTable).omit({ id: true, createdAt: true });
export const insertMealSchema = createInsertSchema(mealsTable).omit({ id: true, loggedAt: true });
export const insertGoalSchema = createInsertSchema(goalsTable).omit({ id: true, createdAt: true });
export const insertMeasurementSchema = createInsertSchema(measurementsTable).omit({ id: true, loggedAt: true });
export const insertCommunityPostSchema = createInsertSchema(communityPostsTable).omit({ id: true, createdAt: true, likes: true });
export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true, status: true });

export type DashboardStats = typeof dashboardStatsTable.$inferSelect;
export type Workout = typeof workoutsTable.$inferSelect;
export type Meal = typeof mealsTable.$inferSelect;
export type Goal = typeof goalsTable.$inferSelect;
export type Measurement = typeof measurementsTable.$inferSelect;
export type CommunityPost = typeof communityPostsTable.$inferSelect;
export type Trainer = typeof trainersTable.$inferSelect;
export type Booking = typeof bookingsTable.$inferSelect;
