// src/routes/auth.ts
import { Router } from "express";
import * as authController from "../controllers/auth";

const router = Router();

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     summary: 회원가입
 *     description: 새로운 사용자를 등록합니다.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userid
 *               - userPassword
 *               - userName
 *               - gender
 *               - birthDate
 *             properties:
 *               userid:
 *                 type: string
 *                 example: "user123"
 *               userPassword:
 *                 type: string
 *                 example: "password1234"
 *               userName:
 *                 type: string
 *                 example: "홍길동"
 *               gender:
 *                 type: string
 *                 description: "남성, 여성, 선택안함 중 하나"
 *                 example: "남성"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1995-01-01"
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 userid:
 *                   type: string
 *                   example: "user123"
 *                 userName:
 *                   type: string
 *                   example: "홍길동"
 *                 error:
 *                   type: null
 *                   example: null
 *       400:
 *         description: 잘못된 요청 (필수값 누락, 형식 오류, 비밀번호 규칙 위반)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *       409:
 *         description: 중복된 아이디
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictError'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.post("/signup", authController.signup);

/**
 * @openapi
 * /api/auth/signin:
 *   post:
 *     summary: 로그인
 *     description: 사용자 아이디와 비밀번호로 로그인합니다.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginId
 *               - password
 *             properties:
 *               loginId:
 *                 type: string
 *                 example: "abc123"
 *               password:
 *                 type: string
 *                 example: "qwer123"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tokenType:
 *                   type: string
 *                   example: "Bearer"
 *                 accessToken:
 *                   type: string
 *                   description: JWT Access Token (1시간 유효)
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   description: JWT Refresh Token (7일 유효)
 *                   example: "rft_2f4c9c7e0c..."
 *                 expiresIn:
 *                   type: number
 *                   description: Access Token 만료 시간 (초 단위)
 *                   example: 3600
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: number
 *                       example: 1
 *                     userName:
 *                       type: string
 *                       example: "홍길동"
 *                 error:
 *                   type: null
 *       400:
 *         description: 필수값 누락
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *       401:
 *         description: 아이디 또는 비밀번호 불일치
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       403:
 *         description: 비활성화된 계정
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenError'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.post("/signin", authController.login);

/**
 * @openapi
 * /api/auth/send-code:
 *   post:
 *     summary: 이메일 인증 코드 발송
 *     description: 회원가입을 위한 6자리 인증 코드를 이메일로 발송합니다.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: 인증 코드 발송 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "인증 코드가 이메일로 발송되었습니다."
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     expiresIn:
 *                       type: number
 *                       description: 만료 시간 (초 단위)
 *                       example: 300
 *                 error:
 *                   type: null
 *       400:
 *         description: 잘못된 요청 (이메일 형식 오류)
 *       409:
 *         description: 이미 가입된 이메일
 *       500:
 *         description: 서버 오류 또는 이메일 발송 실패
 */
router.post("/send-code", authController.sendVerificationCode);

/**
 * @openapi
 * /api/auth/verify-code:
 *   post:
 *     summary: 이메일 인증 코드 검증
 *     description: 사용자가 입력한 6자리 인증 코드를 검증합니다.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: 인증 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "이메일 인증이 완료되었습니다."
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     verified:
 *                       type: boolean
 *                       example: true
 *                 error:
 *                   type: null
 *       400:
 *         description: 잘못된 인증 코드 또는 만료된 코드
 *       500:
 *         description: 서버 오류
 */
router.post("/verify-code", authController.verifyEmailCode);

/**
 * @openapi
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth 콜백
 *     description: Google에서 인증 코드를 받아 사용자 정보를 조회 및 로그인/회원가입 처리
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Google에서 받은 Authorization Code
 *     responses:
 *       200:
 *         description: Google 로그인/회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tokenType:
 *                   type: string
 *                   example: "Bearer"
 *                 accessToken:
 *                   type: string
 *                   description: JWT Access Token (1시간 유효)
 *                 refreshToken:
 *                   type: string
 *                   description: JWT Refresh Token (7일 유효)
 *                 expiresIn:
 *                   type: number
 *                   description: Access Token 만료 시간 (초 단위)
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: number
 *                     userName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     loginType:
 *                       type: string
 *                       example: "google"
 *                 error:
 *                   type: null
 *       400:
 *         description: 잘못된 Authorization Code
 *       401:
 *         description: 토큰 검증 실패
 *       409:
 *         description: 이미 가입된 이메일
 *       500:
 *         description: 서버 오류
 */
router.get("/google/callback", authController.googleCallback);

export default router;
