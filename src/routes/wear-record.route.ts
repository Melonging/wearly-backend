import { Router } from "express";
import * as wearRecordController from "../controllers/wear-record.controller";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /api/v1/wear-records:
 *   post:
 *     summary: 착용 이력 저장
 *     description: 사용자가 입은 옷 조합을 코디(Outfit)로 등록하고, 해당 날짜의 착용 기록(Date)을 생성합니다.
 *     tags: [WearRecord]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - wear_date
 *               - clothes_ids
 *             properties:
 *               wear_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-01-28"
 *                 description: "YYYY-MM-DD 형식의 착용 날짜"
 *               clothes_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 5]
 *                 description: "착용 이력에 포함될 옷 PK 리스트"
 *               memo:
 *                 type: string
 *                 nullable: true
 *                 example: "오늘 면접 합격! 날씨가 생각보다 쌀쌀했음."
 *               is_heart:
 *                 type: boolean
 *                 default: false
 *                 example: true
 *               is_star:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *     responses:
 *       200:
 *         description: 착용 이력 저장 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     date_id:
 *                       type: integer
 *                       example: 999
 *                     outfit_id:
 *                       type: integer
 *                       example: 777
 *                 error:
 *                   type: "null"
 *                   example: null
 *       400:
 *         description: 잘못된 요청 (옷 ID 누락 등)
 *       401:
 *         description: 인증 실패 (토큰 오류)
 *       500:
 *         description: 서버 오류
 */
router.post("/", authenticateToken, wearRecordController.postWearRecord);

console.log("✓ Wear-record router initialized");

export default router;