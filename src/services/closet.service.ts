import {
  getClosetsInfo,
  getClothingInfo,
} from "../repositories/closet.repository";
import {
  responseFromClosetsInfo,
  responseFromClothingInfo,
} from "../dtos/closet.dto";

export const getHomeClosets = async (userId: number) => {
  // 홈 화면에 나열할 옷장들의 기본 정보를 DB에서 조회
  const closets = await getClosetsInfo(userId);
  if (!closets) {
    throw new Error("옷장 정보를 불러오는 데 실패했습니다.");
  }
  return responseFromClosetsInfo(closets);
};

export const viewClothing = async (clothingId: number) => {
  // 옷장에 있는 옷 하나의 정보를 DB에서 조회
  const clothing = await getClothingInfo(clothingId);
  if (!clothing) {
    throw new Error("옷 정보를 불러오는 데 실패했습니다.");
  }
  return responseFromClothingInfo(clothing);
};
