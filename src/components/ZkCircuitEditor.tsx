import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  Cpu, 
  Activity,
  Zap,
  ChevronDown,
  ChevronUp,
  Terminal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { compileCircuit, generateProof, verifyProof, ZKProof } from '../lib/zk-mock';
import { toast } from 'sonner';

// Helper for conditional classes
const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

const DEFAULT_CIRCUIT = `pragma circom 2.0.0;

template Multiplier(n) {
    signal input a;
    signal input b;
    signal output c;

    c <== a * b;
}

component main = Multiplier(1000);`;

export const ZkCircuitEditor: React.FC = () => {
  const [code, setCode] = useState(DEFAULT_CIRCUIT);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [compilationResult, setCompilationResult] = useState<any>(null);
  const [proof, setProof] = useState<ZKProof | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [inputs, setInputs] = useState({ a: '3', b: '11' });

  const handleInputChange = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    setCompilationResult(null);
    setProof(null);
    setIsVerified(null);
    setShowDetails(false);
    try {
      const result = await compileCircuit(code);
      setCompilationResult(result);
      setShowDetails(true);
      toast.success("Circuit compiled successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleGenerateProof = async () => {
    setIsGenerating(true);
    setProof(null);
    setIsVerified(null);
    try {
      // Parse inputs to numbers for the mock logic
      const numericInputs = {
        a: parseInt(inputs.a) || 0,
        b: parseInt(inputs.b) || 0
      };
      const result = await generateProof(numericInputs);
      setProof(result);
      toast.success("Proof generated successfully");
    } catch (error: any) {
      toast.error("Failed to generate proof");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVerify = async () => {
    if (!proof) return;
    setIsVerifying(true);
    setIsVerified(null);
    try {
      const result = await verifyProof(proof);
      setIsVerified(result);
      if (result) {
        toast.success("Proof verified successfully!");
      } else {
        toast.error("Proof verification failed.");
      }
    } catch (error: any) {
      toast.error("Error during verification");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full overflow-hidden">
      <Card className="flex flex-col border-border bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            Quick Start: Initialize ZK Node
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setCode(DEFAULT_CIRCUIT); setCompilationResult(null); setProof(null); }} className="h-8 text-[10px] uppercase tracking-widest">
              <RefreshCw className="w-3 h-3 mr-2" /> Reset
            </Button>
            <Button size="sm" onClick={handleCompile} disabled={isCompiling} className="h-8 text-[10px] uppercase tracking-widest bg-primary text-primary-foreground">
              {isCompiling ? <RefreshCw className="w-3 h-3 mr-2 animate-spin" /> : <Play className="w-3 h-3 mr-2" />}
              Compile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-6 flex flex-col gap-4">
          <div className="flex-1 rounded-xl bg-[#050608] border border-white/5 p-6 font-mono text-sm overflow-hidden relative group">
            <Textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-full w-full bg-transparent border-none resize-none focus-visible:ring-0 p-0 text-[#C0C5CE] leading-relaxed"
              placeholder="Enter your circuit code here..."
            />
          </div>
          <Button variant="secondary" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-widest text-xs py-6 rounded-xl">
            View Documentation
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 overflow-hidden">
        <Card className="border-border bg-card/50">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Compilation Output
            </div>
          </CardHeader>
          <CardContent>
            {compilationResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/20 rounded-xl border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Constraints</p>
                    <p className="text-2xl font-mono font-bold text-primary">{compilationResult.constraints}</p>
                  </div>
                  <div className="p-4 bg-black/20 rounded-xl border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 uppercase text-[10px] tracking-widest">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Ready
                    </Badge>
                  </div>
                </div>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 mt-2 bg-black/40 rounded-xl border border-primary/20 space-y-4 relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none">
                          <Activity className="w-24 h-24 text-primary" />
                        </div>
                        
                        <div className="flex items-center gap-2 border-b border-border pb-3">
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          <h4 className="text-[10px] uppercase tracking-widest font-black text-foreground">Compilation Report</h4>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <Zap className="w-3 h-3 text-primary/50" />
                              <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Circuit ID</p>
                            </div>
                            <p className="text-xs font-mono text-foreground/80 break-all">{compilationResult.circuitId}</p>
                          </div>
                          
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-primary/50" />
                              <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Compiled At</p>
                            </div>
                            <p className="text-xs font-mono text-foreground/80">{new Date(compilationResult.compiledAt).toLocaleTimeString()}</p>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <Cpu className="w-3 h-3 text-primary/50" />
                              <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Backend</p>
                            </div>
                            <p className="text-xs font-mono text-foreground/80">Groth16 / WASM</p>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <Terminal className="w-3 h-3 text-primary/50" />
                              <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Optimization</p>
                            </div>
                            <p className="text-xs font-mono text-foreground/80">Level 2</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="p-4 bg-black/20 rounded-xl border border-border space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Circuit Parameters</p>
                    <Badge variant="outline" className="text-[9px] uppercase tracking-tighter opacity-50">Multiplier Template</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-muted-foreground ml-1">Input A</label>
                      <Input 
                        type="number" 
                        value={inputs.a}
                        onChange={(e) => handleInputChange('a', e.target.value)}
                        className="bg-black/40 border-border h-9 text-xs font-mono focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-muted-foreground ml-1">Input B</label>
                      <Input 
                        type="number" 
                        value={inputs.b}
                        onChange={(e) => handleInputChange('b', e.target.value)}
                        className="bg-black/40 border-border h-9 text-xs font-mono focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Button 
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 py-6 rounded-xl font-bold uppercase tracking-widest text-xs mt-2 overflow-hidden group" 
                    onClick={handleGenerateProof} 
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating Proof...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Layers className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Generate Proof
                      </span>
                    )}
                  </Button>
                  
                  {isGenerating && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3, ease: 'linear' }}
                      className="absolute bottom-[-2px] left-0 h-0.5 bg-primary/50 rounded-full"
                    />
                  )}
                </div>

                {isGenerating && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center"
                  >
                    <p className="text-[10px] uppercase tracking-widest text-primary font-bold animate-pulse">
                      Computing Witnesses & Generating SNARK Proof...
                    </p>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-xs uppercase tracking-widest">Compile a circuit to see output</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex-1 border-border bg-card/50 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Proof Explorer
              </div>
              <AnimatePresence>
                {isVerified !== null && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                  >
                    <Badge 
                      className={cn(
                        "uppercase text-[10px] tracking-widest px-3 py-1",
                        isVerified 
                          ? "bg-green-500/10 text-green-500 border-green-500/20" 
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      )}
                    >
                      {isVerified ? (
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Invalid
                        </span>
                      )}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardHeader>
          <CardContent className="h-full space-y-4">
            <ScrollArea className="h-[250px] w-full rounded-xl border border-border bg-black/20 p-6">
              {proof ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Proof Data (Base64)</p>
                    <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                      <code className="text-[10px] break-all text-primary/80 leading-relaxed">{proof.proof}</code>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Public Signals</p>
                    <div className="flex flex-wrap gap-2">
                      {proof.publicSignals.map((s, i) => (
                        <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-primary/20">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground italic text-xs uppercase tracking-widest opacity-50">
                  No proof generated yet
                </div>
              )}
            </ScrollArea>
            
            <AnimatePresence>
              {proof && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <Button 
                    className="w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 py-6 rounded-xl font-bold uppercase tracking-widest text-xs group"
                    onClick={handleVerify}
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    )}
                    {isVerifying ? "Verifying..." : "Verify Proof on Base"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function Layers(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
  )
}
