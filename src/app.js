import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { EventEmitter } from 'events';

EventEmitter.defaultMaxListeners = 15

import authRoutes from "./routes/auth.routes.js";
import taksRoutes from "./routes/tasks.routes.js";
import { FRONTEND_URL } from "./config.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

const redisClient = new Redis({
  host: 'localhost',
  port: 6379,
});

// const RedisStore = connectRedis(session);

app.use(
  session({
    store: new connectRedis({ client: redisClient }),
    secret: 'tu_secreto',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api", taksRoutes);


export default app;
