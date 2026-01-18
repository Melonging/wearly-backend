import { Router } from 'express';
import {
  handleListHomeCloset,
  handleGetClothingInfo,
  getSectionClothesController,
  getClosetViewController
} from '../controllers/closet.controller';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /api/closet:
 * get:
 *   summary: 홈 화면 옷장 목록 조회
 *   tags: [Closet]
 *   parameters:
 *     - in: query
 *       name: userId
 *       schema:
 *         type: integer
 *       required: false
 *       description: 사용자 ID (임시, 나중에 인증 토큰으로 대체)
 *       example: 1
 *   responses:
 *     200:
 *       description: 옷장 목록 조회 성공
 */
router.get("/", handleListHomeCloset);

/**
 * @swagger
 * /api/closet/clothing/{clothingId}:
 * get:
 *   summary: 옷 상세 정보 조회
 *   tags: [Closet]
 *   parameters:
 *     - in: path
 *       name: clothingId
 *       required: true
 *       schema:
 *         type: integer
 *       description: 옷 ID
 *       example: 1
 */
router.get("/clothing/:clothingId", handleGetClothingInfo);

/**
 * @openapi
 * /api/closet/{closetId}/view:
 *   get:
 *     summary: 옷장 뷰 조회 (섹션 정보 포함)
 *     description: 홈 화면에서 옷장을 선택했을 때, 해당 옷장의 섹션 목록과 각 섹션에 포함된 옷 개수를 조회합니다.
 *     tags:
 *       - Closet
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
 */
router.get('/:closetId/view', authenticateToken, getClosetViewController);

/**
 * @swagger
 * /api/closet/sections/{sectionId}/clothes:
 * get:
 *   summary: 섹션 속 옷 조회
 *   description: 특정 섹션에 속한 모든 옷을 조회합니다.
 *   tags: [Closet]
 *   security:
 *     - bearerAuth: []
 *   parameters:
 *     - in: path
 *       name: sectionId
 *       required: true
 *       schema:
 *         type: integer
 *       description: 섹션 ID
 */
router.get('/sections/:sectionId/clothes', authenticateToken, getSectionClothesController);

console.log('✓ Closet router initialized');

export default router;