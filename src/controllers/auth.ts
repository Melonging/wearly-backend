// src/controllers/auth.ts
import { Request, Response } from "express";
import { PrismaClient, Gender } from "@prisma/client";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import {
  generateAccessToken,
  generateRefreshToken,
  getAccessTokenExpiresIn,
} from "../utils/jwt";
import { signupSuccess, apiError } from "../utils/response";
import {
  generateVerificationCode,
  sendVerificationEmail,
} from "../utils/email";

dotenv.config();

// Prisma Client 싱글톤 인스턴스
const prisma = new PrismaClient();

// Google OAuth 2.0 Client 초기화
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);
// 애플리케이션 종료 시 연결 해제
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

const genderMap: Record<string, Gender> = {
  남성: "MALE",
  여성: "FEMALE",
  선택안함: "PREFER_NOT_TO_SAY",
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { userid, userPassword, gender, userName, birthDate, email } =
      req.body;

    // 1. 필수 입력값 확인
    if (!userid || !userPassword || !userName || !email) {
      return res.status(400).json(apiError(400, "필수 항목이 누락되었습니다."));
    }

    // 2. 비밀번호 규칙 검증 (예: 최소 8자)
    if (userPassword.length < 8) {
      return res
        .status(400)
        .json(
          apiError(
            400,
            "비밀번호는 최소 8자 이상이어야 합니다.",
            "userPassword",
          ),
        );
    }

    // 3. 성별 형식 검증
    const genderValue = genderMap[gender];
    if (!genderValue) {
      return res
        .status(400)
        .json(
          apiError(
            400,
            '성별은 "남성", "여성", "선택안함" 중 하나여야 합니다.',
            "gender",
          ),
        );
    }

    // 4. 생년월일 형식 검증 (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthDate)) {
      return res
        .status(400)
        .json(
          apiError(
            400,
            "생년월일 형식이 올바르지 않습니다. (YYYY-MM-DD)",
            "birthDate",
          ),
        );
    }

    const birthDateValue = new Date(birthDate);
    if (isNaN(birthDateValue.getTime())) {
      return res
        .status(400)
        .json(apiError(400, "유효하지 않은 생년월일입니다.", "birthDate"));
    }

    // 5. 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json(apiError(400, "올바른 이메일 형식이 아닙니다.", "email"));
    }

    // 6. 아이디 중복 체크
    const existingUserById = await prisma.user.findUnique({
      where: { user_loginID: userid },
    });

    if (existingUserById) {
      return res
        .status(409)
        .json(apiError(409, "이미 사용중인 아이디입니다.", "userid"));
    }

    // 7. 이메일 중복 체크
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUserByEmail) {
      return res
        .status(409)
        .json(apiError(409, "이미 사용중인 이메일입니다.", "email"));
    }

    // 8. 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // 9. DB 저장
    const newUser = await prisma.user.create({
      data: {
        user_loginID: userid,
        email: email,
        password: hashedPassword,
        name: userName,
        gender: genderValue,
        birthDate: birthDateValue,
        active: true,
      },
    });

    // 10. 성공 응답
    res.status(201).json(signupSuccess(newUser.user_loginID, newUser.name));
  } catch (err: any) {
    console.error("회원가입 에러:", err);

    // Prisma 고유 제약조건 위반 에러 처리
    if (err.code === "P2002") {
      const field = err.meta?.target?.[0] || "unknown";
      return res
        .status(409)
        .json(apiError(409, `이미 사용중인 ${field}입니다.`, field));
    }

    res.status(500).json(apiError(500, "서버 오류가 발생했습니다."));
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { loginId, password } = req.body;

    // 1. 필수 입력값 확인
    if (!loginId || !password) {
      return res
        .status(400)
        .json(apiError(400, "아이디와 비밀번호를 입력해주세요."));
    }

    // 2. 사용자 조회
    const user = await prisma.user.findUnique({
      where: { user_loginID: loginId },
    });

    if (!user) {
      return res
        .status(401)
        .json(apiError(401, "아이디 또는 비밀번호가 일치하지 않습니다."));
    }

    // 3. 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json(apiError(401, "아이디 또는 비밀번호가 일치하지 않습니다."));
    }

    // 4. 계정 활성화 상태 확인
    if (!user.active) {
      return res.status(403).json(apiError(403, "비활성화된 계정입니다."));
    }

    // 5. Access Token 생성
    const accessToken = generateAccessToken(user.user_id, user.user_loginID);

    // 6. Refresh Token 생성
    const refreshToken = generateRefreshToken(user.user_id, user.user_loginID);

    // 7. 성공 응답
    res.status(200).json({
      success: true,
      tokenType: "Bearer",
      accessToken,
      refreshToken,
      expiresIn: getAccessTokenExpiresIn(),
      user: {
        userId: user.user_id,
        userName: user.name,
      },
      error: null,
    });
  } catch (err: any) {
    console.error("로그인 에러:", err);

    res.status(500).json(apiError(500, "서버 오류가 발생했습니다."));
  }
};

// 이메일 인증 코드 발송
export const sendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // 1. 이메일 필수 확인
    if (!email) {
      return res.status(400).json(apiError(400, "이메일을 입력해주세요."));
    }

    // 2. 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json(apiError(400, "올바른 이메일 형식이 아닙니다.", "email"));
    }

    // 3. 이메일 중복 체크 (이미 가입된 이메일인지)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(409)
        .json(apiError(409, "이미 가입된 이메일입니다.", "email"));
    }

    // 4. 6자리 인증 코드 생성
    const code = generateVerificationCode();

    // 5. 만료 시간 설정 (5분)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // 6. 기존 인증 코드 삭제 (같은 이메일의 미인증 코드)
    await prisma.emailVerification.deleteMany({
      where: {
        email,
        verified: false,
      },
    });

    // 7. DB에 인증 코드 저장
    await prisma.emailVerification.create({
      data: {
        email,
        code,
        expires_at: expiresAt,
      },
    });

    // 8. 이메일 발송
    const emailSent = await sendVerificationEmail(email, code);

    if (!emailSent) {
      return res.status(500).json(apiError(500, "이메일 발송에 실패했습니다."));
    }

    // 9. 성공 응답
    res.status(200).json({
      success: true,
      message: "인증 코드가 이메일로 발송되었습니다.",
      data: {
        email,
        expiresIn: 300, // 5분 (초 단위)
      },
      error: null,
    });
  } catch (err: any) {
    console.error("인증 코드 발송 에러:", err);
    res.status(500).json(apiError(500, "서버 오류가 발생했습니다."));
  }
};

// 이메일 인증 코드 검증
export const verifyEmailCode = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    // 1. 필수 입력값 확인
    if (!email || !code) {
      return res
        .status(400)
        .json(apiError(400, "이메일과 인증 코드를 입력해주세요."));
    }

    // 2. 인증 코드 조회
    const verification = await prisma.emailVerification.findFirst({
      where: {
        email,
        code,
        verified: false,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // 3. 인증 코드가 없는 경우
    if (!verification) {
      return res
        .status(400)
        .json(apiError(400, "잘못된 인증 코드입니다.", "code"));
    }

    // 4. 인증 코드 만료 확인
    if (new Date() > verification.expires_at) {
      return res
        .status(400)
        .json(apiError(400, "인증 코드가 만료되었습니다.", "code"));
    }

    // 5. 인증 성공 처리
    await prisma.emailVerification.update({
      where: {
        id: verification.id,
      },
      data: {
        verified: true,
      },
    });

    // 6. 성공 응답
    res.status(200).json({
      success: true,
      message: "이메일 인증이 완료되었습니다.",
      data: {
        email,
        verified: true,
      },
      error: null,
    });
  } catch (err: any) {
    console.error("인증 코드 검증 에러:", err);
    res.status(500).json(apiError(500, "서버 오류가 발생했습니다."));
  }
};

// Google 로그인/회원가입 콜백 핸들러
export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res
        .status(400)
        .json(apiError(400, "Authorization code가 필요합니다."));
    }

    // 1. Authorization Code를 Token으로 교환
    const { tokens } = await googleClient.getToken(code);
    const idToken = tokens.id_token;

    if (!idToken) {
      return res.status(401).json(apiError(401, "Invalid token from Google"));
    }

    // 2. ID Token 검증 및 사용자 정보 추출
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID || "",
    });

    const payload = ticket?.getPayload?.();
    if (!payload) {
      return res.status(401).json(apiError(401, "Invalid token payload"));
    }

    const { sub: googleId, email: googleEmail, name: userName } = payload;

    if (!googleId || !googleEmail) {
      return res
        .status(400)
        .json(apiError(400, "Google에서 필수 정보를 받을 수 없습니다."));
    }

    // 3. 기존 사용자 확인 (googleId로 찾기)
    // OauthAccount 통해 사용자 찾기
    let oauthAccount = await prisma.oauthAccount.findFirst({
      where: {
        provider: "google",
        provider_user_id: googleId,
      },
    });

    let user = null;
    if (oauthAccount) {
      user = await prisma.user.findUnique({
        where: { user_id: oauthAccount.user_id },
      });
    }

    // 4. 신규 사용자: 회원가입
    if (!user) {
      // googleEmail이 이미 존재하는지 확인
      const existingEmailUser = await prisma.user.findUnique({
        where: { email: googleEmail },
      });

      if (existingEmailUser) {
        // 이메일은 있지만 Google 계정과 연결되지 않음
        return res
          .status(409)
          .json(
            apiError(
              409,
              "이미 가입된 이메일입니다. 일반 로그인을 사용하세요.",
              "email",
            ),
          );
      }

      // 새 사용자 생성
      user = await prisma.user.create({
        data: {
          user_loginID: `google_${googleId}`,
          email: googleEmail,
          name: userName || "Wearly User",
          password: "", // Google 로그인은 비밀번호 없음
          googleId,
          googleEmail,
          loginType: "google",
          gender: "PREFER_NOT_TO_SAY", // 기본값
          birthDate: new Date("2000-01-01"), // 기본값
          active: true,
        },
      });

      // OauthAccount 생성
      await prisma.oauthAccount.create({
        data: {
          provider: "google",
          provider_user_id: googleId,
          user_id: user.user_id,
        },
      });
    }

    // 5. 비활성 계정 확인
    if (!user.active) {
      return res.status(403).json(apiError(403, "비활성화된 계정입니다."));
    }

    // 6. JWT 토큰 생성
    const accessToken = generateAccessToken(user.user_id, user.user_loginID);
    const refreshToken = generateRefreshToken(user.user_id, user.user_loginID);

    const expiresIn = getAccessTokenExpiresIn();

    // 7. Refresh Token을 DB에 저장 (선택사항)
    await prisma.token.create({
      data: {
        token_hash: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일
        user_id: user.user_id,
      },
    });

    // 8. 응답
    return res.status(200).json({
      success: true,
      tokenType: "Bearer",
      accessToken,
      refreshToken,
      expiresIn,
      user: {
        userId: user.user_id,
        userName: user.name,
        email: user.email,
        loginType: "google",
      },
      error: null,
    });
  } catch (err: any) {
    console.error("Google 콜백 에러:", err);
    if (err.message?.includes("Invalid value for: code")) {
      return res.status(400).json(apiError(400, "Invalid authorization code"));
    }
    res.status(500).json(apiError(500, "서버 오류가 발생했습니다."));
  }
};
