# PocketBase Schema Requirements

## Users Collection (System Auth)
* **Type**: Auth
* **Fields**:
  - `power_level` (Number, default: 5)
  - `zenkai_boosts` (Number, default: 0)
  - `active_zenkai_multiplier` (Number, default: 1)
  - `zenkai_attempts_left` (Number, default: 0)
  - `current_form` (Text, default: 'base')
  - `skill_points` (Number, default: 0)
  - `unlocked_skills` (JSON array, default: ["basic_knowledge"])
  - `daily_quests` (JSON, default: {})
  - `last_login` (Date)
  - `display_name` (Text)
  - `bio` (Text, max: 200)
  - `avatar_url` (URL)
  - `show_on_leaderboard` (Bool, default: true)
  - `streak` (Number, default: 0)

## Questions Collection
* **Type**: Base
* **Fields**:
  - `content` (Text)
  - `options` (JSON Array of strings)
  - `correct_answer` (Number)
  - `difficulty_tier` (Number)
  - `explanation` (Text)
  - `series_slug` (Text)

## Leaderboard Collection
* **Type**: Base
* **Fields**:
  - `user` (Relation to `users`, max Select: 1)
  - `score` (Number)
  - `streak` (Number)
  - `consecutive_wrong` (Number)

*Ensure `leaderboard` collection has relation `user` expanded in queries that need to display user information.*
