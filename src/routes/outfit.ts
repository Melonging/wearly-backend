import { Router } from "express";
import {
  handleCategoryView,
  handleCategoryClothesView,
} from "../controllers/outfit.controller";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /api/outfit/categories:
 *   get:
 *     summary: 카테고리 목록 조회
 *     description: 모든 의류 카테고리 목록을 조회합니다.
 *     tags: [Outfit]
 *     responses:
 *       200:
 *         description: 카테고리 목록 조회 성공
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
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category_id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "신발"
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: 카테고리를 찾을 수 없음
 */
router.get("/categories", handleCategoryView);

/**
 * @swagger
 * /api/outfit/categories/{categoryId}/clothes:
 *   get:
 *     summary: 카테고리별 옷 목록 조회
 *     description: 선택한 카테고리에 속한 모든 옷을 조회합니다.
 *     tags: [Outfit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 카테고리 ID
 *         example: 1
 *     responses:
 *       200:
 *         description: 카테고리별 옷 목록 조회 성공
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
 *                     clothes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           clothing_id:
 *                             type: integer
 *                             example: 1
 *                           image:
 *                             type: string
 *                             example: "https://example.com/image.jpg"
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 해당 카테고리의 옷을 찾을 수 없음
 */
router.get("/categories/:categoryId/clothes", handleCategoryClothesView);

console.log("✓ Outfit router initialized");

export default router;
