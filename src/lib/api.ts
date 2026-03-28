const BASE = "https://functions.poehali.dev/a01f326c-aab4-449f-aedf-c99aa6e3c685";

async function req(route: string, method = "GET", body?: object, params?: Record<string, string>) {
  const url = new URL(BASE);
  url.searchParams.set("route", route);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export const api = {
  stats: () => req("stats"),
  sites: {
    list: () => req("sites"),
    create: (data: { name: string; url?: string }) => req("sites", "POST", data),
    update: (id: number, data: object) => req("sites", "PUT", data, { id: String(id) }),
  },
  quests: {
    list: (site_id?: number) => req("quests", "GET", undefined, site_id ? { site_id: String(site_id) } : undefined),
    create: (data: { name: string; site_id?: number }) => req("quests", "POST", data),
  },
  levels: {
    list: (quest_id: number) => req("levels", "GET", undefined, { quest_id: String(quest_id) }),
    create: (data: object) => req("levels", "POST", data),
    update: (id: number, data: object) => req("levels", "PUT", data, { id: String(id) }),
  },
  members: {
    list: () => req("members"),
    create: (data: object) => req("members", "POST", data),
    update: (id: number, data: object) => req("members", "PUT", data, { id: String(id) }),
  },
  invite: {
    create: (data: { method: string; target: string; quest_id?: number; site_id?: number }) =>
      req("invite", "POST", data),
    list: () => req("invite"),
  },
  access: {
    grant: (member_id: number, quest_id: number) =>
      req("access_grant", "POST", { member_id, quest_id }),
  },
  achievements: () => req("achievements"),
};
