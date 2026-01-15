import { Request, Response } from "express";
import { getHomeClosets, viewClothing } from "../services/closet.service.js";

export const handleListHomeCloset = async (req: Request, res: Response) => {
  console.log("홈 화면 옷장 목록 조회 요청 받음");
  // TODO: 인증 미들웨어에서 설정한 userId를 가져오기
  // 지금은 임시로 query parameter에서 가져옴. 나중에 인증 미들웨어가 추가되면 파라미터에서 아이디를 제거할 계획임.
  const userId = req.query.userId ? parseInt(req.query.userId as string) : 1; // 임시 기본값 1

  const closets = await getHomeClosets(userId);
  res.status(200).json({ success: true, data: closets }); // 200 OK - 조회 성공
};

export const handleGetClothingInfo = async (req: Request, res: Response) => {
  console.log("옷 정보 조회 요청 받음");
  const clothingId = req.params.clothingId
    ? parseInt(req.params.clothingId as string)
    : 1; // 임시 기본값 1

  const clothing = await viewClothing(clothingId);
  res.status(200).json({ success: true, data: clothing }); // 200 OK - 조회 성공
};
