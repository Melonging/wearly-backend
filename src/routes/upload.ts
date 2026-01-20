import { Router } from "express";
import { handleImageUpload, handleImageUploadAndRemoveBg } from "../controllers/upload.controller";
import { upload } from "../middlewares/multer";

const router = Router();

/**
 * @swagger
 * /api/upload/images:
 *   post:
 *     summary: 이미지 업로드
 *     description: 이미지를 Supabase Storage에 업로드하고 URL을 반환합니다.
 *     tags:
 *       - Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 이미지 파일
 *               userId:
 *                 type: integer
 *                 description: 사용자 ID (임시, 나중에 JWT로 대체)
 *                 example: 1
 *     responses:
 *       200:
 *         description: 이미지 업로드 성공
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
 *                     imageUrl:
 *                       type: string
 *                       example: "https://xxx.supabase.co/storage/v1/object/public/clothing-images/1/123456.jpg"
 *                 error:
 *                   type: null
 *       400:
 *         description: 잘못된 요청 (파일 누락)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.post("/images", upload.single("image"), handleImageUpload);

/**
 * @swagger
 * /api/upload/image-nobg:
 *   post:
 *     summary: 이미지 업로드 (배경 제거)
 *     description: Remove.bg API로 배경을 제거한 후 Supabase Storage에 업로드합니다.
 *     tags:
 *       - Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: 배경을 제거할 이미지 파일
 *               userId:
 *                 type: integer
 *                 description: 사용자 ID (임시, 나중에 JWT로 대체)
 *                 example: 1
 *     responses:
 *       200:
 *         description: 배경 제거 및 업로드 성공
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
 *                     imageUrl:
 *                       type: string
 *                       example: "https://xxx.supabase.co/storage/v1/object/public/clothing-images/1/123456.png"
 *                 error:
 *                   type: null
 *       400:
 *         description: 잘못된 요청 (파일 누락)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "파일이 업로드되지 않았습니다."
 *       500:
 *         description: 서버 오류 (배경 제거 실패 또는 업로드 실패)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "배경 제거 실패."
 */
router.post("/image-nobg", upload.single("image"), handleImageUploadAndRemoveBg);

export default router;