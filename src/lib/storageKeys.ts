/**
 * Centralised localStorage key registry.
 *
 * Rules:
 *   1. All new keys MUST be added here — never hardcode strings in components.
 *   2. Use snake_case with `neome_` prefix for all production keys.
 *   3. User-scoped keys take a userId parameter.
 *   4. Date-scoped keys take an ISO date string parameter.
 *   5. Demo/temp keys use `demo_` or `neome_temp_` prefix.
 */

// ── Cycle / Period ──────────────────────────────────────────
export const CYCLE_DATA = 'cycle_data';
export const cycleDataForCode = (code: string) => `cycle_data_${code}`;
export const SYMPTOM_LOG = 'neome-symptom-log';
export const symptomsByDate = (date: string) => `neome-symptoms-${date}`;
export const PERIOD_HISTORY = 'neome-period-history';
export const PERIOD_LOGGED_AT = 'neome-period-logged-at';
export const PERIOD_PROMPT_SNOOZED = 'neome-period-prompt-snoozed-until';
export const CUSTOM_SYMPTOMS = 'neome-custom-symptoms';

// ── Nutrition ───────────────────────────────────────────────
export const MEAL_PLAN = 'neome-meal-plan';
export const NUTRITION_PROFILE = 'neome-nutrition-profile';
export const FAVORITE_RECIPES = 'neome-favorite-recipes';

// ── Habits ──────────────────────────────────────────────────
export const HABITS = 'neome-habits';
export const habitsForUser = (userId: string, date: string) => `navyky_${userId}_${date}`;
export const habitsWeek = (userId: string) => `navyky_week_${userId}`;
export const habitsLastReset = (userId: string) => `navyky_last_reset_${userId}`;
export const userHabits = (userId: string) => `user_habits_${userId}`;
export const habitProgress = (habitId: string, date: string) => `habit_progress_${habitId}_${date}`;

// ── Diary / Reflection ──────────────────────────────────────
export const DIARY_ENTRIES = 'neome-diary-entries';

// ── Community ───────────────────────────────────────────────
export const REPORTS = 'neome-reports';

// ── User / Auth ─────────────────────────────────────────────
export const LOGIN_COUNT = 'neome-login-count';
export const SUBSCRIPTION = 'neome-subscription';
export const REFERRAL = 'neome-referral';
export const ONBOARDING_DONE = 'neome-onboarding-done';
export const subscriptionForUser = (userId: string) => `subscription_${userId}`;

// ── Demo mode ───────────────────────────────────────────────
export const DEMO_SESSION = 'demo_session';
export const DEMO_USER = 'demo_user';
export const DEMO_PROFILE = 'demo_profile';
export const DEMO_USER_NAME = 'demo_user_name';

// ── Achievements / Gamification ─────────────────────────────
export const achievements = (userId: string) => `neome_achievements_${userId}`;
export const points = (userId: string) => `neome_points_${userId}`;
export const activities = (userId: string) => `neome_activities_${userId}`;

// ── Workout ─────────────────────────────────────────────────
export const workoutHistory = (userId: string) => `neome_workout_history_${userId}`;
export const workoutStreak = (userId: string) => `neome_workout_streak_${userId}`;

// ── Buddy system ────────────────────────────────────────────
export const buddyCode = (userId: string) => `neome_buddy_code_${userId}`;
export const buddyConnections = (userId: string) => `neome_buddy_connections_${userId}`;
export const buddyRequests = (userId: string) => `neome_buddy_requests_${userId}`;
export const buddyNotifications = (userId: string) => `neome_buddy_notifications_${userId}`;

// ── Mood / Energy ───────────────────────────────────────────
export const moodEnergy = (userId: string, date: string) => `mood_energy_${userId}_${date}`;
export const waterIntake = (userId: string, date: string) => `water_intake_${userId}_${date}`;

// ── Favorites ───────────────────────────────────────────────
export const FAVORITES_LOCAL = 'neome-favorites-local';
export const favoritesMetadata = (userId: string) => `neome_favorites_metadata_${userId}`;

// ── Admin ───────────────────────────────────────────────────
export const ADMIN_DESKTOP_MODE = 'neome_admin_desktop_mode';
export const ADMIN_VIDEOS = 'neome_admin_videos';
export const ADMIN_PHOTOS = 'neome_admin_photos';
