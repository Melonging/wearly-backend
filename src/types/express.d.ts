import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        loginId: string;
        type?: "access" | "refresh";
        iat?: number;
        exp?: number;
      };
    }
  }
}
