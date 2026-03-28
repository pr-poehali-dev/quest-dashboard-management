INSERT INTO t_p38880412_quest_dashboard_mana.sites (name, url, status) VALUES
  ('Квест «Тайна замка»', 'tainazamka.ru', 'active'),
  ('Квест «Городской детектив»', 'gordetektiv.ru', 'active'),
  ('Квест «Лесная загадка»', 'lesnazagadka.ru', 'pending');

INSERT INTO t_p38880412_quest_dashboard_mana.quests (site_id, name) VALUES
  (1, 'Тайна замка'), (1, 'Тёмная башня'),
  (2, 'Городской детектив'), (2, 'Ночной город'),
  (3, 'Лесная загадка');

INSERT INTO t_p38880412_quest_dashboard_mana.levels (quest_id, position, title, riddle_type, riddle_content, answer) VALUES
  (1, 1, 'Уровень 1 — Ворота', 'text', 'Что стоит посреди Волги?', 'буква'),
  (1, 2, 'Уровень 2 — Тронный зал', 'text', 'У семи братьев по одной сестре. Сколько сестёр всего?', 'одна');

INSERT INTO t_p38880412_quest_dashboard_mana.members (name, email, role, status) VALUES
  ('Иван Петров', 'ivan@example.com', 'owner', 'active'),
  ('Елена Орлова', 'elena@example.com', 'admin', 'active'),
  ('Алексей Смирнов', 'alex@example.com', 'editor', 'active'),
  ('Мария Козлова', 'maria@example.com', 'member_1', 'active'),
  ('Дмитрий Волков', 'dmitry@example.com', 'member_2', 'pending');

INSERT INTO t_p38880412_quest_dashboard_mana.member_quest_access (member_id, quest_id) VALUES
  (1,1),(1,2),(1,3),(2,1),(3,1),(3,5),(4,3);

INSERT INTO t_p38880412_quest_dashboard_mana.progress (member_id, level_id) VALUES
  (3,1),(3,2),(4,1);
