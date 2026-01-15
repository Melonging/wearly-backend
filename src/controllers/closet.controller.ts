import { Request, Response } from 'express';
import * as closetService from '../services/closet.service';

/**
 * 섹션 속 옷 조회 컨트롤러
 * GET /api/closet/sections/:sectionId/clothes
 */
export const getSectionClothesController = async (req: Request, res: Response) => {
  try {
    const sectionId = parseInt(req.params.sectionId);
    const userId = (req as any).user?.user_id; // JWT 미들웨어에서 추출

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: '401',
          message: '인증이 필요합니다.',
        },
      });
    }

    if (isNaN(sectionId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: '400',
          message: '유효하지 않은 섹션 ID입니다.',
          field: 'sectionId',
        },
      });
    }

    const result = await closetService.getSectionClothes(sectionId, userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('섹션 옷 조회 에러:', error);

    if (error.message.startsWith('NOT_FOUND')) {
      return res.status(404).json({
        success: false,
        error: {
          code: '404',
          message: error.message.replace('NOT_FOUND: ', ''),
        },
      });
    }

    if (error.message.startsWith('FORBIDDEN')) {
      return res.status(403).json({
        success: false,
        error: {
          code: '403',
          message: error.message.replace('FORBIDDEN: ', ''),
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: '500',
        message: '서버 오류가 발생했습니다.',
      },
    });
  }
};