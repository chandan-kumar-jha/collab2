import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { connectDb } from "./lib/db.js";
import {clerkMiddleware} from '@clerk/express'
import cors from 'cors'
import { serve } from "inngest/express";
import { functions, inngest } from "./lib/inngest.js";
import { protectRoute } from "./middleware/protectRoute.js";
import chatRoute from './routes/chatRoutes.js'
import sessionRoutes from './routes/sessionRoutes.js'

const app = express();

const __dirname = path.resolve();


//middleware
app.use(express.json())

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      ENV.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}))
  app.use(clerkMiddleware())

  app.use("/api/inngest", serve({client: inngest, functions}))
  app.use("/api/chat", chatRoute)
  app.use('/api/sessions', sessionRoutes)

app.get("/hat", (req, res) => {
  res.status(200).json("hello hat");
});

app.get("/books", (req, res) => {
  req.auth;
  res.status(200).json("hello books");
});

app.get("/video-calls",protectRoute, (req, res) => {
  res.status(200).json("hello vide0");
});

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // ⬇ FIX: RegExp fallback route
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDb();
    app.listen(ENV.PORT, () => {
      console.log(`server ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("💥error in starting server", error);
  }
};

startServer();
