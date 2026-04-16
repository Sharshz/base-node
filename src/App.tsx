import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ZkCircuitEditor } from './components/ZkCircuitEditor';
import { NodeManager } from './components/NodeManager';
import { TransactionExplorer } from './components/TransactionExplorer';
import { Toaster } from '@/components/ui/sonner';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Lock, 
  BookOpen, 
  ChevronRight,
  Github,
  Twitter,
  Globe,
  Cpu
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function App() {
  const [activeTab, setActiveTab] = useState('circuits');

  const renderContent = () => {
    switch (activeTab) {
      case 'circuits':
        return <ZkCircuitEditor />;
      case 'node':
        return <NodeManager />;
      case 'explorer':
        return <TransactionExplorer />;
      case 'security':
        return <SecurityAudit />;
      case 'sdk':
        return <SdkDocs />;
      default:
        return <ZkCircuitEditor />;
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-foreground overflow-hidden font-sans selection:bg-primary/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full -z-10" />

        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-card/20 backdrop-blur-md z-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium capitalize">{activeTab.replace('-', ' ')}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">v0.4.2-alpha</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Twitter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}

const SecurityAudit = () => (
  <div className="max-w-4xl mx-auto space-y-6">
    <div className="text-center space-y-2 mb-8">
      <h2 className="text-3xl font-bold tracking-tight">Security Audit Engine</h2>
      <p className="text-muted-foreground">Automated vulnerability scanning for ZK circuits and smart contracts.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-none bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <ShieldAlert className="w-8 h-8 text-yellow-500 mb-2" />
          <CardTitle>Circuit Vulnerabilities</CardTitle>
          <CardDescription>Scanning for under-constrained signals and overflow risks.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
              <p className="text-sm font-bold text-yellow-500 mb-1">Potential Under-constraint</p>
              <p className="text-xs text-muted-foreground">Signal 'a' in Multiplier template may not be properly constrained in all branches.</p>
            </div>
            <Button className="w-full" variant="outline">Run Full Scan</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <Lock className="w-8 h-8 text-primary mb-2" />
          <CardTitle>Formal Verification</CardTitle>
          <CardDescription>Mathematical proof of circuit correctness using SMT solvers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm font-bold text-primary mb-1">SMT Solver Ready</p>
              <p className="text-xs text-muted-foreground">Verification keys generated. Ready to prove functional equivalence.</p>
            </div>
            <Button className="w-full">Initialize Solver</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const SdkDocs = () => (
  <div className="max-w-4xl mx-auto space-y-8">
    <div className="space-y-4">
      <h2 className="text-4xl font-bold tracking-tight">BaseZK SDK Documentation</h2>
      <p className="text-xl text-muted-foreground">Integrate Zero-Knowledge proofs into your Base applications with ease.</p>
    </div>

    <div className="grid gap-6">
      {[
        { title: "Installation", description: "Get started with npm install @basezk/sdk", icon: Globe },
        { title: "Circuit Design", description: "Learn how to write efficient ZK circuits for L2", icon: Cpu },
        { title: "Proof Generation", description: "Client-side and server-side proof generation strategies", icon: Layers },
        { title: "On-chain Verification", description: "Deploying verifier contracts on Base Mainnet", icon: ShieldAlert },
      ].map((doc, i) => (
        <Card key={i} className="border-none bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors cursor-pointer group">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <doc.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold">{doc.title}</h3>
              <p className="text-sm text-muted-foreground">{doc.description}</p>
            </div>
            <BookOpen className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

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
