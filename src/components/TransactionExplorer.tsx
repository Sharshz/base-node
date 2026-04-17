import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'motion/react';
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
  Timer,
  ChevronLeft,
  ChevronRight,
  Zap,
  ChevronDown,
  ChevronUp,
  Box,
  CornerDownRight,
  ShieldCheck
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const generateMockDetails = (tx: any) => ({
  ...tx,
  blockNumber: Math.floor(Math.random() * 10000000),
  nonce: Math.floor(Math.random() * 500),
  fee: `${(Math.random() * 0.0001).toFixed(6)} ETH`,
  maxPriorityFee: '0.001 gwei',
  timestamp: new Date().toISOString(),
});

const INITIAL_MOCK_TXS = Array.from({ length: 25 }).map((_, i) => generateMockDetails({
  hash: `0x${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 5)}`,
  from: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
  to: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
  value: `${(Math.random() * 5).toFixed(2)} ETH`,
  gas: `${(Math.random() * 0.001).toFixed(5)} ETH`,
  type: ['ZK_PROOF', 'TRANSFER', 'CONTRACT_CALL'][Math.floor(Math.random() * 3)],
  status: Math.random() > 0.2 ? 'confirmed' : 'pending',
  time: `${i + 1}m ago`
}));

const PAGE_SIZE = 10;

export const TransactionExplorer: React.FC = () => {
  const [allTxs, setAllTxs] = useState(INITIAL_MOCK_TXS);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLive, setIsLive] = useState(true);
  const [expandedTxHash, setExpandedTxHash] = useState<string | null>(null);

  useEffect(() => {
    if (!isLive) return;

    const socket = io();

    socket.on('new_transaction', (tx) => {
      const enhancedTx = generateMockDetails(tx);
      setAllTxs(prev => [enhancedTx, ...prev].slice(0, 100));
    });

    return () => {
      socket.disconnect();
    };
  }, [isLive]);

  const filteredTxs = allTxs.filter(tx => {
    const matchesStatus = statusFilter ? tx.status === statusFilter : true;
    const matchesType = typeFilter ? tx.type === typeFilter : true;
    const matchesSearch = searchQuery 
      ? tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.to.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesStatus && matchesType && matchesSearch;
  });

  const totalPages = Math.ceil(filteredTxs.length / PAGE_SIZE);
  const paginatedTxs = filteredTxs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, typeFilter, searchQuery]);

  const toggleExpand = (hash: string) => {
    setExpandedTxHash(expandedTxHash === hash ? null : hash);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-card/50 border-border h-12 rounded-xl focus-visible:ring-primary" 
            placeholder="Search by Transaction Hash / Address / Block..." 
          />
        </div>
        <Card className="border-border bg-primary/5 flex items-center justify-between px-4 h-12 rounded-xl">
          <div className="flex items-center">
            <Fuel className="w-4 h-4 text-primary mr-3" />
            <div>
              <p className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold">Base Gas Price</p>
              <p className="text-xs font-mono font-bold text-primary">0.001 gwei <span className="text-[10px] opacity-50 ml-1">(-98% vs L1)</span></p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsLive(!isLive)}
            className={cn(
              "h-8 px-2 rounded-lg text-[8px] uppercase tracking-tighter font-black transition-all",
              isLive ? "text-primary bg-primary/10 border border-primary/20" : "text-muted-foreground border border-transparent"
            )}
          >
            <Zap className={cn("w-3 h-3 mr-1.5 fill-current", isLive && "animate-pulse")} />
            {isLive ? 'Live Feed Active' : 'Feed Paused'}
          </Button>
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
        
        {(statusFilter || typeFilter || searchQuery) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => { setStatusFilter(null); setTypeFilter(null); setSearchQuery(''); }}
            className="h-8 text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10"
          >
            Clear Filters
          </Button>
        )}
      </div>

      <Card className="border-border bg-card/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Recent Transactions ({filteredTxs.length})
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              Page {currentPage} of {totalPages || 1}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="divide-y divide-border/50">
              {paginatedTxs.map((tx, i) => {
                const isExpanded = expandedTxHash === tx.hash;
                return (
                  <div key={tx.hash} className={cn(
                    "transition-all duration-300 border-l-2 border-transparent",
                    isExpanded ? "bg-white/5 border-primary py-0" : "hover:bg-white/5 hover:border-primary/30"
                  )}>
                    <div 
                      onClick={() => toggleExpand(tx.hash)}
                      className="p-6 cursor-pointer group flex items-start justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110",
                          tx.type === 'ZK_PROOF' ? "bg-primary/10 text-primary border border-primary/20" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                        )}>
                          {tx.type === 'ZK_PROOF' ? <Hash className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-mono text-xs font-bold group-hover:text-primary transition-colors">{tx.hash}</p>
                            <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'} className={cn(
                              "uppercase text-[8px] tracking-widest px-2 py-0 h-4 min-h-0",
                              tx.status === 'confirmed' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-pulse"
                            )}>
                              {tx.status}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{tx.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                          <p className="text-sm font-mono font-bold text-primary">{tx.value}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest uppercase">{tx.type}</p>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary" />}
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-8 pt-0 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-2xl bg-black/20 border border-border/30 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-3 opacity-5">
                                <ShieldCheck className="w-24 h-24 text-primary" />
                              </div>
                              
                              <div className="space-y-6">
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2 mb-1">
                                    <ArrowDownLeft className="w-3 h-3 text-red-500" />
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">From Address</p>
                                  </div>
                                  <p className="text-xs font-mono text-foreground break-all bg-white/5 p-2 rounded border border-white/5">{tx.from}</p>
                                </div>
                                
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2 mb-1">
                                    <ArrowUpRight className="w-3 h-3 text-green-500" />
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">To Address</p>
                                  </div>
                                  <p className="text-xs font-mono text-foreground break-all bg-white/5 p-2 rounded border border-white/5">{tx.to}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 bg-white/5 p-4 rounded-xl border border-white/5">
                                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Block Number</p>
                                  <div className="flex items-center gap-2">
                                    <Box className="w-3 h-3 text-primary/50" />
                                    <p className="text-sm font-mono font-bold">{tx.blockNumber}</p>
                                  </div>
                                </div>
                                <div className="space-y-1.5 bg-white/5 p-4 rounded-xl border border-white/5">
                                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Nonce</p>
                                  <p className="text-sm font-mono font-bold">{tx.nonce}</p>
                                </div>
                                <div className="space-y-1.5 bg-white/5 p-4 rounded-xl border border-white/5">
                                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Tx Fee</p>
                                  <p className="text-sm font-mono font-bold text-primary">{tx.fee}</p>
                                </div>
                                <div className="space-y-1.5 bg-white/5 p-4 rounded-xl border border-white/5">
                                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Gas Limit</p>
                                  <p className="text-sm font-mono font-bold">21,000</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between px-2">
                              <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                  <CornerDownRight className="w-3 h-3 text-primary" />
                                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Value: <span className="text-foreground ml-1">{tx.value}</span></p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Fuel className="w-3 h-3 text-primary" />
                                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Gas Price: <span className="text-foreground ml-1">{tx.gas}</span></p>
                                </div>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-9 px-4 rounded-xl text-[10px] uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/10 transition-all font-bold group"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`https://basescan.org/tx/${tx.hash}`, '_blank');
                                }}
                              >
                                View Detailed Scan 
                                <ExternalLink className="w-3 h-3 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-border/50 flex items-center justify-between bg-black/10">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, filteredTxs.length)} of {filteredTxs.length}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="h-8 w-8 p-0 rounded-lg border-border"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                    className="h-8 w-8 p-0 rounded-lg text-[10px] font-bold"
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="h-8 w-8 p-0 rounded-lg border-border"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
