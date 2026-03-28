import Icon from "@/components/ui/icon";

const achievements = [
  {
    name: "Алексей Смирнов",
    email: "alex@example.com",
    site: "Тайна замка",
    questsCompleted: 2,
    levelsCompleted: 8,
    totalLevels: 12,
    lastActive: "27 марта, 18:42",
    uniqueLink: "https://questcontrol.app/q/abc123",
    rank: 1,
  },
  {
    name: "Елена Орлова",
    email: "elena@example.com",
    site: "Городской детектив",
    questsCompleted: 1,
    levelsCompleted: 6,
    totalLevels: 12,
    lastActive: "27 марта, 15:10",
    uniqueLink: "https://questcontrol.app/q/def456",
    rank: 2,
  },
  {
    name: "Мария Козлова",
    email: "maria@example.com",
    site: "Тайна замка",
    questsCompleted: 1,
    levelsCompleted: 5,
    totalLevels: 12,
    lastActive: "26 марта, 21:05",
    uniqueLink: "https://questcontrol.app/q/ghi789",
    rank: 3,
  },
  {
    name: "Дмитрий Волков",
    email: "dmitry@example.com",
    site: "Лесная загадка",
    questsCompleted: 0,
    levelsCompleted: 2,
    totalLevels: 12,
    lastActive: "26 марта, 09:30",
    uniqueLink: "https://questcontrol.app/q/jkl012",
    rank: 4,
  },
  {
    name: "Сергей Новиков",
    email: "sergey@example.com",
    site: "Городской детектив",
    questsCompleted: 0,
    levelsCompleted: 1,
    totalLevels: 12,
    lastActive: "25 марта, 14:20",
    uniqueLink: "https://questcontrol.app/q/mno345",
    rank: 5,
  },
];

const rankBadge = (rank: number) => {
  if (rank === 1) return { bg: "linear-gradient(135deg, hsl(43 85% 52%), hsl(38 75% 42%))", color: "hsl(222 47% 6%)", label: "🥇" };
  if (rank === 2) return { bg: "hsl(220 15% 55%)", color: "white", label: "🥈" };
  if (rank === 3) return { bg: "hsl(25 60% 50%)", color: "white", label: "🥉" };
  return { bg: "hsl(222 35% 18%)", color: "hsl(215 20% 65%)", label: String(rank) };
};

export default function Achievements() {
  const topThree = achievements.slice(0, 3);
  const rest = achievements.slice(3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Podium */}
      <div className="navy-card rounded-lg p-6">
        <h3 className="font-montserrat font-bold text-white text-sm flex items-center gap-2 mb-6">
          <Icon name="Trophy" size={16} className="gold-text" />
          Топ участников
        </h3>
        <div className="flex items-end justify-center gap-4 mb-4">
          {/* 2nd */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-montserrat font-bold text-sm"
              style={{ background: "hsl(220 20% 30%)", color: "hsl(220 20% 80%)" }}
            >
              {topThree[1].name[0]}
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-foreground">{topThree[1].name.split(" ")[0]}</div>
              <div className="text-xs gold-text font-montserrat font-bold">{topThree[1].levelsCompleted} ур.</div>
            </div>
            <div
              className="w-24 flex items-center justify-center font-montserrat font-bold text-xl py-4 rounded-t-md"
              style={{ height: "80px", background: "hsl(220 15% 18%)", border: "1px solid hsl(220 15% 25%)" }}
            >
              🥈
            </div>
          </div>

          {/* 1st */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-montserrat font-bold text-base"
              style={{
                background: "linear-gradient(135deg, hsl(43 85% 52%), hsl(38 75% 42%))",
                color: "hsl(222 47% 6%)",
              }}
            >
              {topThree[0].name[0]}
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-white">{topThree[0].name.split(" ")[0]}</div>
              <div className="text-xs gold-text font-montserrat font-bold">{topThree[0].levelsCompleted} ур.</div>
            </div>
            <div
              className="w-24 flex items-center justify-center font-montserrat font-bold text-xl py-4 rounded-t-md"
              style={{
                height: "110px",
                background: "linear-gradient(180deg, hsl(43 85% 52% / 0.15), hsl(222 40% 12%))",
                border: "1px solid hsl(43 85% 52% / 0.3)",
              }}
            >
              🥇
            </div>
          </div>

          {/* 3rd */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-montserrat font-bold text-sm"
              style={{ background: "hsl(25 40% 25%)", color: "hsl(25 60% 65%)" }}
            >
              {topThree[2].name[0]}
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-foreground">{topThree[2].name.split(" ")[0]}</div>
              <div className="text-xs gold-text font-montserrat font-bold">{topThree[2].levelsCompleted} ур.</div>
            </div>
            <div
              className="w-24 flex items-center justify-center font-montserrat font-bold text-xl py-4 rounded-t-md"
              style={{ height: "60px", background: "hsl(25 30% 16%)", border: "1px solid hsl(25 30% 22%)" }}
            >
              🥉
            </div>
          </div>
        </div>
      </div>

      {/* Full table */}
      <div className="navy-card rounded-lg overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-montserrat font-bold text-white text-sm flex items-center gap-2">
            <Icon name="BarChart3" size={16} className="gold-text" />
            Таблица достижений
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "hsl(222 35% 10%)" }}>
                {["#", "Участник", "Сайт", "Квестов", "Уровней", "Прогресс", "Уникальная ссылка", "Активность"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-montserrat font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {achievements.map((a) => {
                const badge = rankBadge(a.rank);
                const progress = Math.round((a.levelsCompleted / a.totalLevels) * 100);
                return (
                  <tr
                    key={a.rank}
                    className="border-t border-border hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-montserrat font-bold text-xs"
                        style={{ background: badge.bg, color: badge.color }}
                      >
                        {badge.label}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-white whitespace-nowrap">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-1 rounded whitespace-nowrap"
                        style={{ background: "hsl(222 35% 15%)", color: "hsl(215 20% 65%)" }}
                      >
                        {a.site}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-montserrat font-semibold gold-text">
                      {a.questsCompleted}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-foreground">
                      {a.levelsCompleted}/{a.totalLevels}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 min-w-24">
                        <div className="flex-1 h-1.5 rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${progress}%`,
                              background: "linear-gradient(90deg, hsl(43 85% 52%), hsl(38 75% 42%))",
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8">{progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigator.clipboard.writeText(a.uniqueLink)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Icon name="Link" size={12} className="gold-text" />
                        <span className="max-w-28 truncate">{a.uniqueLink.split("/").pop()}</span>
                        <Icon name="Copy" size={11} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {a.lastActive}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
