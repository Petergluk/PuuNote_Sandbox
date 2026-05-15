import type { ComponentType, ReactNode } from "react";


export interface PuuNode {
  id: string;
  type: "document" | "branch" | "note";
  title?: string;
  content: string;
  children: PuuNode[];
}

export interface CommandHook {
  id: string;
  label: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
  hotkey?: string;
  execute: () => void;
}

export interface CardActionHook {
  id: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  showOnHover?: boolean;
  isVisible?: (node: PuuNode) => boolean;
  onClick: (nodeId: string, node: PuuNode) => void;
}

export interface GlobalActionHook {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  onClick?: () => void;
  dropdownItems?: {
    id: string;
    label: string | ReactNode;
    icon?: ComponentType<{ size?: number; className?: string }>;
    onClick: () => void;
  }[];
}

export interface PluginHooks {
  onNodeCreated?: (node: PuuNode) => void;
  onNodeUpdated?: (nodeId: string, node: PuuNode) => void;
  onNodeDeleted?: (nodeId: string) => void;
}

export interface PluginDefinition {
  id: string;
  name: string;
  description: string;
  hooks?: PluginHooks;
  cardActions?: CardActionHook[];
  commands?: CommandHook[];
  headerActions?: GlobalActionHook[];
  footerActions?: GlobalActionHook[];
  settingsComponent?: ComponentType;
  init?: (api: PluginAPI) => void | Promise<void>;
  unload?: () => void | Promise<void>;
}

export interface PluginAPI {
  plugins: {
    addCommand: (command: CommandHook) => void;
  };
  document: {
    getNode: (id: string) => PuuNode | null;
    updateNodeContent: (id: string, content: string) => void;
  };
  getState?: () => any; // Returns the AppStore state
  addJob?: (title: string) => string;
  updateJobProgress?: (id: string, progress: number, statusText?: string) => void;
  completeJob?: (id: string, resultLabel: string, onClick?: () => void) => void;
  failJob?: (id: string, error: string) => void;
  toast?: (msg: string, type?: "success" | "error" | "warning" | "info") => void;
}

// Minimal mock Registry 
class MockRegistry {
  plugin: PluginDefinition | null = null;
  api: PluginAPI;
  
  nodes: PuuNode[] = [
    {
      id: "test-node-1",
      type: "note",
      title: "Test Note",
      content: "This is a test node to visualize card actions.",
      children: []
    }
  ];
  listeners: (() => void)[] = [];

  constructor() {
    this.api = {
      plugins: {
        addCommand: () => {},
      },
      document: {
        getNode: (id) => this.nodes.find(n => n.id === id) || null,
        updateNodeContent: (id, content) => {
          const node = this.nodes.find(n => n.id === id);
          if (node) {
            node.content = content;
            this.notify();
          }
        },
      },
      getState: () => ({ 
        nodes: this.nodes,
        addChild: (parentId: string, content: string) => {
          const newNode: PuuNode = {
            id: "node-" + Date.now(),
            type: "note",
            content,
            children: []
          };
          this.nodes = [...this.nodes, newNode];
          this.notify();
          return newNode;
        },
        setNodes: (newNodes: PuuNode[]) => {
          this.nodes = newNodes;
          this.notify();
        }
      }),
      addJob: () => "job-" + Date.now(),
      updateJobProgress: (id, progress, statusText) => console.log(`Job ${id}: ${progress}% - ${statusText}`),
      completeJob: (id) => console.log(`Job ${id} completed`),
      failJob: (id, error) => console.error(`Job ${id} failed:`, error),
      toast: (msg, type) => alert(`Toast (${type}): ${msg}`),
    };
  }

  notify() {
    this.listeners.forEach(l => l());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  register(def: PluginDefinition) {
    this.plugin = def;
    if (def.init) {
      def.init(this.api);
    }
    this.notify();
  }

  getPlugin() {
    return this.plugin;
  }
}

export const registry = new MockRegistry();
