import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { apiError } from "../utils/response";

// JWT 검증 미들웨어
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json(apiError(401, "토큰이 없습니다."));
  }

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (err: any) {
    if (err.message.includes("만료")) {
      return res.status(401).json(apiError(401, err.message));
    }
    return res
      .status(403)
      .json(apiError(403, err.message || "유효하지 않은 토큰입니다."));
  }
};

// 선택사항: Express 라우터와 함께 사용
// router.get('/protected', authenticateToken, controllerFunction);
