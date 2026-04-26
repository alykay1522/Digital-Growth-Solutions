import { Request, Response, NextFunction } from "express";
import { verifyToolToken } from "../lib/toolToken";

export function requireToolToken(toolKey: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["x-tool-token"];
    if (!token || typeof token !== "string") {
      return res.status(401).json({ error: "Payment required. Please complete checkout to access this tool." });
    }
    const payload = verifyToolToken(token, toolKey);
    if (!payload) {
      return res.status(403).json({ error: "Invalid or expired access token. Please purchase access again." });
    }
    next();
  };
}
