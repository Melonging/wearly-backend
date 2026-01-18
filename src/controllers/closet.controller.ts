import { Request, Response } from 'express';
import * as closetService from '../services/closet.service';
import { getHomeClosets, viewClothing } from "../services/closet.service.js";

export const handleListHomeCloset = async (req: Request, res: Response) => {
  console.log("홈 화면 옷장 목록 조회 요청 받음");
  const userId = req.query.userId ? parseInt(req.query.userId as string) : 1;

  const closets = await getHomeClosets(userId);
  res.status(200).json({ success: true, data: closets });
};

export const handleGetClothingInfo = async (req: Request, res: Response) => {
  console.log("옷 정보 조회 요청 받음");
  const clothingId = req.params.clothingId
    ? parseInt(req.params.clothingId as string)
    : 1;

  const clothing = await viewClothing(clothingId);
  res.status(200).json({ success: true, data: clothing });
};

/**
 * 옷장 섹션 뷰 조회 컨트롤러
 * GET /api/closet/:closetId/view
 * 
 * 홈 화면에서 옷장 선택 시 호출
 * 옷장의 섹션들과 각 섹션에 포함된 옷 개수를 보여줌
 */
export const getClosetViewController = async (req: Request, res: Response) => {
  try {
    const closetId = parseInt(req.params.closetId);
    const userId = (req as any).user?.userId; // JWT 미들웨어에서 추출

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: '401',
          message: '인증이 필요합니다.',
        },
      });
    }

    if (isNaN(closetId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: '400',
          message: '유효하지 않은 옷장 ID입니다.',
          field: 'closetId',
        },
      });
    }

    const result = await closetService.getClosetSectionsView(closetId, userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('옷장 뷰 조회 에러:', error);

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