import { Request, Response } from "express";
import * as outfitService from "../services/outfit.service";
import { getCategories } from "../services/outfit.service";

// 카테고리 전체 조회
export const handleCategoryView = async (req: Request, res: Response) => {
  console.log("카테고리 목록 조회 요청 받음");
  try {
    const categories = await getCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error: any) {
    console.error("카테고리 목록 조회 에러:", error);

    if (error.message.startsWith("NOT_FOUND")) {
      return res.status(404).json({
        success: false,
        error: {
          code: "404",
          message: error.message.replace("NOT_FOUND: ", ""),
        },
      });
    }

    if (error.message.startsWith("FORBIDDEN")) {
      return res.status(403).json({
        success: false,
        error: {
          code: "403",
          message: error.message.replace("FORBIDDEN: ", ""),
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: "500",
        message: "서버 오류가 발생했습니다.",
      },
    });
  }
};

// 카테고리에서 옷 조회
export const handleCategoryClothesView = async (
  req: Request,
  res: Response,
) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    const userId = (req as any).user?.userId || 1; // JWT 미들웨어에서 추출, 테스트용으로 기본값 1

    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "400",
          message: "유효하지 않은 카테고리 ID입니다.",
          field: "categoryId",
        },
      });
    }

    const result = await outfitService.getCategoryClothes(categoryId, userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("선택한 카테고리의 옷 조회 에러:", error);

    if (error.message.startsWith("NOT_FOUND")) {
      return res.status(404).json({
        success: false,
        error: {
          code: "404",
          message: error.message.replace("NOT_FOUND: ", ""),
        },
      });
    }

    if (error.message.startsWith("FORBIDDEN")) {
      return res.status(403).json({
        success: false,
        error: {
          code: "403",
          message: error.message.replace("FORBIDDEN: ", ""),
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: "500",
        message: "서버 오류가 발생했습니다.",
      },
    });
  }
};
