import fetch from 'node-fetch';
const FormData = require('form-data')

const REMOVE_BG_API_KEY = process.env.REMOVEBG_API_KEY;

export const removeBackground = async(
    file: Express.Multer.File
): Promise<Buffer> => {
    try {
        if (!REMOVE_BG_API_KEY) {
            throw new Error('Remove.bg API 키가 설정되지 않았습니다.');
        }

        const formData = new FormData();
        formData.append('image_file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });
        formData.append('size', 'auto');

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': REMOVE_BG_API_KEY,
            },
            body: formData,
        });

        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    } catch (error) {
        console.error('배경 제거 처리 에러', error);
        throw error;
    }
}

