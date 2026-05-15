import type { PluginDefinition, PluginAPI } from "../registry";
import { Sparkles, FileUp, Settings, TerminalSquare, AlertCircle } from "lucide-react";

// Простой React-компонент для настроек плагина
function MyPluginSettings() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-app-text-secondary">
        Это демонстрационный компонент настроек плагина. Вы можете использовать любые React хуки (useState, useEffect и т.д.) здесь.
      </p>
      <label className="flex items-center gap-2 text-sm text-app-text-primary">
        <input type="checkbox" className="rounded border-app-border bg-app-input-bg text-app-accent focus:ring-app-accent" />
        Включить магические функции
      </label>
      <input 
        type="text" 
        placeholder="API Ключ или параметр..." 
        className="w-full px-3 py-2 rounded-lg border border-app-border bg-app-input-bg text-app-text-primary focus:outline-app-accent text-sm"
      />
    </div>
  );
}

let pluginApi: PluginAPI | null = null;

const myPlugin: PluginDefinition = {
  id: "my-test-plugin",
  name: "My Full Test Plugin",
  description: "A comprehensive sample plugin to test all UI hooks in the sandbox.",
  
  // 1. Жизненный цикл плагина
  init: (api) => {
    pluginApi = api;
    console.log("🛠️ Plugin Init: Плагин успешно загружен!");
  },
  unload: () => {
    console.log("🧹 Plugin Unload: Плагин выключен.");
  },

  // 2. Кнопки в Header (Шапке)
  headerActions: [
    {
      id: "test-header-action",
      label: "Import Data",
      icon: FileUp,
      dropdownItems: [
        {
          id: "import-pdf",
          label: "Import PDF Document",
          icon: FileUp,
          onClick: () => alert("Имитация: импорт PDF файла...")
        }
      ]
    }
  ],

  // 3. Кнопки на конкретной карточке (Node)
  cardActions: [
    {
      id: "test-card-action",
      label: "Magic Edit",
      icon: Sparkles,
      onClick: (id, node) => {
        alert(`Применение Magic Edit к карточке: ID "${id}" с текстом: "${node.title}"`);
      }
    }
  ],

  // 4. Кнопки в Footer (Подвале)
  footerActions: [
    {
      id: "test-footer-action",
      label: "System Status",
      icon: Settings,
      onClick: () => alert("Статус: Все системы работают нормально.")
    }
  ],

  // 5. Команды для Command Palette (Cmd/Ctrl + K)
  commands: [
    {
      id: "test-command-1",
      label: "Run Global Diagnostics",
      icon: TerminalSquare,
      execute: () => {
        alert("Запущена глобальная диагностика из Command Palette!");
      }
    },
    {
      id: "test-command-add-node",
      label: "Create Child Node via API",
      icon: Sparkles,
      execute: () => {
        if (!pluginApi || !pluginApi.getState) return;
        const state = pluginApi.getState();
        // Используем mock API для добавления карточки
        state.addChild("test-node-1", "Новая карточка, созданная плагином! ✨");
        pluginApi.toast?.("Новая карточка добавлена", "success");
      }
    }
  ],

  // 6. UI настроек в панели плагинов
  settingsComponent: MyPluginSettings,

  // 7. Хуки обработки данных
  hooks: {
    onNodeCreated: (node) => console.log("Событие: Создана новая нода", node),
    onNodeUpdated: (nodeId, node) => console.log("Событие: Нода обновлена", nodeId),
    onNodeDeleted: (nodeId) => console.log("Событие: Нода удалена", nodeId),
  }
};

export default myPlugin;

