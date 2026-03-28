import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Section } from "@/App";
import { api } from "@/lib/api";

interface DashboardProps {
  onNavigate: (section: Section) => void;
}

const recentActivity = [
  { text: "Алексей прошёл уровень 3 в «Тайне замка»", time: "5 мин назад", icon: "CheckCircle" },
  { text: "Новая заявка на участие от Марии", time: "22 мин назад", icon: "UserPlus" },
  { text: "Добавлен новый квест «Городской детектив»", time: "2 ч назад", icon: "Map" },
  { text: "Дмитрий запросил доступ к квесту", time: "3 ч назад", icon: "Lock" },
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [acceptedSite, setAcceptedSite] = useState(false);
  const [acceptedIds, setAcceptedIds] = useState<number[]>([]);
  const [statsData, setStatsData] = useState({ sites: 0, quests: 0, members: 0, levels_solved: 0 });
  const [pendingMembers, setPendingMembers] = useState<{ id: number; name: string; email: string; joined_at: string }[]>([]);

  useEffect(() => {
    api.stats().then((d) => { if (d && !d.error) setStatsData(d); });
    api.members.list().then((data) => {
      if (Array.isArray(data)) {
        setPendingMembers(data.filter((m: { status: string }) => m.status === "pending"));
      }
    });
  }, []);

  const handleAcceptSite = () => {
    setAcceptedSite(true);
    setTimeout(() => setAcceptedSite(false), 3000);
  };

  const handleAcceptRequest = async (id: number) => {
    await api.members.update(id, { status: "active" });
    setAcceptedIds((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero action */}
      <div
        className="rounded-lg p-6 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, hsl(222 45% 11%) 0%, hsl(230 40% 13%) 100%)",
          border: "1px solid hsl(43 85% 52% / 0.2)",
        }}
      >
        <div>
          <h2 className="font-montserrat font-bold text-xl text-white mb-1">
            Добро пожаловать в QuestControl
          </h2>
          <p className="text-sm text-muted-foreground">
            Управляйте квестами, участниками и сайтами из единой точки
          </p>
        </div>
        <button
          onClick={handleAcceptSite}
          className="gold-btn px-6 py-3 rounded-md text-sm whitespace-nowrap"
        >
          {acceptedSite ? (
            <span className="flex items-center gap-2">
              <Icon name="CheckCircle" size={16} /> Дополнение принято
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Icon name="Plus" size={16} /> Принять дополнение
            </span>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Активных сайтов", value: statsData.sites, icon: "Globe", trend: "подключено" },
          { label: "Квестов всего", value: statsData.quests, icon: "Map", trend: "путей" },
          { label: "Участников", value: statsData.members, icon: "Users", trend: "зарегистрировано" },
          { label: "Пройдено уровней", value: statsData.levels_solved, icon: "Trophy", trend: "за всё время" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card navy-card rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-9 h-9 rounded-md flex items-center justify-center"
                style={{ background: "hsl(43 85% 52% / 0.1)" }}
              >
                <Icon name={stat.icon} size={18} className="gold-text" />
              </div>
            </div>
            <div className="font-montserrat font-bold text-2xl text-white mb-1">{stat.value}</div>
            <div className="text-xs font-medium text-foreground mb-0.5">{stat.label}</div>
            <div className="text-xs text-muted-foreground">{stat.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending requests */}
        <div className="navy-card rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-montserrat font-semibold text-sm text-white flex items-center gap-2">
              <Icon name="UserCheck" size={16} className="gold-text" />
              Запросы на участие
            </h3>
            <span
              className="text-xs font-montserrat font-bold px-2 py-0.5 rounded"
              style={{ background: "hsl(43 85% 52% / 0.15)", color: "hsl(43 85% 60%)" }}
            >
              {pendingMembers.filter(m => !acceptedIds.includes(m.id)).length}
            </span>
          </div>

          <div className="space-y-3">
            {pendingMembers.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">Нет новых запросов</p>
            )}
            {pendingMembers.map((req) => (
              <div
                key={req.id}
                className={`flex items-center gap-3 p-3 rounded-md transition-all duration-300 ${acceptedIds.includes(req.id) ? "opacity-40" : ""}`}
                style={{ background: "hsl(222 35% 12%)" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-montserrat font-bold text-xs"
                  style={{ background: "hsl(43 85% 52% / 0.15)", color: "hsl(43 85% 60%)" }}
                >
                  {(req.name || "?")[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{req.name || "Новый участник"}</div>
                  <div className="text-xs text-muted-foreground truncate">{req.email}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!acceptedIds.includes(req.id) ? (
                    <button
                      onClick={() => handleAcceptRequest(req.id)}
                      className="gold-btn px-3 py-1.5 rounded text-xs"
                    >
                      Принять
                    </button>
                  ) : (
                    <span className="text-xs gold-text font-semibold">Принят</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="navy-card rounded-lg p-5">
          <h3 className="font-montserrat font-semibold text-sm text-white flex items-center gap-2 mb-4">
            <Icon name="Activity" size={16} className="gold-text" />
            Последняя активность
          </h3>
          <div className="space-y-3">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "hsl(43 85% 52% / 0.1)" }}
                >
                  <Icon name={item.icon} size={13} className="gold-text" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-foreground">{item.text}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick nav */}
      <div>
        <h3 className="font-montserrat font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Быстрый доступ
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Добавить сайт", icon: "Globe", section: "sites" as Section },
            { label: "Новый квест", icon: "Map", section: "quests" as Section },
            { label: "Пригласить участника", icon: "UserPlus", section: "members" as Section },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.section)}
              className="flex items-center gap-3 p-4 rounded-md text-sm font-medium transition-all hover:border-yellow-500/30"
              style={{
                background: "hsl(222 40% 9%)",
                border: "1px solid hsl(222 30% 18%)",
                color: "hsl(210 40% 85%)",
              }}
            >
              <Icon name={item.icon} size={18} className="gold-text" />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}