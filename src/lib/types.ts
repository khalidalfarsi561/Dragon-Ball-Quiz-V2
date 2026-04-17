export interface UserRecord {
  id: string;
  username: string;
  email: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  show_on_leaderboard: boolean;
  power_level: number;
  streak: number; 
  zenkai_boosts: number;
  active_zenkai_multiplier: number;
  zenkai_attempts_left: number;
  current_form: string;
  skill_points: number;
  unlocked_skills: string[]; // JSON array of skill ids
  daily_quests: Record<string, any>; // JSON
  last_login: string;
  created: string;
  updated: string;
}

export interface QuestionRecord {
  id: string;
  content: string;
  options: string[]; // JSON array
  correct_answer: number;
  difficulty_tier: number;
  explanation: string;
  series_slug: string;
}

export interface LeaderboardRecord {
  id: string;
  user: string; // Relation to users
  score: number;
  streak: number;
  consecutive_wrong: number;
  expand?: {
    user: UserRecord;
  }
}

export interface SeriesConfig {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  questionCount: number;
}
