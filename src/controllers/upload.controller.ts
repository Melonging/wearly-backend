import { Request, Response } from "express";
import { uploadImageToStorage } from "../services/upload.service.js";

export const handleImageUpload = async (req: Request, res: Response) => {
  try {
    console.log("이미지 업로드 요청 받음");

    if(!req.file){
      return  res.status(400).json({ success: false, message: "파일이 업로드되지 않았습니다." });
    }

    // TODO: 인증 미들웨어에서 설정한 userId를 가져오기
    const userId = req.body.userId ? parseInt(req.body.userId as string) : 1; // 임시 기본값 1
    const imageUrl = await uploadImageToStorage(req.file, userId);

    res.status(200).json({
      success: true,
      data: {
        imageUrl,
      },
    }); // 200 OK - 업로드 성공
  } catch (error) {
    console.error("이미지 업로드 처리 에러", error);
    res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." }); // 500 Internal Server Error - 서버 오류
  }

}