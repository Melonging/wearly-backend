import { supabase } from "../config/supabase";
import { Multer } from "multer";

export const uploadImageToStorage = async (
    file: Express.Multer.File,
    userId: number,
): Promise<string> => {
    try {
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        const bucketName = "clothing_images";

        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });
        
        if (error) {
            throw new Error('이미지 업로드 실패 ' + error.message);
        }

    const { data: {publicUrl}} = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
    
        return publicUrl;
    } catch (error) {
        console.error("이미지 업로드 처리 에러", error);
        throw error;
    }
}

// Buffer 업로드용 함수 추가(누끼 딴 버전 -> 버퍼 -> 스토리지)
export const uploadBufferToStorage = async (
    buffer: Buffer,
    userId: number,
    contentType: string = 'image/png'
): Promise<string> => {
    try {
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
        const bucketName = 'clothing_images';

        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, buffer, {
                contentType: contentType,
                upsert: false,
            });
    
        if (error) {
            throw new Error('이미지 업로드 실패 ' + error.message);
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (error) {
        console.error('버퍼 이미지 업로드 처리 에러', error);
        throw error;
    }
};