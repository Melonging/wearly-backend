import { Router } from 'express';
import {
  handleListHomeCloset,
  handleGetClothingInfo,
  getSectionClothesController
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     closet_id:
 *                       type: integer
 *                       example: 1
 *                     closet_name:
 *                       type: string
 *                       example: "봄/여름 옷장"
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
 *   responses:
 *     200:
 *       description: 옷 정보 조회 성공
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: true
 *               data:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   data:
 *                     type: object
 *                     properties:
 *                       clothing_id:
 *                         type: integer
 *                         example: 1
 *                       season:
 *                         type: string
 *                         example: "SUMMER"
 *                       color:
 *                         type: string
 *                         example: "WHITE"
 *                       temperature:
 *                         type: integer
 *                         nullable: true
 *                         example: 25
 *                       image:
 *                         type: string
 *                         example: "https://example.com/image.jpg"
 */
router.get("/clothing/:clothingId", handleGetClothingInfo);

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
 *   responses:
 *     200:
 *       description: 섹션 옷 조회 성공
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *               data:
 *                 type: object
 *                 properties:
 *                   section:
 *                     type: object
 *                     properties:
 *                       section_id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "상의"
 *                       closet_name:
 *                         type: string
 *                         example: "봄/가을 옷장"
 *                   clothes:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         clothing_id:
 *                           type: integer
 *                           example: 1
 *                         image:
 *                           type: string
 *                           example: "https://example.com/image.jpg"
 *                         category:
 *                           type: string
 *                           example: "티셔츠"
 *                         season:
 *                           type: string
 *                           enum: [SPRING, SUMMER, FALL, WINTER, ALL_SEASON]
 *                           example: "SPRING"
 *                         color:
 *                           type: string
 *                           enum: [BLACK, WHITE, GRAY, NAVY, BLUE, SKY_BLUE, RED, PINK, ORANGE, YELLOW, GREEN, KHAKI, BROWN, BEIGE, PURPLE, ETC]
 *                           example: "BLUE"
 *                         temperature:
 *                           type: integer
 *                           nullable: true
 *                           example: 20
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-01-15T12:00:00Z"
 *                   total_count:
 *                     type: integer
 *                     example: 10
 *     400:
 *       description: 잘못된 요청
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BadRequestError'
 *     401:
 *       description: 인증 실패
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               error:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: "401"
 *                   message:
 *                     type: string
 *                     example: "인증이 필요합니다."
 *     403:
 *       description: 권한 없음
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               error:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: "403"
 *                   message:
 *                     type: string
 *                     example: "해당 섹션에 접근 권한이 없습니다."
 *     404:
 *       description: 섹션을 찾을 수 없음
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               error:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: "404"
 *                   message:
 *                     type: string
 *                     example: "섹션을 찾을 수 없습니다."
 *     500:
 *       description: 서버 오류
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServerError'
 */
router.get('/sections/:sectionId/clothes', authenticateToken, getSectionClothesController);

console.log('✓ Closet router initialized');

export default router;