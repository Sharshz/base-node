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
    <div className="w-64 border-r border-border bg-[#0A0B0E] flex flex-col h-screen">
      <div className="p-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center font-black text-primary-foreground">
          V
        </div>
        <h1 className="font-bold tracking-tight text-sm uppercase">VaultZero</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200",
              activeTab === item.id 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-card/50 border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mainnet</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            All systems operational. ZK Prover load at 14%.
          </p>
        </div>
      </div>
    </div>
  );
};
