import React from 'react';
import { 
  Terminal, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Code2, 
  Database, 
  Settings,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: 'circuits', label: 'ZK Circuits', icon: Cpu },
    { id: 'node', label: 'Node Manager', icon: Database },
    { id: 'explorer', label: 'Base Explorer', icon: Activity },
    { id: 'security', label: 'Security Audit', icon: ShieldCheck },
    { id: 'sdk', label: 'SDK Docs', icon: Code2 },
  ];

  return (
    <div className="w-64 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col h-screen">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Layers className="w-5 h-5 text-primary-foreground" />
        </div>
        <h1 className="font-bold tracking-tight text-lg">BaseZK SDK</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
              activeTab === item.id 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-accent/50 rounded-lg p-3 flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Base Mainnet Connected</span>
        </div>
      </div>
    </div>
  );
};
