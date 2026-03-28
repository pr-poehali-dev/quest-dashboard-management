import { useState } from "react";
import Icon from "@/components/ui/icon";

type RiddleType = "text" | "image" | "video" | "audio";

interface Riddle {
  type: RiddleType;
  content: string;
  answer: string;
}

interface Level {
  id: number;
  title: string;
  riddle: Riddle;
  userAnswer: string;
  solved: boolean;
  showPass: boolean;
}

interface Quest {
  id: number;
  name: string;
  site: string;
  levels: Level[];
}

const initialQuests: Quest[] = [
  {
    id: 1,
    name: "Тайна замка",
    site: "Квест «Тайна замка»",
    levels: [
      {
        id: 1,
        title: "Уровень 1 — Ворота",
        riddle: { type: "text", content: "Что стоит посреди Волги?", answer: "буква" },
        userAnswer: "",
        solved: false,
        showPass: false,
      },
      {
        id: 2,
        title: "Уровень 2 — Тронный зал",
        riddle: { type: "text", content: "У семи братьев по одной сестре. Сколько сестёр всего?", answer: "одна" },
        userAnswer: "",
        solved: false,
        showPass: false,
      },
    ],
  },
];

const riddleTypeLabels: Record<RiddleType, string> = {
  text: "Текст",
  image: "Картинка",
  video: "Видео",
  audio: "Аудио",
};

const riddleTypeIcons: Record<RiddleType, string> = {
  text: "FileText",
  image: "Image",
  video: "Video",
  audio: "Music",
};

export default function QuestEditor() {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [activeQuestId, setActiveQuestId] = useState<number>(1);
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [newQuestName, setNewQuestName] = useState("");
  const [editingLevel, setEditingLevel] = useState<number | null>(null);

  const activeQuest = quests.find((q) => q.id === activeQuestId);

  const handleAddQuest = () => {
    if (!newQuestName.trim()) return;
    const newQuest: Quest = {
      id: Date.now(),
      name: newQuestName,
      site: newQuestName,
      levels: [],
    };
    setQuests([...quests, newQuest]);
    setActiveQuestId(newQuest.id);
    setNewQuestName("");
    setShowAddQuest(false);
  };

  const handleAddLevel = () => {
    if (!activeQuest) return;
    const newLevel: Level = {
      id: Date.now(),
      title: `Уровень ${activeQuest.levels.length + 1}`,
      riddle: { type: "text", content: "", answer: "" },
      userAnswer: "",
      solved: false,
      showPass: false,
    };
    setQuests(quests.map((q) =>
      q.id === activeQuestId ? { ...q, levels: [...q.levels, newLevel] } : q
    ));
    setEditingLevel(newLevel.id);
  };

  const updateLevel = (levelId: number, updates: Partial<Level>) => {
    setQuests(quests.map((q) =>
      q.id === activeQuestId
        ? { ...q, levels: q.levels.map((l) => (l.id === levelId ? { ...l, ...updates } : l)) }
        : q
    ));
  };

  const updateRiddle = (levelId: number, updates: Partial<Riddle>) => {
    setQuests(quests.map((q) =>
      q.id === activeQuestId
        ? {
            ...q,
            levels: q.levels.map((l) =>
              l.id === levelId ? { ...l, riddle: { ...l.riddle, ...updates } } : l
            ),
          }
        : q
    ));
  };

  const handleAnswer = (level: Level) => {
    const correct = level.userAnswer.trim().toLowerCase() === level.riddle.answer.toLowerCase();
    if (correct) {
      updateLevel(level.id, { solved: true, showPass: true });
    }
  };

  const removeLevel = (levelId: number) => {
    setQuests(quests.map((q) =>
      q.id === activeQuestId
        ? { ...q, levels: q.levels.filter((l) => l.id !== levelId) }
        : q
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Quest tabs */}
      <div className="flex items-center gap-3 flex-wrap">
        {quests.map((q) => (
          <button
            key={q.id}
            onClick={() => setActiveQuestId(q.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium font-montserrat transition-all ${
              activeQuestId === q.id
                ? "gold-btn"
                : "border border-border text-muted-foreground hover:text-foreground hover:border-yellow-500/30"
            }`}
          >
            {q.name}
          </button>
        ))}
        <button
          onClick={() => setShowAddQuest(!showAddQuest)}
          className="px-3 py-2 rounded-md text-sm border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-yellow-500/30 transition-all flex items-center gap-1.5"
        >
          <Icon name="Plus" size={14} />
          Новый путь
        </button>
      </div>

      {showAddQuest && (
        <div
          className="p-4 rounded-lg animate-fade-in"
          style={{ background: "hsl(222 40% 9%)", border: "1px solid hsl(43 85% 52% / 0.3)" }}
        >
          <div className="flex gap-3">
            <input
              value={newQuestName}
              onChange={(e) => setNewQuestName(e.target.value)}
              placeholder="Название нового пути (квеста)..."
              className="flex-1 bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-yellow-500/50"
              onKeyDown={(e) => e.key === "Enter" && handleAddQuest()}
            />
            <button onClick={handleAddQuest} className="gold-btn px-5 py-2 rounded-md text-sm">
              Создать
            </button>
          </div>
        </div>
      )}

      {activeQuest && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-montserrat font-bold text-white text-base">
                {activeQuest.name}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeQuest.levels.length} уровней
              </p>
            </div>
            <button onClick={handleAddLevel} className="gold-btn px-4 py-2 rounded-md text-sm flex items-center gap-2">
              <Icon name="Plus" size={15} />
              Добавить уровень
            </button>
          </div>

          {activeQuest.levels.length === 0 && (
            <div
              className="text-center py-12 rounded-lg"
              style={{ border: "1px dashed hsl(222 30% 22%)" }}
            >
              <Icon name="Map" size={32} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Нет уровней. Нажмите «Добавить уровень»</p>
            </div>
          )}

          <div className="space-y-4">
            {activeQuest.levels.map((level, idx) => (
              <div
                key={level.id}
                className="navy-card rounded-lg p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-montserrat font-bold text-xs"
                      style={{
                        background: "linear-gradient(135deg, hsl(43 85% 52%), hsl(38 75% 42%))",
                        color: "hsl(222 47% 6%)",
                      }}
                    >
                      {idx + 1}
                    </div>
                    {editingLevel === level.id ? (
                      <input
                        value={level.title}
                        onChange={(e) => updateLevel(level.id, { title: e.target.value })}
                        className="bg-secondary border border-border rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:border-yellow-500/50"
                      />
                    ) : (
                      <span className="font-montserrat font-semibold text-sm text-white">
                        {level.title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingLevel(editingLevel === level.id ? null : level.id)}
                      className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon name={editingLevel === level.id ? "Check" : "Pencil"} size={14} />
                    </button>
                    <button
                      onClick={() => removeLevel(level.id)}
                      className="p-1.5 rounded text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                </div>

                {editingLevel === level.id ? (
                  <div className="space-y-3">
                    {/* Riddle type */}
                    <div>
                      <label className="text-xs font-montserrat font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                        Тип загадки
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {(["text", "image", "video", "audio"] as RiddleType[]).map((type) => (
                          <button
                            key={type}
                            onClick={() => updateRiddle(level.id, { type })}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                              level.riddle.type === type
                                ? "gold-btn"
                                : "border border-border text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Icon name={riddleTypeIcons[type]} size={12} />
                            {riddleTypeLabels[type]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <label className="text-xs font-montserrat font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                        {level.riddle.type === "text" ? "Текст загадки" : "URL файла"}
                      </label>
                      <textarea
                        value={level.riddle.content}
                        onChange={(e) => updateRiddle(level.id, { content: e.target.value })}
                        rows={3}
                        placeholder={
                          level.riddle.type === "text"
                            ? "Введите текст загадки..."
                            : "Вставьте URL изображения / видео / аудио..."
                        }
                        className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-yellow-500/50 resize-none"
                      />
                    </div>

                    {/* Answer */}
                    <div>
                      <label className="text-xs font-montserrat font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                        Правильный ответ
                      </label>
                      <input
                        value={level.riddle.answer}
                        onChange={(e) => updateRiddle(level.id, { answer: e.target.value })}
                        placeholder="Слово-ответ..."
                        className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-yellow-500/50"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Show riddle */}
                    <div
                      className="p-4 rounded-md"
                      style={{ background: "hsl(222 47% 5%)", border: "1px solid hsl(222 30% 16%)" }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name={riddleTypeIcons[level.riddle.type]} size={13} className="gold-text" />
                        <span className="text-xs font-montserrat font-semibold uppercase tracking-wider gold-text">
                          {riddleTypeLabels[level.riddle.type]}
                        </span>
                      </div>
                      {level.riddle.content ? (
                        level.riddle.type === "text" ? (
                          <p className="text-sm text-foreground">{level.riddle.content}</p>
                        ) : (
                          <p className="text-xs text-muted-foreground truncate">{level.riddle.content}</p>
                        )
                      ) : (
                        <p className="text-xs text-muted-foreground italic">Загадка не задана</p>
                      )}
                    </div>

                    {/* Answer input (preview for participant) */}
                    <div className="flex items-center gap-3">
                      <input
                        value={level.userAnswer}
                        onChange={(e) => updateLevel(level.id, { userAnswer: e.target.value })}
                        placeholder="Введите ответ..."
                        disabled={level.solved}
                        className="flex-1 bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-yellow-500/50 disabled:opacity-50"
                        onKeyDown={(e) => e.key === "Enter" && handleAnswer(level)}
                      />
                      <button
                        onClick={() => handleAnswer(level)}
                        disabled={level.solved}
                        className="gold-btn px-4 py-2 rounded-md text-sm disabled:opacity-40"
                      >
                        Проверить
                      </button>
                    </div>

                    {/* Gold pass button */}
                    {level.showPass && (
                      <div className="flex justify-center animate-gold-appear">
                        <button
                          className="px-8 py-3 rounded-lg font-montserrat font-bold text-sm tracking-widest uppercase"
                          style={{
                            background: "linear-gradient(135deg, hsl(43 85% 55%) 0%, hsl(38 80% 45%) 40%, hsl(43 90% 58%) 100%)",
                            color: "hsl(222 47% 6%)",
                            border: "2px solid hsl(43 70% 45%)",
                            boxShadow: "0 0 30px hsl(43 85% 52% / 0.5), inset 0 1px 0 hsl(43 90% 70% / 0.5)",
                            letterSpacing: "0.12em",
                          }}
                        >
                          ✦ ПРОХОД ОТКРЫТ ✦
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
