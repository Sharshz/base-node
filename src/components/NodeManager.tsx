import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Network, 
  Play, 
  Square, 
  RefreshCw,
  ChevronRight,
  Terminal as TerminalIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export const NodeManager: React.FC = () => {
  const [status, setStatus] = useState<'running' | 'stopped' | 'syncing'>('running');
  const [logs, setLogs] = useState<string[]>([]);
  const [stats, setStats] = useState({
    cpu: 42,
    ram: 68,
    disk: 84,
    peers: 12,
    blockHeight: 14205932
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (status === 'running' || status === 'syncing') {
        setStats(prev => ({
          ...prev,
          cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() * 10 - 5))),
          ram: Math.min(100, Math.max(0, prev.ram + (Math.random() * 2 - 1))),
          blockHeight: prev.blockHeight + (Math.random() > 0.8 ? 1 : 0)
        }));

        const newLog = `[${new Date().toLocaleTimeString()}] Block ${stats.blockHeight} verified. Peers: ${stats.peers}`;
        setLogs(prev => [newLog, ...prev].slice(0, 50));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [status, stats.blockHeight, stats.peers]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="CPU Usage" value={`${stats.cpu.toFixed(1)}%`} icon={Cpu} progress={stats.cpu} />
        <StatCard title="Memory" value={`${stats.ram.toFixed(1)}%`} icon={Server} progress={stats.ram} />
        <StatCard title="Storage" value={`${stats.disk.toFixed(1)}%`} icon={HardDrive} progress={stats.disk} />
        <StatCard title="Peers" value={stats.peers.toString()} icon={Network} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none bg-card/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Node Control</CardTitle>
              <CardDescription>Manage your Base L2 node instance</CardDescription>
            </div>
            <div className="flex gap-2">
              {status === 'running' ? (
                <Button variant="destructive" size="sm" onClick={() => setStatus('stopped')}>
                  <Square className="w-4 h-4 mr-2" /> Stop Node
                </Button>
              ) : (
                <Button variant="default" size="sm" onClick={() => setStatus('running')} className="bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" /> Start Node
                </Button>
              )}
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" /> Restart
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-3 h-3 rounded-full animate-pulse",
                    status === 'running' ? "bg-green-500" : status === 'syncing' ? "bg-yellow-500" : "bg-red-500"
                  )} />
                  <div>
                    <p className="text-sm font-medium capitalize">{status}</p>
                    <p className="text-xs text-muted-foreground">Base Mainnet (Optimism Stack)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold">{stats.blockHeight.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Block</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs uppercase tracking-wider text-muted-foreground">
                  <span>Sync Progress</span>
                  <span>99.9%</span>
                </div>
                <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[99.9%] transition-all duration-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-card/30 backdrop-blur-sm flex flex-col">
          <CardHeader className="flex flex-row items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm uppercase tracking-widest font-bold">Node Logs</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-[300px] w-full p-4 font-mono text-[10px] leading-relaxed">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2 mb-1 group">
                  <ChevronRight className="w-3 h-3 text-primary shrink-0 opacity-50 group-hover:opacity-100" />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">{log}</span>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, progress }: any) => (
  <Card className="border-none bg-card/30 backdrop-blur-sm">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{title}</p>
        <Icon className="w-4 h-4 text-primary opacity-50" />
      </div>
      <p className="text-2xl font-mono font-bold mb-3">{value}</p>
      {progress !== undefined && (
        <div className="h-1 w-full bg-black/20 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-1000",
              progress > 80 ? "bg-red-500" : progress > 60 ? "bg-yellow-500" : "bg-primary"
            )} 
            style={{ width: `${progress}%` }} 
          />
        </div>
      )}
    </CardContent>
  </Card>
);

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
