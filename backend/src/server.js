import express from "express";
import path from "path";
import { exec } from "child_process";
import fs from "fs";
import os from "os";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
//import helmet from "helmet";

import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import connectDB from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";

const app = express();
const __dirname = path.resolve();

// ─────────────────────────────────────────────
// 🔐 MIDDLEWARE
// ─────────────────────────────────────────────

app.use(morgan(ENV.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS (only needed in dev)
app.use(
  cors({
    origin:
      ENV.NODE_ENV === "production"
        ? true // same origin in production
        : ["http://localhost:5173"],
    credentials: true,
  })
);

// ✅ Clerk auth
app.use(clerkMiddleware());

// ─────────────────────────────────────────────
// 🧠 HEALTH CHECK
// ─────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running 🚀",
    env: ENV.NODE_ENV,
  });
});

// ─────────────────────────────────────────────
// ⚡ API ROUTES
// ─────────────────────────────────────────────
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.post("/execute", async (req, res) => {
  try {
    const { language, files } = req.body;
    const code = files?.[0]?.content;

    if (!code) {
      return res.status(400).json({ error: "No code provided" });
    }

    if (language !== "javascript") {
      return res.status(400).json({ error: "Only JS supported for now" });
    }

    // 🔥 Create temp file
    const fileName = `code-${Date.now()}.js`;
    const filePath = path.join(os.tmpdir(), fileName);

    fs.writeFileSync(filePath, code);

    // 🔥 Execute file
    exec(`node ${filePath}`, { timeout: 3000 }, (error, stdout, stderr)  => {
      // cleanup temp file
      fs.unlinkSync(filePath);

      if (error) {
        return res.json({ error: error.message });
      }

      if (stderr) {
        return res.json({ error: stderr });
      }

      return res.json({
        run: {
          stdout: stdout,
        },
      });
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ─────────────────────────────────────────────
// 🌍 PRODUCTION FRONTEND SERVING (IMPORTANT)
// ─────────────────────────────────────────────
if (ENV.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "frontend/dist");

  console.log("📦 Serving frontend from:", frontendPath);

  app.use(express.static(frontendPath));

  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      return res.sendFile(path.join(frontendPath, "index.html"));
    }
    next();
  });
}

// ─────────────────────────────────────────────
// 🚀 START SERVER
// ─────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();

    app.listen(ENV.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${ENV.PORT}`);
      console.log(`🌍 Environment: ${ENV.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Server start failed:", error);
    process.exit(1);
  }
};

startServer();