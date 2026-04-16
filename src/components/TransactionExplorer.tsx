import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  ExternalLink,
  Clock,
  Hash,
  Fuel,
  CheckCircle2,
  Timer
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const MOCK_TXS = [
  { hash: '0x7a2...f4e', from: '0x123...abc', to: '0xdef...456', value: '1.24 ETH', gas: '0.00042 ETH', type: 'ZK_PROOF', status: 'confirmed', time: '2s ago' },
  { hash: '0x3b1...d2a', from: '0x789...def', to: '0xabc...123', value: '0.05 ETH', gas: '0.00021 ETH', type: 'TRANSFER', status: 'confirmed', time: '15s ago' },
  { hash: '0x9c4...e8b', from: '0x456...789', to: '0x123...456', value: '12.50 ETH', gas: '0.00125 ETH', type: 'CONTRACT_CALL', status: 'pending', time: 'Just now' },
  { hash: '0x1d5...a3c', from: '0xabc...def', to: '0x789...012', value: '0.00 ETH', gas: '0.00038 ETH', type: 'ZK_PROOF', status: 'confirmed', time: '1m ago' },
  { hash: '0x5e6...b4d', from: '0x012...345', to: '0x678...901', value: '4.20 ETH', gas: '0.00021 ETH', type: 'TRANSFER', status: 'confirmed', time: '2m ago' },
  { hash: '0x2f7...c5e', from: '0x345...678', to: '0x901...234', value: '0.15 ETH', gas: '0.00045 ETH', type: 'ZK_PROOF', status: 'confirmed', time: '5m ago' },
];

export const TransactionExplorer: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const filteredTxs = MOCK_TXS.filter(tx => {
    const matchesStatus = statusFilter ? tx.status === statusFilter : true;
    const matchesType = typeFilter ? tx.type === typeFilter : true;
    return matchesStatus && matchesType;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-12 bg-card/50 border-border h-12 rounded-xl focus-visible:ring-primary" 
            placeholder="Search by Transaction Hash / Address / Block..." 
          />
        </div>
        <Card className="border-border bg-primary/5 flex items-center px-4 h-12 rounded-xl">
          <Fuel className="w-4 h-4 text-primary mr-3" />
          <div className="flex-1">
            <p className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold">Base Gas Price</p>
            <p className="text-xs font-mono font-bold text-primary">0.001 gwei <span className="text-[10px] opacity-50 ml-1">(-98% vs L1)</span></p>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between bg-card/30 p-4 rounded-xl border border-border/50">
        <div className="flex flex-wrap gap-6">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">Status</p>
            <div className="flex gap-2">
              <Button 
                variant={statusFilter === null ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setStatusFilter(null)}
                className="h-8 text-[10px] uppercase tracking-widest rounded-lg"
              >
                All
              </Button>
              <Button 
                variant={statusFilter === 'confirmed' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setStatusFilter('confirmed')}
                className="h-8 text-[10px] uppercase tracking-widest rounded-lg"
              >
                <CheckCircle2 className="w-3 h-3 mr-2" /> Confirmed
              </Button>
              <Button 
                variant={statusFilter === 'pending' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setStatusFilter('pending')}
                className="h-8 text-[10px] uppercase tracking-widest rounded-lg"
              >
                <Timer className="w-3 h-3 mr-2" /> Pending
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">Type</p>
            <div className="flex gap-2">
              <Button 
                variant={typeFilter === null ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setTypeFilter(null)}
                className="h-8 text-[10px] uppercase tracking-widest rounded-lg"
              >
                All
              </Button>
              {['ZK_PROOF', 'TRANSFER', 'CONTRACT_CALL'].map(type => (
                <Button 
                  key={type}
                  variant={typeFilter === type ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setTypeFilter(type)}
                  className="h-8 text-[10px] uppercase tracking-widest rounded-lg"
                >
                  {type.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {(statusFilter || typeFilter) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => { setStatusFilter(null); setTypeFilter(null); }}
            className="h-8 text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10"
          >
            Clear Filters
          </Button>
        )}
      </div>

      <Card className="border-border bg-card/50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            Recent Transactions ({filteredTxs.length})
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="divide-y divide-border/50">
              {filteredTxs.map((tx, i) => (
                <div key={i} className="p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110",
                        tx.type === 'ZK_PROOF' ? "bg-primary/10 text-primary border border-primary/20" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      )}>
                        {tx.type === 'ZK_PROOF' ? <Hash className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-mono text-xs font-bold group-hover:text-primary transition-colors">{tx.hash}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{tx.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'} className={cn(
                        "uppercase text-[10px] tracking-widest px-3 py-1",
                        tx.status === 'confirmed' ? "bg-green-500/10 text-green-500 border-green-500/20" : "animate-pulse"
                      )}>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="space-y-1.5">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">From</p>
                      <p className="text-xs font-mono text-foreground/80">{tx.from}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">To</p>
                      <p className="text-xs font-mono text-foreground/80">{tx.to}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Value & Gas Est.</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-lg font-mono font-bold text-primary">{tx.value}</p>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-white/5 px-2 py-0.5 rounded border border-white/5">
                          <Fuel className="w-2.5 h-2.5" />
                          <span className="font-mono">{tx.gas}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-border/30">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-primary/20 text-primary/70">
                      {tx.type}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5">
                      View on BaseScan <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
