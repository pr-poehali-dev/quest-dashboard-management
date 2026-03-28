CREATE TABLE t_p38880412_quest_dashboard_mana.sites (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT DEFAULT '',
  api_key TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
