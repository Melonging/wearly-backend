const multer = require('multer');

const storage = multer.memoryStorage();
export const upload = multer({
    storage : multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 } //20MB
});