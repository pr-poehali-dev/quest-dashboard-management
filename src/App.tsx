import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Icon from "@/components/ui/icon";
import Dashboard from "@/pages/Dashboard";
import Sites from "@/pages/Sites";
import QuestEditor from "@/pages/QuestEditor";
import Members from "@/pages/Members";
import Achievements from "@/pages/Achievements";
import Profile from "@/pages/Profile";

export type Section = "dashboard" | "sites" | "quests" | "members" | "achievements" | "profile";

const navItems = [
  { id: "dashboard" as Section, label: "Панель управления", icon: "LayoutDashboard" },
  { id: "sites" as Section, label: "Управление сайтами", icon: "Globe" },
  { id: "quests" as Section, label: "Редактор квестов", icon: "Map" },
  { id: "members" as Section, label: "Участники", icon: "Users" },
  { id: "achievements" as Section, label: "Достижения", icon: "Trophy" },
  { id: "profile" as Section, label: "Личный кабинет", icon: "UserCircle" },
];

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard": return <Dashboard onNavigate={setActiveSection} />;
      case "sites": return <Sites />;
      case "quests": return <QuestEditor />;
      case "members": return <Members />;
      case "achievements": return <Achievements />;
      case "profile": return <Profile />;
      default: return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="flex h-screen overflow-hidden bg-background font-ibm">
        {/* Sidebar */}
        <aside
          className={`flex flex-col transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"}`}
          style={{
            background: "hsl(222 47% 5%)",
            borderRight: "1px solid hsl(222 30% 14%)",
            flexShrink: 0,
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
            <div
              className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, hsl(43 85% 52%) 0%, hsl(38 75% 42%) 100%)",
              }}
            >
              <span className="font-montserrat font-bold text-xs text-black">QC</span>
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <div className="font-montserrat font-bold text-sm text-white whitespace-nowrap">
                  QuestControl
                </div>
                <div className="text-xs whitespace-nowrap" style={{ color: "hsl(215 20% 45%)" }}>
                  Платформа управления
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="ml-auto text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              <Icon name={sidebarOpen ? "ChevronLeft" : "ChevronRight"} size={16} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`nav-item w-full text-left ${activeSection === item.id ? "active" : ""} ${!sidebarOpen ? "justify-center px-2" : ""}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon name={item.icon} size={18} className="flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-border">
            {sidebarOpen ? (
              <div className="text-xs" style={{ color: "hsl(215 20% 35%)" }}>
                <div className="font-montserrat font-semibold gold-text text-xs">Владелец</div>
                <div className="mt-1 truncate">Иван Петров</div>
              </div>
            ) : (
              <div className="flex justify-center">
                <Icon name="UserCircle" size={20} className="text-muted-foreground" />
              </div>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header
            className="flex items-center justify-between px-6 py-4 flex-shrink-0"
            style={{
              background: "hsl(222 40% 8%)",
              borderBottom: "1px solid hsl(222 30% 14%)",
            }}
          >
            <h1 className="section-title text-lg">
              {navItems.find((n) => n.id === activeSection)?.label}
            </h1>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                <Icon name="Bell" size={18} />
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ background: "hsl(43 85% 52%)" }}
                />
              </button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-montserrat font-bold text-xs"
                  style={{
                    background: "linear-gradient(135deg, hsl(43 85% 52%), hsl(38 75% 42%))",
                    color: "hsl(222 47% 6%)",
                  }}
                >
                  ИП
                </div>
                <span className="text-sm font-medium hidden sm:block">Иван Петров</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            {renderSection()}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
