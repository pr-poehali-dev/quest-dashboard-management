CREATE TABLE t_p38880412_quest_dashboard_mana.quests (
  id SERIAL PRIMARY KEY,
  site_id INT REFERENCES t_p38880412_quest_dashboard_mana.sites(id),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE t_p38880412_quest_dashboard_mana.levels (
  id SERIAL PRIMARY KEY,
  quest_id INT REFERENCES t_p38880412_quest_dashboard_mana.quests(id),
  position INT NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  riddle_type TEXT NOT NULL DEFAULT 'text',
  riddle_content TEXT NOT NULL DEFAULT '',
  answer TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE t_p38880412_quest_dashboard_mana.members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'member_1',
  status TEXT NOT NULL DEFAULT 'pending',
  unique_token TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE t_p38880412_quest_dashboard_mana.member_quest_access (
  id SERIAL PRIMARY KEY,
  member_id INT REFERENCES t_p38880412_quest_dashboard_mana.members(id),
  quest_id INT REFERENCES t_p38880412_quest_dashboard_mana.quests(id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(member_id, quest_id)
);

CREATE TABLE t_p38880412_quest_dashboard_mana.progress (
  id SERIAL PRIMARY KEY,
  member_id INT REFERENCES t_p38880412_quest_dashboard_mana.members(id),
  level_id INT REFERENCES t_p38880412_quest_dashboard_mana.levels(id),
  solved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(member_id, level_id)
);

CREATE TABLE t_p38880412_quest_dashboard_mana.invite_links (
  id SERIAL PRIMARY KEY,
  token TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  method TEXT NOT NULL,
  target TEXT NOT NULL,
  quest_id INT REFERENCES t_p38880412_quest_dashboard_mana.quests(id),
  site_id INT REFERENCES t_p38880412_quest_dashboard_mana.sites(id),
  used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
