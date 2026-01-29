import * as wearRecordRepository from "../repositories/wear-record.repository";
import { CreateWearRecordRequestDto, CreateWearRecordResponseDto } from "../dtos/wear-record.dto";

export const saveWearRecord = async (
    userId: number,
    data: CreateWearRecordRequestDto
): Promise<CreateWearRecordResponseDto> => {
    
    // 1. 기존 조합 확인
    let outfit = await wearRecordRepository.findExistingOutfit(userId, data.clothes_ids);

    let outfitId: number;
    if (outfit) {
        outfitId = outfit.outfit_id;
        // 상태 업데이트
        await wearRecordRepository.updateOutfitStatus(outfitId, data.is_heart || false, data.is_star || false);
    } else {
        // 2. 새 조합 생성
        const newOutfit = await wearRecordRepository.createOutfitWithClothes(
            userId, 
            data.clothes_ids, 
            data.is_heart || false, 
            data.is_star || false
        );
        outfitId = newOutfit.outfit_id;
    }

    // 3. 기록 저장
    const dateRecord = await wearRecordRepository.createWearDateRecord(
        userId,
        outfitId,
        data.wear_date,
        data.memo
    );

    return {
        date_id: dateRecord.date_id,
        outfit_id: outfitId
    };
};