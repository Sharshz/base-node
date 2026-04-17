import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Mock transaction generator
  const generateTx = () => ({
    hash: `0x${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 5)}`,
    from: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
    to: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
    value: `${(Math.random() * 5).toFixed(2)} ETH`,
    gas: `${(Math.random() * 0.001).toFixed(5)} ETH`,
    type: ['ZK_PROOF', 'TRANSFER', 'CONTRACT_CALL'][Math.floor(Math.random() * 3)],
    status: Math.random() > 0.2 ? 'confirmed' : 'pending',
    time: "Just now"
  });

  // Broadcast a new transaction every 8 seconds
  setInterval(() => {
    const newTx = generateTx();
    io.emit("new_transaction", newTx);
  }, 8000);

  app.use(express.json());

  app.post("/api/transactions/details", (req, res) => {
    const { hashes } = req.body;
    if (!Array.isArray(hashes)) {
      return res.status(400).json({ error: "Hashes must be an array" });
    }

    const details = hashes.reduce((acc: any, hash: string) => {
      acc[hash] = {
        blockNumber: Math.floor(Math.random() * 10000000),
        nonce: Math.floor(Math.random() * 500),
        fee: `${(Math.random() * 0.0001).toFixed(6)} ETH`,
        maxPriorityFee: '0.001 gwei',
        timestamp: new Date().toISOString(),
        gasLimit: "21,000"
      };
      return acc;
    }, {});

    res.json(details);
  });

  io.on("connection", (socket) => {
    console.log("Client connected");
    
    // Send initial batch of transactions if needed (could be fetched from a database)
    // For now, we rely on the client's initial mock state and updates
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
