import { Router } from "express";
import { handleListHomeCloset } from "../controllers/closet.controller";

const router = Router();

/**
 * @swagger
 * /api/closets:
 *   get:
 *     summary: 홈 화면 옷장 목록 조회
 *     tags: [Closet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       closetId:
 *                         type: integer
 *                       closetName:
 *                         type: string
 */
router.get("/", handleListHomeCloset);

export default router;
