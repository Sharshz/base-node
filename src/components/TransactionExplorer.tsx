import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  ExternalLink,
  Clock,
  Hash
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const MOCK_TXS = [
  { hash: '0x7a2...f4e', from: '0x123...abc', to: '0xdef...456', value: '1.24 ETH', type: 'ZK_PROOF', status: 'confirmed', time: '2s ago' },
  { hash: '0x3b1...d2a', from: '0x789...def', to: '0xabc...123', value: '0.05 ETH', type: 'TRANSFER', status: 'confirmed', time: '15s ago' },
  { hash: '0x9c4...e8b', from: '0x456...789', to: '0x123...456', value: '12.50 ETH', type: 'CONTRACT_CALL', status: 'pending', time: 'Just now' },
  { hash: '0x1d5...a3c', from: '0xabc...def', to: '0x789...012', value: '0.00 ETH', type: 'ZK_PROOF', status: 'confirmed', time: '1m ago' },
  { hash: '0x5e6...b4d', from: '0x012...345', to: '0x678...901', value: '4.20 ETH', type: 'TRANSFER', status: 'confirmed', time: '2m ago' },
  { hash: '0x2f7...c5e', from: '0x345...678', to: '0x901...234', value: '0.15 ETH', type: 'ZK_PROOF', status: 'confirmed', time: '5m ago' },
];

export const TransactionExplorer: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-10 bg-card/30 border-none backdrop-blur-sm focus-visible:ring-primary" 
            placeholder="Search by Transaction Hash / Address / Block..." 
          />
        </div>
        <Button variant="outline" className="bg-card/30 border-none backdrop-blur-sm">
          <Filter className="w-4 h-4 mr-2" /> Filters
        </Button>
      </div>

      <Card className="border-none bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="divide-y divide-border">
              {MOCK_TXS.map((tx, i) => (
                <div key={i} className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        tx.type === 'ZK_PROOF' ? "bg-primary/20 text-primary" : "bg-blue-500/20 text-blue-500"
                      )}>
                        {tx.type === 'ZK_PROOF' ? <Hash className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold group-hover:text-primary transition-colors">{tx.hash}</p>
                        <p className="text-xs text-muted-foreground">{tx.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'} className={cn(
                        tx.status === 'confirmed' ? "bg-green-500/10 text-green-500 border-green-500/20" : "animate-pulse"
                      )}>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">From</p>
                      <p className="text-xs font-mono">{tx.from}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">To</p>
                      <p className="text-xs font-mono">{tx.to}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Value</p>
                      <p className="text-sm font-bold text-primary">{tx.value}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-tighter">
                      {tx.type}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-primary">
                      View on BaseScan <ExternalLink className="w-3 h-3 ml-1" />
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
