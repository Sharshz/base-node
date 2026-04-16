import React, { useState } from 'react';
import { Play, Save, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { compileCircuit, generateProof, ZKProof } from '../lib/zk-mock';
import { toast } from 'sonner';

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
  const [compilationResult, setCompilationResult] = useState<any>(null);
  const [proof, setProof] = useState<ZKProof | null>(null);

  const handleCompile = async () => {
    setIsCompiling(true);
    try {
      const result = await compileCircuit(code);
      setCompilationResult(result);
      toast.success("Circuit compiled successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleGenerateProof = async () => {
    setIsGenerating(true);
    try {
      const result = await generateProof({ a: 3, b: 11 });
      setProof(result);
      toast.success("Proof generated successfully");
    } catch (error: any) {
      toast.error("Failed to generate proof");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden">
      <Card className="flex flex-col border-none bg-card/30 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-bold">Circuit Playground</CardTitle>
            <CardDescription>Write and compile Circom circuits</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCode(DEFAULT_CIRCUIT)}>
              <RefreshCw className="w-4 h-4 mr-2" /> Reset
            </Button>
            <Button size="sm" onClick={handleCompile} disabled={isCompiling}>
              {isCompiling ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
              Compile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <Textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-full min-h-[500px] font-mono text-sm bg-black/20 border-none resize-none focus-visible:ring-0 p-6"
            placeholder="Enter your circuit code here..."
          />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6 overflow-hidden">
        <Card className="border-none bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Compilation Output</CardTitle>
          </CardHeader>
          <CardContent>
            {compilationResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-black/20 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Constraints</p>
                    <p className="text-xl font-mono font-bold text-primary">{compilationResult.constraints}</p>
                  </div>
                  <div className="p-3 bg-black/20 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Status</p>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Ready
                    </Badge>
                  </div>
                </div>
                <Button className="w-full" variant="secondary" onClick={handleGenerateProof} disabled={isGenerating}>
                  {isGenerating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Layers className="w-4 h-4 mr-2" />}
                  Generate Proof
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">Compile a circuit to see output</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex-1 border-none bg-card/30 backdrop-blur-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Proof Explorer</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <ScrollArea className="h-[300px] w-full rounded-md border border-border bg-black/20 p-4">
              {proof ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-2">Proof Data (Base64)</p>
                    <code className="text-xs break-all text-primary/80">{proof.proof}</code>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-2">Public Signals</p>
                    <div className="flex gap-2">
                      {proof.publicSignals.map((s, i) => (
                        <Badge key={i} variant="secondary">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground italic text-sm">
                  No proof generated yet
                </div>
              )}
            </ScrollArea>
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
