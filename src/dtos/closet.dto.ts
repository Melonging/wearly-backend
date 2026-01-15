import { homeCloset } from "../types/closetTypes";

export const responseFromClosetsInfo = (closets: homeCloset[]) => {
  return {
    success: true,
    data: closets,
    error: null,
  };
};
