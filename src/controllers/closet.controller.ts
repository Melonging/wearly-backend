import { Request, Response } from "express";
import { getHomeClosets } from "../services/closet.service.js";

export const handleListHomeCloset = async (req: Request, res: Response) => {
  console.log("홈 화면 옷장 목록 조회 요청 받음");

  // TODO: 인증 미들웨어에서 설정한 userId를 가져오기
  // 지금은 임시로 req.body나 req.params에서 가져옴
  const userId = req.body.userId || req.params.userId || 1; // 임시 기본값 1

  const closets = await getHomeClosets(userId);
  res.status(200).json({ success: true, data: closets }); //200 맞음?
};
