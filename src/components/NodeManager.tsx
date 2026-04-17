import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [syncProgress, setSyncProgress] = useState(99.9);
  const [logs, setLogs] = useState<string[]>([]);
  const [stats, setStats] = useState({
    cpu: 42,
    ram: 68,
    disk: 84,
    peers: 12,
    blockHeight: 14205932
  });

  const handleStartNode = () => {
    setStatus('syncing');
    setSyncProgress(0);
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] Resuming ZK sync...`, ...prev].slice(0, 50));
    
    // Simulate sync process
    const duration = 3000;
    const interval = 50;
    let elapsed = 0;
    
    const syncTimer = setInterval(() => {
      elapsed += interval;
      const progress = Math.min(99.9, (elapsed / duration) * 100);
      setSyncProgress(progress);
      
      if (elapsed >= duration) {
        clearInterval(syncTimer);
        setStatus('running');
        setSyncProgress(99.9);
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ZK Prover Node online. Monitoring Base Mainnet...`, ...prev].slice(0, 50));
      }
    }, interval);
  };

  const handleStopNode = () => {
    setStatus('stopped');
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] Graceful shutdown initiated.`, ...prev].slice(0, 50));
    setTimeout(() => {
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ZK Prover Node offline.`, ...prev].slice(0, 50));
    }, 1000);
  };

  useEffect(() => {
    if (status !== 'running' && status !== 'syncing') return;

    const interval = setInterval(() => {
      setStats(prev => {
        const nextCpu = Math.min(100, Math.max(5, prev.cpu + (Math.random() * 16 - 8)));
        const nextRam = Math.min(100, Math.max(10, prev.ram + (Math.random() * 4 - 2)));
        const nextDisk = Math.min(100, Math.max(0, prev.disk + (Math.random() * 0.1 - 0.02))); // Disk grows slowly
        const nextBlock = prev.blockHeight + (Math.random() > 0.7 ? 1 : 0);
        
        // Only add log if block height changed
        if (nextBlock > prev.blockHeight) {
          const newLog = `[${new Date().toLocaleTimeString()}] Block ${nextBlock} verified. Peers: ${prev.peers} (Syncing ZK-Proof...)`;
          setLogs(logsPrev => [newLog, ...logsPrev].slice(0, 50));
        }

        return {
          ...prev,
          cpu: nextCpu,
          ram: nextRam,
          disk: nextDisk,
          blockHeight: nextBlock
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="CPU Usage" value={`${stats.cpu.toFixed(1)}%`} icon={Cpu} progress={stats.cpu} />
        <StatCard title="Memory" value={`${stats.ram.toFixed(1)}%`} icon={Server} progress={stats.ram} />
        <StatCard title="Storage" value={`${stats.disk.toFixed(1)}%`} icon={HardDrive} progress={stats.disk} />
        <StatCard title="Peers" value={stats.peers.toString()} icon={Network} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-border bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                ZK Prover Node Control
              </div>
              <Badge variant={status === 'running' ? 'outline' : status === 'syncing' ? 'secondary' : 'destructive'} className="text-[9px] h-4 uppercase tracking-tighter px-1.5">
                {status}
              </Badge>
            </div>
            <div className="flex gap-2">
              {status === 'running' || status === 'syncing' ? (
                <Button variant="destructive" size="sm" onClick={handleStopNode} className="h-8 text-[10px] uppercase tracking-widest" disabled={status === 'stopped'}>
                  <Square className="w-3 h-3 mr-2" /> Stop Node
                </Button>
              ) : (
                <Button variant="default" size="sm" onClick={handleStartNode} className="h-8 text-[10px] uppercase tracking-widest bg-green-600 hover:bg-green-700">
                  <Play className="w-3 h-3 mr-2" /> Start Node
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-black/20 rounded-xl border border-border overflow-hidden relative">
                {status === 'syncing' && (
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-primary/5 opacity-50 skew-x-12"
                  />
                )}
                <div className="flex items-center gap-4 relative z-10">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    status === 'running' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" : 
                    status === 'syncing' ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)] animate-bounce" : 
                    "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                  )} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold uppercase tracking-widest">{status}</p>
                      {status === 'syncing' && <RefreshCw className="w-3 h-3 animate-spin text-yellow-500" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">Base ZK-Sequencer v2.1.0 (Live)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-mono font-bold text-primary">{stats.blockHeight.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Current Block</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>Sync Progress</span>
                  <span className="text-primary">{syncProgress.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full bg-primary transition-all duration-300",
                      status === 'syncing' ? "animate-pulse" : ""
                    )} 
                    style={{ width: `${syncProgress}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-1">
                {[
                  { label: "ZKey Hardware Acceleration", value: "ENABLED (CUDA)" },
                  { label: "Base L2 Settlement", value: "OPTIMISTIC-ZK-HYBRID" },
                  { label: "Data Availability", value: "ETHEREUM-BLOBS" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-border/50 last:border-none text-xs">
                    <span className="text-muted-foreground uppercase tracking-widest text-[10px]">{item.label}</span>
                    <span className="text-primary font-mono font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Runtime Logs
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-[400px] w-full p-6 font-mono text-[10px] leading-relaxed">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2 mb-2 group">
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
  <Card className="border-border bg-card/50">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{title}</p>
        <Icon className="w-4 h-4 text-primary opacity-50" />
      </div>
      <p className="text-3xl font-mono font-bold mb-4">{value}</p>
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
