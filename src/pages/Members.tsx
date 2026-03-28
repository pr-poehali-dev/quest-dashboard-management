import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

type Role = "owner" | "admin" | "editor" | "member_1" | "member_2" | "member_3";

interface Member {
  id: number;
  name: string;
  email: string;
  role: Role;
  quests: string[];
  levels_completed: number;
  status: "active" | "pending" | "blocked";
  joined_at: string;
  unique_token: string;
}

const roleLabels: Record<Role, string> = {
  owner: "Владелец",
  admin: "Администратор",
  editor: "Редактор",
  member_1: "Участник I",
  member_2: "Участник II",
  member_3: "Участник III",
};

const roleColors: Record<Role, string> = {
  owner: "bg-yellow-500/15 text-yellow-400",
  admin: "bg-blue-500/15 text-blue-400",
  editor: "bg-purple-500/15 text-purple-400",
  member_1: "bg-green-500/15 text-green-400",
  member_2: "bg-emerald-500/15 text-emerald-400",
  member_3: "bg-teal-500/15 text-teal-400",
};

type InviteMethod = "email" | "telegram" | "vk" | "sms";

interface InviteModal {
  method: InviteMethod;
  open: boolean;
}

const inviteConfig: Record<InviteMethod, { label: string; icon: string; placeholder: string; hint: string; linkPrefix: string }> = {
  email: { label: "Email", icon: "Mail", placeholder: "адрес@почта.ru", hint: "Ссылка-приглашение будет отправлена на почту", linkPrefix: "mailto:" },
  telegram: { label: "Telegram", icon: "Send", placeholder: "@username или телефон", hint: "Ссылка-приглашение для отправки в Telegram", linkPrefix: "https://t.me/" },
  vk: { label: "ВКонтакте", icon: "Globe2", placeholder: "vk.com/user или короткое имя", hint: "Ссылка-приглашение для отправки ВКонтакте", linkPrefix: "https://vk.com/" },
  sms: { label: "СМС", icon: "MessageSquare", placeholder: "+7 (___) ___-__-__", hint: "Ссылка-приглашение для отправки по СМС", linkPrefix: "sms:" },
};

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<InviteModal>({ method: "telegram", open: false });
  const [inviteTarget, setInviteTarget] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("member_1");
  const [inviteResult, setInviteResult] = useState<{ url: string; method: InviteMethod } | null>(null);
  const [inviting, setInviting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.members.list().then((data) => {
      setMembers(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const openModal = (method: InviteMethod) => {
    setModal({ method, open: true });
    setInviteTarget("");
    setInviteResult(null);
    setCopied(false);
  };

  const closeModal = () => {
    setModal((m) => ({ ...m, open: false }));
    setInviteResult(null);
    setInviteTarget("");
  };

  const handleInvite = async () => {
    if (!inviteTarget.trim()) return;
    setInviting(true);
    const res = await api.invite.create({
      method: modal.method,
      target: inviteTarget.trim(),
    });
    setInviting(false);
    if (res.invite_url) {
      setInviteResult({ url: res.invite_url, method: modal.method });
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChangeRole = async (memberId: number, role: Role) => {
    await api.members.update(memberId, { role });
    setMembers(members.map((m) => (m.id === memberId ? { ...m, role } : m)));
  };

  const handleGrantAccess = async (memberId: number) => {
    await api.members.update(memberId, { status: "active" });
    setMembers(members.map((m) => (m.id === memberId ? { ...m, status: "active" } : m)));
  };

  const cfg = inviteConfig[modal.method];
  const pendingMembers = members.filter((m) => m.status === "pending");
  const activeMembers = members.filter((m) => m.status === "active");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Invite buttons row */}
      <div
        className="rounded-lg p-5"
        style={{ background: "hsl(222 40% 9%)", border: "1px solid hsl(43 85% 52% / 0.2)" }}
      >
        <h3 className="font-montserrat font-bold text-white text-sm mb-4 flex items-center gap-2">
          <Icon name="UserPlus" size={16} className="gold-text" />
          Пригласить участника
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["email", "telegram", "vk", "sms"] as InviteMethod[]).map((m) => {
            const c = inviteConfig[m];
            return (
              <button
                key={m}
                onClick={() => openModal(m)}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-yellow-500/30 transition-all group"
                style={{ background: "hsl(222 35% 12%)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ background: "hsl(43 85% 52% / 0.1)" }}
                >
                  <Icon name={c.icon} size={20} className="gold-text" />
                </div>
                <span className="font-montserrat font-semibold text-xs text-foreground">{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pending requests */}
      {pendingMembers.length > 0 && (
        <div className="navy-card rounded-lg p-5">
          <h3 className="font-montserrat font-bold text-white text-sm mb-3 flex items-center gap-2">
            <Icon name="Clock" size={16} className="gold-text" />
            Запросы на вступление
            <span className="role-badge ml-1" style={{ background: "hsl(43 85% 52% / 0.15)", color: "hsl(43 85% 60%)" }}>
              {pendingMembers.length}
            </span>
          </h3>
          <div className="space-y-3">
            {pendingMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 rounded-md"
                style={{ background: "hsl(222 35% 12%)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-montserrat font-bold text-sm flex-shrink-0"
                  style={{ background: "hsl(43 85% 52% / 0.15)", color: "hsl(43 85% 60%)" }}
                >
                  {member.name ? member.name[0] : "?"}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{member.name || "Новый участник"}</div>
                  <div className="text-xs text-muted-foreground">{member.email}</div>
                </div>
                <button
                  onClick={() => handleGrantAccess(member.id)}
                  className="gold-btn px-4 py-1.5 rounded-md text-xs flex items-center gap-1.5"
                >
                  <Icon name="Unlock" size={12} />
                  Открыть доступ
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members table */}
      <div className="navy-card rounded-lg overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-montserrat font-bold text-white text-sm flex items-center gap-2">
            <Icon name="Users" size={16} className="gold-text" />
            {loading ? "Загрузка..." : `Участники (${activeMembers.length})`}
          </h3>
        </div>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Загрузка данных...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "hsl(222 35% 10%)" }}>
                  {["Участник", "Роль", "Квесты", "Уровней", "Ссылка доступа", "Доступ"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-montserrat font-semibold uppercase tracking-wider text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeMembers.map((member, idx) => (
                  <tr key={member.id} className="border-t border-border transition-colors hover:bg-secondary/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-montserrat font-bold text-xs flex-shrink-0"
                          style={{
                            background: `hsl(${(idx * 47 + 200) % 360} 50% 30%)`,
                            color: `hsl(${(idx * 47 + 200) % 360} 80% 75%)`,
                          }}
                        >
                          {(member.name || "?")[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={member.role}
                        onChange={(e) => handleChangeRole(member.id, e.target.value as Role)}
                        disabled={member.role === "owner"}
                        className={`role-badge border-0 bg-transparent cursor-pointer focus:outline-none ${roleColors[member.role as Role] || ""} disabled:cursor-default`}
                      >
                        {(["admin", "editor", "member_1", "member_2", "member_3"] as Role[]).map((r) => (
                          <option key={r} value={r} className="bg-card text-foreground">{roleLabels[r]}</option>
                        ))}
                        {member.role === "owner" && (
                          <option value="owner" className="bg-card text-foreground">Владелец</option>
                        )}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {member.quests && member.quests.length > 0 ? (
                          member.quests.map((q) => (
                            <span key={q} className="text-xs px-2 py-0.5 rounded" style={{ background: "hsl(222 35% 15%)", color: "hsl(215 20% 65%)" }}>
                              {q}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">Нет доступа</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-center font-montserrat font-semibold gold-text">
                      {member.levels_completed ?? 0}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => navigator.clipboard.writeText(`https://questcontrol.app/join/${member.unique_token}`)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
                      >
                        <Icon name="Link" size={12} className="gold-text" />
                        <span className="max-w-24 truncate">{member.unique_token?.slice(0, 8)}...</span>
                        <Icon name="Copy" size={11} />
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: "hsl(142 70% 45%)" }} />
                        <span className="text-xs text-muted-foreground">Открыт</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── INVITE MODAL ─────────────────────────────────── */}
      {modal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: "hsl(222 47% 3% / 0.85)", backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div
            className="w-full max-w-md rounded-xl p-6 animate-fade-in"
            style={{
              background: "hsl(222 40% 9%)",
              border: "1px solid hsl(43 85% 52% / 0.3)",
              boxShadow: "0 20px 60px hsl(222 47% 3% / 0.8)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "hsl(43 85% 52% / 0.12)" }}>
                  <Icon name={cfg.icon} size={20} className="gold-text" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-white text-base">
                    Пригласить через {cfg.label}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{cfg.hint}</p>
                </div>
              </div>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="divider-gold mb-5" />

            {!inviteResult ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-montserrat font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                    {modal.method === "sms" ? "Номер телефона" : modal.method === "email" ? "Email адрес" : modal.method === "telegram" ? "Telegram username" : "VK профиль"}
                  </label>
                  <input
                    value={inviteTarget}
                    onChange={(e) => setInviteTarget(e.target.value)}
                    placeholder={cfg.placeholder}
                    className="w-full bg-secondary border border-border rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-yellow-500/50"
                    onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-montserrat font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                    Роль участника
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as Role)}
                    className="w-full bg-secondary border border-border rounded-md px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-yellow-500/50"
                  >
                    {(["admin", "editor", "member_1", "member_2", "member_3"] as Role[]).map((r) => (
                      <option key={r} value={r}>{roleLabels[r]}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleInvite}
                  disabled={inviting || !inviteTarget.trim()}
                  className="gold-btn w-full py-3 rounded-md text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {inviting ? (
                    <><Icon name="Loader2" size={16} className="animate-spin" /> Создание ссылки...</>
                  ) : (
                    <><Icon name="Link" size={16} /> Создать ссылку-приглашение</>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="text-center py-2">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ background: "hsl(43 85% 52% / 0.15)" }}
                  >
                    <Icon name="CheckCircle" size={24} className="gold-text" />
                  </div>
                  <p className="font-montserrat font-semibold text-white mb-1">Ссылка создана!</p>
                  <p className="text-xs text-muted-foreground">Отправьте эту ссылку участнику</p>
                </div>

                {/* Link button */}
                <div
                  className="rounded-lg p-4"
                  style={{ background: "hsl(222 47% 5%)", border: "1px solid hsl(43 85% 52% / 0.2)" }}
                >
                  <div className="text-xs text-muted-foreground mb-2 font-montserrat font-semibold uppercase tracking-wider">
                    Ссылка-приглашение
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs text-foreground font-mono truncate">
                      {inviteResult.url}
                    </code>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(inviteResult.url)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-montserrat font-semibold transition-all"
                    style={{
                      background: copied ? "hsl(142 50% 20%)" : "hsl(43 85% 52% / 0.1)",
                      color: copied ? "hsl(142 70% 60%)" : "hsl(43 85% 60%)",
                      border: `1px solid ${copied ? "hsl(142 50% 30%)" : "hsl(43 85% 52% / 0.2)"}`,
                    }}
                  >
                    <Icon name={copied ? "Check" : "Copy"} size={15} />
                    {copied ? "Скопировано!" : "Копировать"}
                  </button>

                  {/* Open in app button */}
                  <a
                    href={
                      modal.method === "telegram"
                        ? `https://t.me/share/url?url=${encodeURIComponent(inviteResult.url)}&text=${encodeURIComponent("Приглашение в квест QuestControl")}`
                        : modal.method === "vk"
                        ? `https://vk.com/share.php?url=${encodeURIComponent(inviteResult.url)}&title=${encodeURIComponent("Приглашение в квест")}`
                        : modal.method === "sms"
                        ? `sms:${inviteTarget}?body=${encodeURIComponent("Вас приглашают в квест: " + inviteResult.url)}`
                        : `mailto:${inviteTarget}?subject=${encodeURIComponent("Приглашение в квест QuestControl")}&body=${encodeURIComponent("Вас приглашают: " + inviteResult.url)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gold-btn flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm no-underline"
                  >
                    <Icon name={inviteConfig[modal.method].icon} size={15} />
                    Открыть в {inviteConfig[modal.method].label}
                  </a>
                </div>

                <button
                  onClick={() => { setInviteResult(null); setInviteTarget(""); }}
                  className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  Отправить ещё одно приглашение
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
