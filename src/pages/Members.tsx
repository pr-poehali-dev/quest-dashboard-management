import { useState } from "react";
import Icon from "@/components/ui/icon";

type Role = "owner" | "admin" | "editor" | "member_1" | "member_2" | "member_3";

interface Member {
  id: number;
  name: string;
  email: string;
  role: Role;
  quests: string[];
  progress: number;
  status: "active" | "pending" | "blocked";
  joinDate: string;
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

const initialMembers: Member[] = [
  { id: 1, name: "Иван Петров", email: "ivan@example.com", role: "owner", quests: ["Тайна замка", "Городской детектив"], progress: 100, status: "active", joinDate: "01 января" },
  { id: 2, name: "Елена Орлова", email: "elena@example.com", role: "admin", quests: ["Тайна замка"], progress: 85, status: "active", joinDate: "10 февраля" },
  { id: 3, name: "Алексей Смирнов", email: "alex@example.com", role: "editor", quests: ["Тайна замка", "Лесная загадка"], progress: 60, status: "active", joinDate: "15 февраля" },
  { id: 4, name: "Мария Козлова", email: "maria@example.com", role: "member_1", quests: ["Городской детектив"], progress: 40, status: "active", joinDate: "01 марта" },
  { id: 5, name: "Дмитрий Волков", email: "dmitry@example.com", role: "member_2", quests: [], progress: 0, status: "pending", joinDate: "27 марта" },
];

type InviteMethod = "email" | "telegram" | "vk" | "sms";

const inviteMethods: { id: InviteMethod; label: string; icon: string; placeholder: string }[] = [
  { id: "email", label: "Email", icon: "Mail", placeholder: "адрес@почта.ru" },
  { id: "telegram", label: "Telegram", icon: "Send", placeholder: "@username или телефон" },
  { id: "vk", label: "ВКонтакте", icon: "Globe2", placeholder: "vk.com/user или ID" },
  { id: "sms", label: "СМС", icon: "MessageSquare", placeholder: "+7 (___) ___-__-__" },
];

export default function Members() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [inviteMethod, setInviteMethod] = useState<InviteMethod>("email");
  const [inviteValue, setInviteValue] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("member_1");
  const [inviteSent, setInviteSent] = useState(false);
  const [grantedIds, setGrantedIds] = useState<number[]>([]);

  const handleInvite = () => {
    if (!inviteValue.trim()) return;
    setInviteSent(true);
    setTimeout(() => setInviteSent(false), 3000);
    setInviteValue("");
  };

  const handleChangeRole = (memberId: number, role: Role) => {
    setMembers(members.map((m) => (m.id === memberId ? { ...m, role } : m)));
  };

  const handleGrantAccess = (memberId: number) => {
    setMembers(members.map((m) => (m.id === memberId ? { ...m, status: "active" } : m)));
    setGrantedIds((prev) => [...prev, memberId]);
  };

  const pendingMembers = members.filter((m) => m.status === "pending");
  const activeMembers = members.filter((m) => m.status === "active");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Invite block */}
      <div
        className="rounded-lg p-5"
        style={{
          background: "hsl(222 40% 9%)",
          border: "1px solid hsl(43 85% 52% / 0.2)",
        }}
      >
        <h3 className="font-montserrat font-bold text-white text-sm mb-4 flex items-center gap-2">
          <Icon name="UserPlus" size={16} className="gold-text" />
          Пригласить участника
        </h3>

        {/* Method tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {inviteMethods.map((m) => (
            <button
              key={m.id}
              onClick={() => setInviteMethod(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium font-montserrat transition-all ${
                inviteMethod === m.id
                  ? "gold-btn"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon name={m.icon} size={12} />
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap">
          <input
            value={inviteValue}
            onChange={(e) => setInviteValue(e.target.value)}
            placeholder={inviteMethods.find((m) => m.id === inviteMethod)?.placeholder}
            className="flex-1 min-w-48 bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-yellow-500/50"
            onKeyDown={(e) => e.key === "Enter" && handleInvite()}
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as Role)}
            className="bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-yellow-500/50"
          >
            {(["admin", "editor", "member_1", "member_2", "member_3"] as Role[]).map((r) => (
              <option key={r} value={r}>{roleLabels[r]}</option>
            ))}
          </select>
          <button onClick={handleInvite} className="gold-btn px-5 py-2 rounded-md text-sm">
            {inviteSent ? "Отправлено!" : "Пригласить"}
          </button>
        </div>
      </div>

      {/* Pending requests */}
      {pendingMembers.length > 0 && (
        <div className="navy-card rounded-lg p-5">
          <h3 className="font-montserrat font-bold text-white text-sm mb-3 flex items-center gap-2">
            <Icon name="Clock" size={16} className="gold-text" />
            Запросы на вступление
            <span
              className="role-badge ml-1"
              style={{ background: "hsl(43 85% 52% / 0.15)", color: "hsl(43 85% 60%)" }}
            >
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
                  {member.name[0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{member.name}</div>
                  <div className="text-xs text-muted-foreground">{member.email}</div>
                </div>
                <span className="text-xs text-muted-foreground">{member.joinDate}</span>
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
            Участники ({activeMembers.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "hsl(222 35% 10%)" }}>
                {["Участник", "Роль", "Квесты", "Прогресс", "Доступ"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs font-montserrat font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeMembers.map((member, idx) => (
                <tr
                  key={member.id}
                  className="border-t border-border transition-colors hover:bg-secondary/30"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-montserrat font-bold text-xs flex-shrink-0"
                        style={{
                          background: `hsl(${(idx * 47 + 200) % 360} 50% 30%)`,
                          color: `hsl(${(idx * 47 + 200) % 360} 80% 75%)`,
                        }}
                      >
                        {member.name[0]}
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
                      className={`role-badge border-0 bg-transparent cursor-pointer focus:outline-none ${roleColors[member.role]} disabled:cursor-default`}
                    >
                      {(["admin", "editor", "member_1", "member_2", "member_3"] as Role[]).map((r) => (
                        <option key={r} value={r} className="bg-card text-foreground">
                          {roleLabels[r]}
                        </option>
                      ))}
                      {member.role === "owner" && (
                        <option value="owner" className="bg-card text-foreground">Владелец</option>
                      )}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {member.quests.length > 0 ? (
                        member.quests.map((q) => (
                          <span
                            key={q}
                            className="text-xs px-2 py-0.5 rounded"
                            style={{ background: "hsl(222 35% 15%)", color: "hsl(215 20% 65%)" }}
                          >
                            {q}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">Нет доступа</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-secondary max-w-20">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${member.progress}%`,
                            background: "linear-gradient(90deg, hsl(43 85% 52%), hsl(38 75% 42%))",
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{member.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: "hsl(142 70% 45%)" }}
                      />
                      <span className="text-xs text-muted-foreground">Открыт</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
