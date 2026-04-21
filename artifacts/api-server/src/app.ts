import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { globalLimiter } from "./middlewares/rateLimits";

const app: Express = express();

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // allow PayPal iframes
    contentSecurityPolicy: false,     // handled by frontend
  }),
);

// ─── CORS ─────────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /digitalgrowthsolutionsagency\.com$/,
  /\.replit\.dev$/,
  /\.repl\.co$/,
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // non-browser / curl
      const allowed = ALLOWED_ORIGINS.some((p) => p.test(origin));
      cb(allowed ? null : new Error("Not allowed by CORS"), allowed);
    },
    credentials: true,
  }),
);

// ─── Global rate limit ────────────────────────────────────────────────────────
app.use(globalLimiter);

// ─── Logging ─────────────────────────────────────────────────────────────────
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use("/api", router);

export default app;
