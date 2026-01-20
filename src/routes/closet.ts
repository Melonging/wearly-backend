import { Router } from "express";
import {
  handleListHomeCloset,
  handleGetClothingInfo,
  getSectionClothesController,
  getClosetViewController,
} from "../controllers/closet.controller";
import { authenticateToken } from "../middlewares/auth";

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
 *                             example: "여름 옷장"
 *                     error:
 *                       type: string
 *                       nullable: true
 *
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 유저를 찾을 수 없음
 */
router.get("/", authenticateToken, handleListHomeCloset);

/**
 * @swagger
 * /api/closet/{closetId}/view:
 *   get:
 *     summary: 옷장 뷰 조회 (섹션 정보 포함)
 *     description: 홈 화면에서 옷장을 선택했을 때, 해당 옷장의 섹션 목록과 각 섹션에 포함된 옷 개수를 조회합니다.
 *     tags: [Closet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: closetId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 옷장의 ID
 *         example: 1
 *     responses:
 *       200:
 *         description: 옷장 뷰 조회 성공
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
 *                     closet_id:
 *                       type: integer
 *                       example: 1
 *                     closet_name:
 *                       type: string
 *                       example: "여름 옷장"
 *                     sections:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           section_id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "상의"
 *                           clothes_count:
 *                             type: integer
 *                             example: 5
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 옷장을 찾을 수 없음
 */
router.get("/:closetId/view", authenticateToken, getClosetViewController);

/**
 * @swagger
 * /api/closet/sections/{sectionId}/clothes:
 *   get:
 *     summary: 섹션 속 옷 조회
 *     description: 특정 섹션에 속한 모든 옷을 조회합니다.
 *     tags: [Closet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 섹션 ID
 *         example: 1
 *     responses:
 *       200:
 *         description: 섹션 속 옷 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       clothing_id:
 *                         type: integer
 *                         example: 1
 *                       season:
 *                         type: string
 *                         enum: [SPRING, SUMMER, FALL, WINTER, ALL_SEASON]
 *                         example: "SUMMER"
 *                       color:
 *                         type: string
 *                         enum: [BLACK, WHITE, GRAY, NAVY, BLUE, SKY_BLUE, RED, PINK, ORANGE, YELLOW, GREEN, KHAKI, BROWN, BEIGE, PURPLE, ETC]
 *                         example: "WHITE"
 *                       temperature:
 *                         type: integer
 *                         nullable: true
 *                         example: 25
 *                       image:
 *                         type: string
 *                         example: "https://via.placeholder.com/300x400"
 *                       categorySub_id:
 *                         type: integer
 *                         example: 1
 *                       section_id:
 *                         type: integer
 *                         example: 1
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 섹션을 찾을 수 없음
 */
router.get(
  "/sections/:sectionId/clothes",
  authenticateToken,
  getSectionClothesController,
);

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
 *                           example: 3
 *                         temperature:
 *                           type: integer
 *                           nullable: true
 *                           example: 25
 *                         season:
 *                           type: string
 *                           enum: [SPRING, SUMMER, FALL, WINTER, ALL_SEASON]
 *                           example: "SUMMER"
 *                         color:
 *                           type: string
 *                           enum: [BLACK, WHITE, GRAY, NAVY, BLUE, SKY_BLUE, RED, PINK, ORANGE, YELLOW, GREEN, KHAKI, BROWN, BEIGE, PURPLE, ETC]
 *                           example: "WHITE"
 *                         image:
 *                           type: string
 *                           example: "https://via.placeholder.com/300x400"
 *                         categorySub_id:
 *                           type: integer
 *                           example: 1
 *                         section_id:
 *                           type: integer
 *                           example: 2
 *                     error:
 *                       type: string
 *                       nullable: true
 *
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 옷을 찾을 수 없음
 */
router.get("/clothing/:clothingId", authenticateToken, handleGetClothingInfo);

console.log("✓ Closet router initialized");

export default router;
