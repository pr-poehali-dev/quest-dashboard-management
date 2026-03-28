import { useState } from "react";
import Icon from "@/components/ui/icon";

const SITE_TEMPLATE = `# Соединительные данные для нового сайта QuestControl

## Идентификатор платформы
PLATFORM_ID: qc-{{SITE_ID}}

## Ключ API
API_KEY: {{API_KEY}}

## Вебхук для событий
WEBHOOK_URL: https://questcontrol.app/api/events/{{SITE_ID}}

## Как использовать:
1. Добавьте эти данные в настройки вашего сайта
2. При входе участника передавайте USER_TOKEN через заголовок Authorization
3. Для отслеживания прогресса используйте POST /api/progress
4. Для проверки доступа: GET /api/access?quest_id={{QUEST_ID}}&user={{USER_ID}}

## Инструкция по квестам:
- Каждый квест имеет уникальный QUEST_ID
- Уровни нумеруются от 1
- Ответы проверяются через /api/answer (метод POST)
- После верного ответа возвращается { "pass": true, "token": "..." }`;

const initialSites = [
  {
    id: "qc-001",
    name: "Квест «Тайна замка»",
    url: "tainazamka.ru",
    quests: 4,
    members: 18,
    status: "active",
    apiKey: "sk-abc123xyz",
  },
  {
    id: "qc-002",
    name: "Квест «Городской детектив»",
    url: "gordetektiv.ru",
    quests: 3,
    members: 21,
    status: "active",
    apiKey: "sk-def456uvw",
  },
  {
    id: "qc-003",
    name: "Квест «Лесная загадка»",
    url: "lesnazagadka.ru",
    quests: 2,
    members: 8,
    status: "pending",
    apiKey: "sk-ghi789rst",
  },
];

export default function Sites() {
  const [sites, setSites] = useState(initialSites);
  const [showTemplate, setShowTemplate] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSiteName, setNewSiteName] = useState("");

  const handleAddSite = () => {
    if (!newSiteName.trim()) return;
    const newId = `qc-00${sites.length + 1}`;
    setSites([
      ...sites,
      {
        id: newId,
        name: newSiteName,
        url: "",
        quests: 0,
        members: 0,
        status: "pending",
        apiKey: `sk-new${Math.random().toString(36).slice(2, 8)}`,
      },
    ]);
    setNewSiteName("");
    setShowAddForm(false);
  };

  const handleRemoveSite = (id: string) => {
    setSites(sites.filter((s) => s.id !== id));
  };

  const getTemplate = (site: (typeof initialSites)[0]) =>
    SITE_TEMPLATE.replace(/{{SITE_ID}}/g, site.id)
      .replace(/{{API_KEY}}/g, site.apiKey)
      .replace(/{{QUEST_ID}}/g, "QUEST_ID")
      .replace(/{{USER_ID}}/g, "USER_ID");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Управляйте подключёнными сайтами и их конфигурацией
        </p>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="gold-btn px-5 py-2.5 rounded-md text-sm flex items-center gap-2"
        >
          <Icon name="Plus" size={16} />
          Добавить сайт
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div
          className="p-4 rounded-lg animate-fade-in"
          style={{
            background: "hsl(222 40% 9%)",
            border: "1px solid hsl(43 85% 52% / 0.3)",
          }}
        >
          <h3 className="font-montserrat font-semibold text-sm text-white mb-3">
            Новый сайт
          </h3>
          <div className="flex gap-3">
            <input
              value={newSiteName}
              onChange={(e) => setNewSiteName(e.target.value)}
              placeholder="Название сайта / квеста..."
              className="flex-1 bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-yellow-500/50"
              onKeyDown={(e) => e.key === "Enter" && handleAddSite()}
            />
            <button onClick={handleAddSite} className="gold-btn px-5 py-2 rounded-md text-sm">
              Создать
            </button>
          </div>
        </div>
      )}

      {/* Sites list */}
      <div className="space-y-3">
        {sites.map((site) => (
          <div
            key={site.id}
            className="navy-card rounded-lg p-5 transition-all hover:border-yellow-500/20"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "hsl(43 85% 52% / 0.12)" }}
                >
                  <Icon name="Globe" size={20} className="gold-text" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-montserrat font-bold text-white text-base">
                      {site.name}
                    </h3>
                    <span
                      className={`role-badge ${
                        site.status === "active"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {site.status === "active" ? "Активен" : "Настройка"}
                    </span>
                  </div>
                  {site.url && (
                    <div className="text-xs text-muted-foreground mb-2">{site.url}</div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Map" size={12} className="gold-text" />
                      {site.quests} квестов
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Users" size={12} className="gold-text" />
                      {site.members} участников
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Key" size={12} />
                      {site.apiKey}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() =>
                    setShowTemplate(showTemplate === site.id ? null : site.id)
                  }
                  className="px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5"
                  style={{
                    background: "hsl(43 85% 52% / 0.1)",
                    color: "hsl(43 85% 60%)",
                    border: "1px solid hsl(43 85% 52% / 0.2)",
                  }}
                >
                  <Icon name="FileCode" size={13} />
                  Инструкция
                </button>
                <button
                  onClick={() => handleRemoveSite(site.id)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Icon name="Trash2" size={15} />
                </button>
              </div>
            </div>

            {/* Template */}
            {showTemplate === site.id && (
              <div className="mt-4 animate-fade-in">
                <div className="divider-gold mb-4" />
                <div className="flex items-center justify-between mb-2">
                  <span className="font-montserrat font-semibold text-xs uppercase tracking-wider gold-text">
                    Соединительные данные
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(getTemplate(site));
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <Icon name="Copy" size={12} />
                    Копировать
                  </button>
                </div>
                <pre
                  className="text-xs rounded-md p-4 overflow-x-auto leading-relaxed"
                  style={{
                    background: "hsl(222 47% 5%)",
                    border: "1px solid hsl(222 30% 16%)",
                    color: "hsl(215 20% 65%)",
                    fontFamily: "monospace",
                  }}
                >
                  {getTemplate(site)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
