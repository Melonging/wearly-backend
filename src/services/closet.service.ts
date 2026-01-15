import { getClosetsInfo } from "../repositories/closet.repository";
import { responseFromClosetsInfo } from "../dtos/closet.dto";

export const getHomeClosets = async (userId: number) => {
  // 홈 화면에 나열할 옷장들의 기본 정보를 DB에서 조회
  const closets = await getClosetsInfo(userId);
  if (!closets) {
    throw new Error("옷장 정보를 불러오는 데 실패했습니다.");
  }
  return responseFromClosetsInfo(closets);
};
