import Icon from "@/components/ui/icon";

const userQuests = [
  { id: "q1", name: "Тайна замка", site: "tainazamka.ru", progress: 75, levels: 9, totalLevels: 12, uniqueLink: "https://questcontrol.app/join/alex-tainazamka" },
  { id: "q2", name: "Городской детектив", site: "gordetektiv.ru", progress: 40, levels: 4, totalLevels: 10, uniqueLink: "https://questcontrol.app/join/alex-gordetektiv" },
];

export default function Profile() {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* User card */}
      <div
        className="rounded-lg p-6"
        style={{
          background: "linear-gradient(135deg, hsl(222 45% 10%) 0%, hsl(230 40% 12%) 100%)",
          border: "1px solid hsl(43 85% 52% / 0.2)",
        }}
      >
        <div className="flex items-center gap-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-montserrat font-bold text-2xl flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, hsl(43 85% 52%), hsl(38 75% 42%))",
              color: "hsl(222 47% 6%)",
            }}
          >
            А
          </div>
          <div className="flex-1">
            <h2 className="font-montserrat font-bold text-white text-xl">Алексей Смирнов</h2>
            <div className="text-sm text-muted-foreground mt-0.5">alex@example.com</div>
            <div className="flex items-center gap-3 mt-2">
              <span
                className="role-badge"
                style={{ background: "hsl(142 50% 20%)", color: "hsl(142 70% 60%)" }}
              >
                Участник I
              </span>
              <span className="text-xs text-muted-foreground">Участник с 1 марта 2026</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-montserrat font-bold text-2xl gold-text">75%</div>
            <div className="text-xs text-muted-foreground">Общий прогресс</div>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="navy-card rounded-lg p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-montserrat font-bold text-white text-sm mb-1 flex items-center gap-2">
              <Icon name="CreditCard" size={16} className="gold-text" />
              Оплата участия
            </h3>
            <p className="text-xs text-muted-foreground">
              Оплатите участие в квестах через ЮMoney
            </p>
          </div>
          <a
            href="https://yoomoney.ru/to/410017253212598/0"
            target="_blank"
            rel="noopener noreferrer"
            className="gold-btn px-6 py-3 rounded-md text-sm flex items-center gap-2 no-underline"
          >
            <Icon name="Wallet" size={16} />
            Оплата
          </a>
        </div>
      </div>

      {/* Quests */}
      <div>
        <h3 className="font-montserrat font-bold text-white text-sm mb-3 flex items-center gap-2">
          <Icon name="Map" size={16} className="gold-text" />
          Мои квесты
        </h3>

        <div className="space-y-3">
          {userQuests.map((quest) => (
            <div key={quest.id} className="navy-card rounded-lg p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h4 className="font-montserrat font-bold text-white text-base mb-0.5">
                    {quest.name}
                  </h4>
                  <div className="text-xs text-muted-foreground">{quest.site}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-montserrat font-bold gold-text">{quest.progress}%</div>
                  <div className="text-xs text-muted-foreground">{quest.levels}/{quest.totalLevels} ур.</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-secondary mb-4">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${quest.progress}%`,
                    background: "linear-gradient(90deg, hsl(43 85% 52%), hsl(38 75% 42%))",
                  }}
                />
              </div>

              {/* Unique link */}
              <div
                className="flex items-center gap-3 p-3 rounded-md"
                style={{ background: "hsl(222 47% 5%)", border: "1px solid hsl(222 30% 16%)" }}
              >
                <Icon name="Link" size={14} className="gold-text flex-shrink-0" />
                <span className="text-xs text-muted-foreground flex-1 truncate font-mono">
                  {quest.uniqueLink}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(quest.uniqueLink)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 flex-shrink-0"
                >
                  <Icon name="Copy" size={12} />
                  Копировать
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Access request */}
      <div
        className="rounded-lg p-5"
        style={{ border: "1px dashed hsl(222 30% 22%)" }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: "hsl(43 85% 52% / 0.1)" }}
          >
            <Icon name="Lock" size={18} className="gold-text" />
          </div>
          <div className="flex-1">
            <div className="font-montserrat font-semibold text-sm text-white mb-0.5">
              Запросить доступ к квесту
            </div>
            <div className="text-xs text-muted-foreground">
              Ваш запрос будет отправлен владельцу для одобрения
            </div>
          </div>
          <button className="gold-btn px-4 py-2 rounded-md text-sm flex items-center gap-2">
            <Icon name="Send" size={14} />
            Запросить
          </button>
        </div>
      </div>
    </div>
  );
}
