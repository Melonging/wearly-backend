import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const REFRESH_SECRET =
  process.env.REFRESH_SECRET || "your-refresh-secret-key-change-in-production";
const ACCESS_TOKEN_EXPIRATION = "1h";
const REFRESH_TOKEN_EXPIRATION = "7d";

// Access Token 생성
export const generateAccessToken = (
  userId: number,
  loginId: string
): string => {
  const token = jwt.sign(
    {
      userId,
      loginId,
      type: "access",
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRATION }
  );
  return token;
};

// Refresh Token 생성
export const generateRefreshToken = (
  userId: number,
  loginId: string
): string => {
  const token = jwt.sign(
    {
      userId,
      loginId,
      type: "refresh",
    },
    REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRATION }
  );
  return token;
};

// Access Token 만료 시간 (초 단위)
export const getAccessTokenExpiresIn = (): number => {
  return 3600; // 1시간 = 3600초
};

// JWT 토큰 생성 (이전 버전 호환성)
export const generateToken = (userId: number, loginId: string): string => {
  return generateAccessToken(userId, loginId);
};

// JWT 토큰 검증
export const verifyToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new Error("토큰이 만료되었습니다.");
    }
    if (err.name === "JsonWebTokenError") {
      throw new Error("유효하지 않은 토큰입니다.");
    }
    throw err;
  }
};

// Refresh Token 검증
export const verifyRefreshToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);
    return decoded;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new Error("리프레시 토큰이 만료되었습니다.");
    }
    if (err.name === "JsonWebTokenError") {
      throw new Error("유효하지 않은 리프레시 토큰입니다.");
    }
    throw err;
  }
};

// Authorization 헤더에서 토큰 추출
export const extractTokenFromHeader = (
  authHeader: string | undefined
): string | null => {
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1] ?? null;
};

// 토큰 디코드 (검증 없이)
export const decodeToken = (token: string): any => {
  try {
    return jwt.decode(token);
  } catch (err) {
    return null;
  }
};
