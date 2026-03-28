"""
Главный API для QuestControl: сайты, квесты, уровни, участники, приглашения, прогресс.
Маршрутизация через query-параметр ?route=<name>
"""
import json
import os
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p38880412_quest_dashboard_mana")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
}

def db():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def ok(data):
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, default=str)}

def err(msg, code=400):
    return {"statusCode": code, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": msg})}

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    route = params.get("route", "")
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    # ── STATS ──────────────────────────────────────────────
    if route == "stats" and method == "GET":
        conn = db()
        cur = conn.cursor()
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.sites")
        sites_count = cur.fetchone()[0]
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.quests")
        quests_count = cur.fetchone()[0]
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.members")
        members_count = cur.fetchone()[0]
        cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.progress")
        progress_count = cur.fetchone()[0]
        cur.close(); conn.close()
        return ok({"sites": sites_count, "quests": quests_count, "members": members_count, "levels_solved": progress_count})

    # ── SITES ──────────────────────────────────────────────
    if route == "sites" and method == "GET":
        conn = db()
        cur = conn.cursor()
        cur.execute(f"""
            SELECT s.id, s.name, s.url, s.api_key, s.status, s.created_at,
                   COUNT(DISTINCT q.id) AS quests_count,
                   COUNT(DISTINCT mqa.member_id) AS members_count
            FROM {SCHEMA}.sites s
            LEFT JOIN {SCHEMA}.quests q ON q.site_id = s.id
            LEFT JOIN {SCHEMA}.member_quest_access mqa ON mqa.quest_id = q.id
            GROUP BY s.id ORDER BY s.created_at
        """)
        cols = [d[0] for d in cur.description]
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]
        cur.close(); conn.close()
        return ok(rows)

    if route == "sites" and method == "POST":
        name = body.get("name", "").strip()
        if not name:
            return err("name required")
        conn = db()
        cur = conn.cursor()
        cur.execute(f"INSERT INTO {SCHEMA}.sites (name, url, status) VALUES (%s, %s, 'pending') RETURNING id, name, url, api_key, status, created_at",
                    (name, body.get("url", "")))
        row = cur.fetchone()
        cols = [d[0] for d in cur.description]
        conn.commit(); cur.close(); conn.close()
        return ok(dict(zip(cols, row)))

    if route == "sites" and method == "PUT":
        site_id = params.get("id")
        fields = []; vals = []
        for f in ["name", "url", "status"]:
            if f in body:
                fields.append(f"{f} = %s"); vals.append(body[f])
        if not fields or not site_id:
            return err("id and fields required")
        vals.append(site_id)
        conn = db()
        cur = conn.cursor()
        cur.execute(f"UPDATE {SCHEMA}.sites SET {', '.join(fields)} WHERE id = %s", vals)
        conn.commit(); cur.close(); conn.close()
        return ok({"ok": True})

    # ── QUESTS ─────────────────────────────────────────────
    if route == "quests" and method == "GET":
        site_id = params.get("site_id")
        conn = db()
        cur = conn.cursor()
        if site_id:
            cur.execute(f"SELECT id, site_id, name, created_at FROM {SCHEMA}.quests WHERE site_id = %s ORDER BY created_at", (site_id,))
        else:
            cur.execute(f"SELECT id, site_id, name, created_at FROM {SCHEMA}.quests ORDER BY created_at")
        cols = [d[0] for d in cur.description]
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]
        cur.close(); conn.close()
        return ok(rows)

    if route == "quests" and method == "POST":
        name = body.get("name", "").strip()
        site_id = body.get("site_id")
        if not name:
            return err("name required")
        conn = db()
        cur = conn.cursor()
        cur.execute(f"INSERT INTO {SCHEMA}.quests (site_id, name) VALUES (%s, %s) RETURNING id, site_id, name, created_at", (site_id, name))
        cols = [d[0] for d in cur.description]
        row = cur.fetchone()
        conn.commit(); cur.close(); conn.close()
        return ok(dict(zip(cols, row)))

    # ── LEVELS ─────────────────────────────────────────────
    if route == "levels" and method == "GET":
        quest_id = params.get("quest_id")
        if not quest_id:
            return err("quest_id required")
        conn = db()
        cur = conn.cursor()
        cur.execute(f"SELECT id, quest_id, position, title, riddle_type, riddle_content, answer, created_at FROM {SCHEMA}.levels WHERE quest_id = %s ORDER BY position", (quest_id,))
        cols = [d[0] for d in cur.description]
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]
        cur.close(); conn.close()
        return ok(rows)

    if route == "levels" and method == "POST":
        quest_id = body.get("quest_id")
        title = body.get("title", "Новый уровень")
        if not quest_id:
            return err("quest_id required")
        conn = db()
        cur = conn.cursor()
        cur.execute(f"SELECT COALESCE(MAX(position),0)+1 FROM {SCHEMA}.levels WHERE quest_id = %s", (quest_id,))
        pos = cur.fetchone()[0]
        cur.execute(f"""INSERT INTO {SCHEMA}.levels (quest_id, position, title, riddle_type, riddle_content, answer)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        RETURNING id, quest_id, position, title, riddle_type, riddle_content, answer""",
                    (quest_id, pos, title, body.get("riddle_type","text"), body.get("riddle_content",""), body.get("answer","")))
        cols = [d[0] for d in cur.description]
        row = cur.fetchone()
        conn.commit(); cur.close(); conn.close()
        return ok(dict(zip(cols, row)))

    if route == "levels" and method == "PUT":
        level_id = params.get("id")
        fields = []; vals = []
        for f in ["title", "riddle_type", "riddle_content", "answer", "position"]:
            if f in body:
                fields.append(f"{f} = %s"); vals.append(body[f])
        if not fields or not level_id:
            return err("id and fields required")
        vals.append(level_id)
        conn = db()
        cur = conn.cursor()
        cur.execute(f"UPDATE {SCHEMA}.levels SET {', '.join(fields)} WHERE id = %s", vals)
        conn.commit(); cur.close(); conn.close()
        return ok({"ok": True})

    # ── MEMBERS ────────────────────────────────────────────
    if route == "members" and method == "GET":
        conn = db()
        cur = conn.cursor()
        cur.execute(f"""
            SELECT m.id, m.name, m.email, m.role, m.status, m.unique_token, m.joined_at,
                   COALESCE(json_agg(DISTINCT q.name) FILTER (WHERE q.name IS NOT NULL), '[]') AS quests,
                   COUNT(DISTINCT p.level_id) AS levels_completed
            FROM {SCHEMA}.members m
            LEFT JOIN {SCHEMA}.member_quest_access mqa ON mqa.member_id = m.id
            LEFT JOIN {SCHEMA}.quests q ON q.id = mqa.quest_id
            LEFT JOIN {SCHEMA}.progress p ON p.member_id = m.id
            GROUP BY m.id ORDER BY m.joined_at
        """)
        cols = [d[0] for d in cur.description]
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]
        cur.close(); conn.close()
        return ok(rows)

    if route == "members" and method == "POST":
        name = body.get("name", "").strip()
        email = body.get("email", "").strip()
        role = body.get("role", "member_1")
        conn = db()
        cur = conn.cursor()
        cur.execute(f"INSERT INTO {SCHEMA}.members (name, email, role, status) VALUES (%s, %s, %s, 'pending') RETURNING id, name, email, role, status, unique_token, joined_at",
                    (name, email, role))
        cols = [d[0] for d in cur.description]
        row = cur.fetchone()
        conn.commit(); cur.close(); conn.close()
        return ok(dict(zip(cols, row)))

    if route == "members" and method == "PUT":
        member_id = params.get("id")
        fields = []; vals = []
        for f in ["name", "email", "role", "status"]:
            if f in body:
                fields.append(f"{f} = %s"); vals.append(body[f])
        if not fields or not member_id:
            return err("id and fields required")
        vals.append(member_id)
        conn = db()
        cur = conn.cursor()
        cur.execute(f"UPDATE {SCHEMA}.members SET {', '.join(fields)} WHERE id = %s", vals)
        conn.commit(); cur.close(); conn.close()
        return ok({"ok": True})

    # ── INVITE LINKS ───────────────────────────────────────
    if route == "invite" and method == "POST":
        method_type = body.get("method", "email")
        target = body.get("target", "").strip()
        quest_id = body.get("quest_id")
        site_id = body.get("site_id")
        if not target:
            return err("target required")
        conn = db()
        cur = conn.cursor()
        cur.execute(f"INSERT INTO {SCHEMA}.invite_links (method, target, quest_id, site_id) VALUES (%s, %s, %s, %s) RETURNING id, token, method, target, quest_id, site_id, created_at",
                    (method_type, target, quest_id, site_id))
        cols = [d[0] for d in cur.description]
        row = cur.fetchone()
        conn.commit(); cur.close(); conn.close()
        data = dict(zip(cols, row))
        data["invite_url"] = f"https://questcontrol.app/join/{data['token']}"
        return ok(data)

    if route == "invite" and method == "GET":
        conn = db()
        cur = conn.cursor()
        cur.execute(f"SELECT id, token, method, target, quest_id, site_id, used, created_at FROM {SCHEMA}.invite_links ORDER BY created_at DESC LIMIT 50")
        cols = [d[0] for d in cur.description]
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]
        cur.close(); conn.close()
        return ok(rows)

    # ── ACCESS GRANT ───────────────────────────────────────
    if route == "access_grant" and method == "POST":
        member_id = body.get("member_id")
        quest_id = body.get("quest_id")
        if not member_id or not quest_id:
            return err("member_id and quest_id required")
        conn = db()
        cur = conn.cursor()
        cur.execute(f"INSERT INTO {SCHEMA}.member_quest_access (member_id, quest_id) VALUES (%s, %s) ON CONFLICT DO NOTHING", (member_id, quest_id))
        conn.commit(); cur.close(); conn.close()
        return ok({"ok": True})

    # ── ACHIEVEMENTS ───────────────────────────────────────
    if route == "achievements" and method == "GET":
        conn = db()
        cur = conn.cursor()
        cur.execute(f"""
            SELECT m.id, m.name, m.email, m.unique_token,
                   COUNT(DISTINCT p.level_id) AS levels_completed,
                   COUNT(DISTINCT mqa.quest_id) AS quests_access,
                   MAX(p.solved_at) AS last_active
            FROM {SCHEMA}.members m
            LEFT JOIN {SCHEMA}.progress p ON p.member_id = m.id
            LEFT JOIN {SCHEMA}.member_quest_access mqa ON mqa.member_id = m.id
            WHERE m.status = 'active'
            GROUP BY m.id ORDER BY levels_completed DESC, last_active DESC NULLS LAST
        """)
        cols = [d[0] for d in cur.description]
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]
        cur.close(); conn.close()
        return ok(rows)

    return err("Not found", 404)