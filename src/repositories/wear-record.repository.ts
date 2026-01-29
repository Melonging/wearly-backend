import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // 보통 repository에서 한 번만 선언합니다.

// 기존에 같은 옷 조합이 있는지 확인
export const findExistingOutfit = async (userId: number, clothesIds: number[]) => {
    const outfits = await prisma.outfit.findMany({
        where: { user_id: userId },
        include: { outfitCloths: true },
    });

    return outfits.find(outfit => {
        const ids = outfit.outfitCloths.map(oc => oc.clothing_id).sort();
        return JSON.stringify(ids) === JSON.stringify([...clothesIds].sort());
    });
};

// 새로운 코디 생성
export const createOutfitWithClothes = async (userId: number, clothesIds: number[], isHeart: boolean, isStar: boolean) => {
    return await prisma.outfit.create({
        data: {
            user_id: userId,
            is_heart: isHeart,
            is_star: isStar,
            outfitCloths: {
                create: clothesIds.map(id => ({ clothing_id: id }))
            }
        }
    });
};

// 기존 코디 상태 업데이트 (하트, 별)
export const updateOutfitStatus = async (outfitId: number, isHeart: boolean, isStar: boolean) => {
    return await prisma.outfit.update({
        where: { outfit_id: outfitId },
        data: { is_heart: isHeart, is_star: isStar }
    });
};

// 착용 날짜 기록 저장
export const createWearDateRecord = async (userId: number, outfitId: number, wearDate: string, memo?: string) => {
    return await prisma.date.create({
        data: {
            user_id: userId,
            outfit_id: outfitId,
            wear_date: new Date(wearDate),
            memo: memo || null
        }
    });
};