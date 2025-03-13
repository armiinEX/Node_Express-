const path = require('path');
const multer = require('multer');
const crypto = require('crypto');   // Node.js built-in module


module.exports = multer.diskStorage({
    distination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', "public", "courses", "covers"));
    },
    filename: (req, file, cb) => {

        // const fileName = Date.now() + String(Math.random() * 999);
        
        const hashedFileName = crypto
            .createHash('sha256')
            .update(file.originalname)
            .digest('hex');

        const ext = path.extname(file.originalname);
        cb(null, hashedFileName + ext);
    }
});