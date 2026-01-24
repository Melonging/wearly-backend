import { Router } from "express";
import { handleCategoryView } from "../controllers/outfit.controller";
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
 *                             example: "SHOES"
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: 카테고리를 찾을 수 없음
 */
router.get("/categories", handleCategoryView);

console.log("✓ Outfit router initialized");

export default router;
