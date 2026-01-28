import { Request, Response, NextFunction } from "express";
import * as wearRecordService from "../services/wear-record.service";
import { CreateWearRecordRequestDto } from "../dtos/wear-record.dto";

export const postWearRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. 인증 미들웨어에서 넣어준 유저 정보 가져오기 (req.user 구조 확인 필요)
    const userId = (req as any).user.user_id; 
    const body: CreateWearRecordRequestDto = req.body;

    // 2. 간단한 유효성 검사
    if (!body.clothes_ids || body.clothes_ids.length === 0) {
        return res.status(400).json({
            success: false,
            message: "선택된 옷이 없습니다.",
            error: "EMPTY_CLOTHES_LIST"
        });
    }

    // 3. 서비스 호출
    const result = await wearRecordService.saveWearRecord(userId, body);

    // 4. 성공 응답
    return res.status(200).json({
      success: true,
      data: result,
      error: null
    });
  } catch (error: any) {
    console.error("착용 이력 저장 API 에러:", error);
    
    return res.status(500).json({
      success: false,
      message: "기록 정보를 저장할 수 없습니다.",
      error: "SERVER_ERROR"
    });
  }
};