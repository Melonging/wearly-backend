import { homeCloset, clothing } from "../types/closetTypes";

export const responseFromClosetsInfo = (closets: homeCloset[]) => {
  return {
    success: true,
    data: closets,
    error: null,
  };
};

export const responseFromClothingInfo = (clothing: clothing) => {
  return {
    success: true,
    data: clothing,
    error: null,
  };
};
