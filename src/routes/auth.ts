// src/routes/auth.ts
import { Router } from 'express';
import * as authController from '../controllers/auth'

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
router.post('/signup', authController.signup);

export default router;