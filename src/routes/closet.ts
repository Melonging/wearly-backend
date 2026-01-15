import { Router } from "express";
import {
  handleListHomeCloset,
  handleGetClothingInfo,
} from "../controllers/closet.controller";

const router = Router();

/**
 * @swagger
 * /api/closet:
 *   get:
 *     summary: 홈 화면 옷장 목록 조회
 *     tags: [Closet]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         required: false
 *         description: 사용자 ID (임시, 나중에 인증 토큰으로 대체)
 *         example: 1
 *     responses:
 *       200:
 *         description: 옷장 목록 조회 성공
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
 *                     success:
 *                       type: boolean
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           closet_id:
 *                             type: integer
 *                             example: 1
 *                           closet_name:
 *                             type: string
 *                             example: "봄/여름 옷장"
 */
router.get("/", handleListHomeCloset);

/**
 * @swagger
 * /api/closet/clothing/{clothingId}:
 *   get:
 *     summary: 옷 상세 정보 조회
 *     tags: [Closet]
 *     parameters:
 *       - in: path
 *         name: clothingId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 옷 ID
 *         example: 1
 *     responses:
 *       200:
 *         description: 옷 정보 조회 성공
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
 *                     success:
 *                       type: boolean
 *                     data:
 *                       type: object
 *                       properties:
 *                         clothing_id:
 *                           type: integer
 *                           example: 1
 *                         season:
 *                           type: string
 *                           example: "SUMMER"
 *                         color:
 *                           type: string
 *                           example: "WHITE"
 *                         temperature:
 *                           type: integer
 *                           nullable: true
 *                           example: 25
 *                         image:
 *                           type: string
 *                           example: "https://example.com/image.jpg"
 */
router.get("/clothing/:clothingId", handleGetClothingInfo);

export default router;
