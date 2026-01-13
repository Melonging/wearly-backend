// src/controllers/auth.ts
import { Request, Response } from "express";
import { PrismaClient, Gender } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  getAccessTokenExpiresIn,
} from "../utils/jwt";
import { signupSuccess, apiError } from "../utils/response";

// Prisma Client 싱글톤 인스턴스
const prisma = new PrismaClient();

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
    const { userid, userPassword, gender, userName, birthDate } = req.body;

    // 1. 필수 입력값 확인
    if (!userid || !userPassword || !userName) {
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
            "userPassword"
          )
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
            "gender"
          )
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
            "birthDate"
          )
        );
    }

    const birthDateValue = new Date(birthDate);
    if (isNaN(birthDateValue.getTime())) {
      return res
        .status(400)
        .json(apiError(400, "유효하지 않은 생년월일입니다.", "birthDate"));
    }

    // 5. 아이디 중복 체크
    const existingUserById = await prisma.user.findUnique({
      where: { user_loginID: userid },
    });

    if (existingUserById) {
      return res
        .status(409)
        .json(apiError(409, "이미 사용중인 아이디입니다.", "userid"));
    }

    // 6. 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // 7. DB 저장
    const newUser = await prisma.user.create({
      data: {
        user_loginID: userid,
        password: hashedPassword,
        name: userName,
        gender: genderValue,
        birthDate: birthDateValue,
        active: true,
      },
    });

    // 8. 성공 응답
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
